class Model
  def initialize(id)
    @id = id
  end

  def ==(other)
    @id.to_s == other.id.to_s
  end

  attr_reader :id

  def self.property(name)
    klass = self.name.downcase
    self.class_eval <<-RUBY
      def #{name}
        _#{name}
      end

      def _#{name}
        redis.get("#{klass}:id:" + id.to_s + ":#{name}")
      end

      def #{name}=(val)
        redis.set("#{klass}:id:" + id.to_s + ":#{name}", val)
      end
    RUBY
  end
end

class User < Model
  def self.find_by_username(username)
    if id = $redis.get("user:username:#{username}")
      User.new(id)
    end
  end

  def self.find_by_id(id)
    if $redis.key?("user:id:#{id}:username")
      User.new(id)
    end
  end

  def self.create(username, password)
    user_id = $redis.incr("user:uid")
    salt = User.new_salt
    $redis.set("user:id:#{user_id}:username", username)
    $redis.set("user:username:#{username}", user_id)
    $redis.set("user:id:#{user_id}:salt", salt)
    $redis.set("user:id:#{user_id}:hashed_password", hash_pw(salt, password))
    $redis.push_head("users", user_id)
    User.new(user_id)
  end

  def self.new_users
    $redis.list_range("users", 0, 10).map do |user_id|
      User.new(user_id)
    end
  end

  def self.new_salt
    arr = %w(a b c d e f)
    (0..6).to_a.map{ arr[rand(6)] }.join
  end

  def self.hash_pw(salt, password)
    Digest::MD5.hexdigest(salt + password)
  end

  property :username
  property :salt
  property :hashed_password
end

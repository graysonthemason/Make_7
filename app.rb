require 'sinatra/base'
require 'redis'
require 'json'
require 'uri'
require 'pry'

class App < Sinatra::Base

  ########################
  # Configuration
  ########################

  configure do
    enable :logging
    enable :method_override
    enable :sessions
    $admin = false
    uri = URI.parse(ENV["REDISTOGO_URL"])
    $redis = Redis.new({:host => uri.host,
                        :port => uri.port,
                        :password => uri.password})

  ####################setup cookies?
    use Rack::Session::Cookie, :key => 'my_app_key',
                             :path => '/game',
                             :expire_after => 14400, # In seconds
                             :secret => 'secret_stuff'
  ##################################


  end

before do
  # unless %w(/login /signup).include?(request.path_info) or
  #   request.path_info =~ /\.css$/ or
  #   @logged_in_user = User.find_by_id(session["user_id"])
  #   redirect '/login', 303
  # end
  #   puts "logged in as:#{@logged_in_user.username}" if @logged_in_user
    logger.info "Request Headers: #{headers}"
    logger.warn "Params: #{params}"
  end

  after do
    logger.info "Response Headers: #{response.headers}"
  end
  ########################
  # Routes
  ########################

  get('/') do
    render(:erb, :"login")
  end

  get('/game') do
    game = Game.create(session["player1_id"], session["player2_id"])
    session["game_id"] = game.id.to_s
    binding.pry
    render(:html, :"game")
  end

  get('/menu') do
    render(:erb, :"menu")
  end

  get('/login_player2') do
    render(:erb, :"login2")
  end


  post('/signup_player1') do
    if params[:username] !~ /^\w+$/
      @signup_error = "Username must only contain letters, numbers and underscores."
    elsif $redis.get("user:username:#{params[:username]}")
      @signup_error = "That username is taken."
    elsif params[:username].length < 4
      @signup_error = "Username must be at least 4 characters"
    elsif params[:password].length < 6
      @signup_error = "Password must be at least 6 characters!"
    # elsif params[:password] != params[:password_confirmation]
    #   @signup_error = "Passwords do not match!"
    end
    if @signup_error
      puts @signup_error
      redirect to('/')
    else
      user = User.create(params[:username], params[:password])
      session["player1_id"] = user.id
      redirect to("/menu")
    end
  end

  post('/signup_player2') do
    if params[:username] !~ /^\w+$/
      @signup_error = "Username must only contain letters, numbers and underscores."
    elsif $redis.get("user:username:#{params[:username]}")
      @signup_error = "That username is taken."
    elsif params[:username].length < 4
      @signup_error = "Username must be at least 4 characters"
    elsif params[:password].length < 6
      @signup_error = "Password must be at least 6 characters!"
    # elsif params[:password] != params[:password_confirmation]
    #   @signup_error = "Passwords do not match!"
    end
    if @signup_error
      puts @signup_error
      redirect to('/')
    else
      user = User.create(params[:username], params[:password])
      session["player2_id"] = user.id
      redirect to("/game")
    end
  end

  post('/login_player1') do
    user = User.find_by_username(params[:username])
    if user && User.hash_pw($redis.get("user:id:#{user.id}:salt"), params[:password]) == $redis.get("user:id:#{user.id}:hashed_password")
      session["player1_id"] = user.id
      redirect '/menu'
    else
      @login_error = "Incorrect username or password"
      redirect '/'
    end
  end

  post('/login_player2') do
    user = User.find_by_username(params[:username])
    if user && User.hash_pw($redis.get("user:id:#{user.id}:salt"), params[:password]) == $redis.get("user:id:#{user.id}:hashed_password")
      session["player2_id"] = user.id
      redirect '/game'
    else
      @login_error = "Incorrect username or password"
      redirect '/login_player2'
    end
  end

end

############################################

class User
  attr_reader :id
  def initialize(id)
    @id = id
  end

  def self.create(username, password)
    user_id = $redis.incr("user:uid")
    salt = User.new_salt
    $redis.set("user:id:#{user_id}:username", username)
    $redis.set("user:username:#{username}", user_id)
    $redis.set("user:id:#{user_id}:salt", salt)
    $redis.set("user:id:#{user_id}:hashed_password", hash_pw(salt, password))
    $redis.set("user:id:#{user_id}:wins", "0")
    $redis.set("user:id:#{user_id}:losses", "0")
    User.new(user_id)
  end

  def self.new_salt
    arr = %w(a b c d e f)
    (0..6).to_a.map{ arr[rand(6)] }.join
  end

  def self.hash_pw(salt, password)
    Digest::MD5.hexdigest(salt + password)
  end

  def self.find_by_username(username)
    if id = $redis.get("user:username:#{username}")
      User.new(id)
    end
  end
end

############################################

class Game
  attr_reader :id
  def initialize(id)
  @id = id
  end
  def self.create(player1, player2)
    game_id = $redis.incr("game:gid")
    $redis.set("game:id:#{game_id}:player1_id", player1)
    $redis.set("game:id:#{game_id}:player2_id", player2)
    Game.new(game_id)
  end
end

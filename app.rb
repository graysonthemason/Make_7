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
  end

  before do
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
    render(:html, :"game")
  end

  get('/new_game') do
      redirect to('/game')
  end
  post('/new_game') do
    # @params = params[]
    binding.pry
    # $redis.set("players", params.to_json)
    redirect to('/game')
  end
end

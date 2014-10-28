require 'sinatra/base'

class App < Sinatra::Base

  ########################
  # Configuration
  ########################

  configure do
    enable :logging
    enable :method_override
    enable :sessions
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
    reset_values
    $player1_name = nil
    $player2_name = nil
    $player_1_wins = 0
    $player_2_wins = 0
    render(:erb, :login)
  end

get('/rules') do
  render(:erb, :rules)
end

  get('/game') do
    redirect to('/') if $player1_name == nil || $player2_name == nil
    $player1tiles
    diagonal($player1)
    diagonal($player2)
    diagonal_down($player1)
    diagonal_down($player2)
    column($player1)
    column($player2)
    row($player1)
    row($player2)
    if $winner && $turn
      $winner = $player2_name
      $player_2_wins += 1
    elsif $winner
      $winner = $player1_name
      $player_1_wins += 1
    end
    render(:erb, :game)
  end

  get('/new_game') do
    reset_values
      redirect to('/game')
  end
end


#<a href="https://fierce-taiga-2233.herokuapp.com/">Make7</a>
____
####Overview
<a href="http://make7.herokuapp.com/">Make7</a> is a two player turn based game where the object is to be the first player to have consecutive tiles that add up to 7 (vertically, horizontally, or diagonally).
___
####Libraries
<p>
Make7 is a rackup application built on the <a href="https://github.com/sinatra/sinatra">Sinatra</a> framework. The actual game is run on the client side in javascript/html, and user and game data is persisted after each turn on a Redis server (non-relational database). <a href="http://jquery.com"/>jQuery</a> handles DOM targeting/editing, and the <a href="http://jqueryui.com/">jQuery UI</a> library handles animation and dynamic manipulation of the DOM. Debugging tools used were the pry and shotgun ruby gems and the chrome developers console.
</p>
___
####Logic
<p>
Game state is saved as an array of arrays of hashes, which through JSON parsing persists the game on Redis quite cleanly. The highest level array is more or less a game data container, and each inner array represents a column of the board. Each successive hash within these column arrays represents a row within that column. As an example if player one's first move was a 2 tile in the first column, and player two's first move was a 1 tile in the fist column, the game state would be persisted as:

```currentGame => [[{p1: 2}, {p2: 1}],[],[],[],[],[],[]]```

After each play, make7 runs a series of functions that check if the current player has one by iterating through this array. (functions exist in the 'game' prototype in game.js)  If there is no win, the game's turn state toggles and the game goes on.  If there is a win, the win count of the winning player is incremented on the server, and the loss count of the losing player is incremented on the server.
![screenshot](https://github.com/graysonthemason/Make_7/blob/master/public/images/Screen%20Shot.png)


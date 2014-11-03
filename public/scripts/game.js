console.log("game.js connected!")

function Game(){
    this.game = [[],[],[],[],[],[],[],[],[],[],[]];
    this.turn           = true;
    this.player1Tiles   = [12, 8, 3];
    this.player2Tiles   = [12, 8, 3];
}

Game.prototype = {

  play: function(number, column) {
    // describes a player making a move
    if (this.turn) {
      this.game[column].push({p1: number});
      console.log('p1 went');
    } else {
      this.game[column].push({p2: number});
      console.log('p2 went');
    }
    this.checkForWinner();
    this.turn = !this.turn;
    toggleDrag();
    toggleCheck();
    // this.updateGame();

    $.ajax({
      url:      "/game",
      type:     "POST",
      dataType: "json",
      context:  this, // this sets context in done to the object
      data: {
          game: JSON.stringify(this.game),
          turn: this.turn,
      }
    });
    $.ajax({
      url:      "/game",
      type:     "GET",
      dataType: "json"
    });
  },
  diagonal: function() {
    var countStart = -4;
    var count = -4;
    var count2 = 0;
    var total = 0;
    do {
      do {
        if (count >= 0 && this.getTileValue(count, count2)) {
          total  += this.getTileValue(count, count2);
        } else {
          total   = 0;
        }
        if (total == 7) {
          this.logWin();
        }
        count    += 1;
        count2   += 1;
      } while (count2 <= 6);
      countStart += 1;
      count  = countStart;
      count2 = 0;
    } while (count <= 4);
  },

  diagonalDown: function() {
    var countStart = -4;
    var count  = -4;
    var count2 = 6;
    var total  = 0;
    do {
      do {
          if (count >= 0 && this.getTileValue(count, count2)) {
            total  += this.getTileValue(count, count2)
          } else {
            total   = 0;
          }
          if (total == 7) {
            this.logWin();
          }
          count  += 1;
          count2 -= 1;
        } while (count2 >= 0);
        countStart += 1;
        count  = countStart;
        count2 = 6;
      } while (countStart <= 4);
  },

  column: function() {
    for (column = 0; column < 7; column++) {
      var total = 0;
      for (row = 0; row < this.game[column].length; row++) {
        if (this.getTileValue(column, row) && this.getTileValue(column, row) > 0) {
          total += this.getTileValue(column, row);
        } else {
          total = 0;
        }
        if (total == 7) {
          this.logWin();
        }
      }
    }
  },

  row: function() {
    var count = 0;
    var total = 0;
    do {
      for (column = 0; column < 7; column++) {
        if (this.getTileValue(column, count)) {
          total += this.getTileValue(column, count);
        } else {
          total  = 0;
        }
        if (total == 7) {
          gameWinner = "PLAYER NAME";
          this.logWin();
        }
      }
      count += 1;
      total = 0
    } while (count < 7);
  },

  getTileValue: function(count, count2) {
    if (this.game[count][count2]) {
      if ( this.turn && typeof(this.game[count][count2].p1) !== 'undefined'){
        return this.game[count][count2].p1;
      } else if ( this.turn === false && typeof(this.game[count][count2].p2) !== 'undefined'){
        return this.game[count][count2].p2;
      } else {
        return null;
      }
    }
  },

  checkForWinner: function() {
    this.row();
    this.diagonal();
    this.diagonalDown();
    this.column();
  },

  logWin: function () {
      $.ajax({
      url:      "/winner",
      type:     "POST",
      dataType: "json",
      context:  this, // this sets context in done to the object
      data: {
          turn: this.turn,
      }
    })
      if (this.turn){
        $winner.text("Oh snap! "+$player1_name+" won!");
      } else {
        $winner.text("Oh snap! "+$player2_name+" won!");
      };
    $winnerBox.removeClass('hide');
  },
}

////////////////////////////////////////

function init() {
  currentGame = new Game;
  $tilep1 = $('div.tilep1');
  $tilep2 = $('div.tilep2');
  $columns = $('div.col');
  //hide the rules
  //droppable columns
  $.each($columns, function( index, value ) {
    $(value).droppable( {
      hoverClass: "container_hover",
      drop: function(ev, ui) {
        var column      = parseInt($(this).data('col-idx'));
        var val       = parseInt($(ui.draggable.context).data('val'));
        var draggable = ui.draggable;
        if (column == 0 && val == 3 && currentGame.game[0].length != 2) {
        } else if (column == 1 && val == 3 && currentGame.game[1].length != 4) {
        } else if (column == 2 && val == 3 && currentGame.game[2].length != 5) {
        } else if (column == 3 && val == 3 && currentGame.game[3].length != 3) {
        } else if (column == 4 && val == 3 && currentGame.game[4].length != 5) {
        } else if (column == 5 && val == 3 && currentGame.game[5].length != 4) {
        } else if (column == 6 && val == 3 && currentGame.game[6].length != 2) {
        } else {
          draggable.draggable( 'option', 'revert', false );
          draggable.draggable( 'disable' );
          draggable.removeClass("stack");
          draggable.detach().css({top: 0,left: 0}).prependTo($(this.children).first());
          currentGame.play(val, column);
        }
      }
    });
  });

//initialize draggability on both players tiles
  $.each($tilep1, function(index, value){
    // debugger
    $(value).draggable( {
      containment: 'body',
      cursor: 'move',
      revert: true,
    })
  })
  $.each($tilep2, function(index, value){
    $(value).draggable( {
      containment: 'body',
      cursor: 'move',
      revert: true,
    })
  })

//call toggle in initialize here so that game starts correctly
  toggleDrag();
  toggleCheck();
  //set player names
  $('body > div > div.player1_tiles > ul > span').text(currentGame.player1Name);
  $('body > div > div.player2_tiles > ul > span').text(currentGame.player2Name);
  $('body').removeClass('hide');
}
//toggle draggability
function toggleDrag() {
  if(currentGame.turn) {
    $.each($tilep1, function(index, value){
      $(value).draggable( 'enable' );
    });
    $.each($tilep2, function(index, value){
      $(value).draggable('disable');
    });
  } else {
    $.each($tilep2, function(index, value){
      $(value).draggable('enable');
    });
    $.each($tilep1, function(index, value){
      $(value).draggable('disable');
    });
  }
}
$checkLeft = $('body > div > div.player1_tiles > img');
$checkRight = $('body > div > div.player2_tiles > img');
$rulesShow = $('body > header > h1:nth-child(3) > a');
$rules = $('body > div > div.rules-wrap > div');
$winner = $('#winner > span');
$winnerBox = $('#winner');

$rulesShow.on("click", function(){
$rules.removeClass('hide');
})
$rulesHide = $('body > div > div.rules-wrap > div > button')
$rulesHide.on('click', function(){
  $rules.addClass('hide');
});
$player1_name = $('body > div.overlay > div.player1_tiles > ul > span').text();
// $player1_name = ;
$player2_name = $('body > div.overlay > div.player2_tiles > ul > span').text();

$newGame = $('body > header > h1:nth-child(2) > a');
$newGame.on("click", newGame);


function toggleCheck() {
  if(currentGame.turn) {
    $checkLeft.show();
    $checkRight.hide();
  } else {
    $checkRight.show();
    $checkLeft.hide();
  }
}

function newGame() {
  $.ajax({
    url:      "/game",
    type:     "GET",
    dataType: "json",
    context:  this, // this sets context in done to the object
  })
}
init();


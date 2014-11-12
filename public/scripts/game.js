console.log("game.js connected!")

function Game(){
    this.game = [[],[],[],[],[],[],[],[],[],[],[]];
    this.turn = true;
    // this.player1Tiles   = [12, 8, 3];
    // this.player2Tiles   = [12, 8, 3];
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
    this.updateTileCounts();

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
    var count      = -4;
    var count2     = 0;
    var total      = 0;
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
    var count      = -4;
    var count2     = 6;
    var total      = 0;
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

  computerRandomPlay: function() {
    var randomColumn = Math.floor(Math.random() * (7));
      if (randomColumn == 0 && currentGame.game[0].length != 2) {
        var randomNumber = Math.floor(Math.random() * (3 - 1)) + 1
      } else if (randomColumn == 1 && currentGame.game[1].length != 4) {
        var randomNumber = Math.floor(Math.random() * (3 - 1)) + 1
      } else if (randomColumn == 2 && currentGame.game[2].length != 5) {
        var randomNumber = Math.floor(Math.random() * (3 - 1)) + 1
      } else if (randomColumn == 3 && currentGame.game[3].length != 3) {
        var randomNumber = Math.floor(Math.random() * (3 - 1)) + 1
      } else if (randomColumn == 4 && currentGame.game[4].length != 5) {
        var randomNumber = Math.floor(Math.random() * (3 - 1)) + 1
      } else if (randomColumn == 5 && currentGame.game[5].length != 4) {
        var randomNumber = Math.floor(Math.random() * (3 - 1)) + 1
      } else if (randomColumn == 6 && currentGame.game[6].length != 2) {
        var randomNumber = Math.floor(Math.random() * (3 - 1)) + 1
      } else {
        // var randomNumber = Math.floor(Math.random() * (4 - 1)) + 1
        var randomNumber = 3;
      }
      this.updateGame(randomNumber, randomColumn)
      this.play(randomNumber, randomColumn)
  },
  computerPlay: function() {
    this.computerColumn()
  },

  computerColumn: function() {
    for (column = 0; column < 7; column++) {
      var total = 0;
      for (row = 0; row < this.game[column].length; row++) {
        if (this.getTileValue(column, row) && this.getTileValue(column, row) > 0) {
          total += this.getTileValue(column, row);
        } else {
          total = 0;
        }
        if (total == 6 && this.game[column].length < 7) {
          this.updateGame(1, column);
          this.play(1, column);
          return
        }
        else if (total == 5 && this.game[column].length < 7) {
          this.updateGame(2, column);
          this.play(2, column);
          return
        }
        else if (total == 4 && this.three(column) && this.game[column].length < 7) {
          this.updateGame(3, column);
          this.play(3, column);
          return
        }
      }
    }
    this.computerRow()
  },

  computerRow: function() {
    var count = 0;
    var total = 0;
    do {
      for (column = 0; column < 7; column++) {
        if (this.getTileValue(column, count)) {
          total += this.getTileValue(column, count);
        } else {
          total  = 0;
        }
        if (total == 6) {
          this.updateGame(1, column + 1);
          this.play(1, column + 1);
          return
        }
        else if (total == 5) {
          this.updateGame(2, column + 1);
          this.play(2, column + 1);
          return
        } else if (total == 4 && this.three(column + 1)) {
          this.updateGame(3, column + 1);
          this.play(3, column + 1);
          return
        }
      }
      count += 1;
      total = 0
    } while (count < 7);
    this.computerRandomPlay()
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

  updateGame: function (number, column) {
    $columns = $('div.col');
    if (number == 1 && this.turn) {
      $($columns[column].childNodes[1]).prepend($("div.player1_tiles #draggable1").first().draggable('disable').removeClass("stack").detach().css({top: 0,left: 0}))
    } else if (number == 2 && this.turn) {
      $($columns[column].childNodes[1]).prepend($("div.player1_tiles #draggable2").first().draggable('disable').removeClass("stack").detach().css({top: 0,left: 0}))
    } else if (number == 3 && this.turn) {
      $($columns[column].childNodes[1]).prepend($("div.player1_tiles #draggable3").first().draggable('disable').removeClass("stack").detach().css({top: 0,left: 0}))
    } else if (number == 1 && !this.turn) {
      $($columns[column].childNodes[1]).prepend($("div.player2_tiles #draggable1").first().draggable('disable').removeClass("stack").detach().css({top: 0,left: 0}))
    } else if (number == 2 && !this.turn) {
      $($columns[column].childNodes[1]).prepend($("div.player2_tiles #draggable2").first().draggable('disable').removeClass("stack").detach().css({top: 0,left: 0}))
    } else if (number == 3 && !this.turn) {
      $($columns[column].childNodes[1]).prepend($("div.player2_tiles #draggable3").first().draggable('disable').removeClass("stack").detach().css({top: 0,left: 0}))
    }
    //   $.ajax({
    //   url:      "/game",
    //   type:     "GET",
    //   dataType: "json"
    // });
    // $.each($columns, function( index, value ) {
    //   if (currentGame[index] >
    // }
  },
  updateTileCounts: function () {
    $player1Tiles1 = $("body > div.overlay > div.player1_tiles > ul > li:nth-child(6) > div").children().length;
    $("#p1tile1 > span").text($player1Tiles1);
    $player1Tiles2 = $("body > div.overlay > div.player1_tiles > ul > li:nth-child(7) > div.tilestack2").children().length;
    $("#p1tile2 > span").text($player1Tiles2);
    $player1Tiles3 = $("body > div.overlay > div.player1_tiles > ul > li:nth-child(8) > div.tilestack3").children().length;
    $("#p1tile3 > span").text($player1Tiles3);

    $player2Tiles1 = $("body > div.overlay > div.player2_tiles > ul > li:nth-child(6) > div").children().length;
    $("#p2tile1 > span").text($player2Tiles1);
    $player2Tiles2 = $("body > div.overlay > div.player2_tiles > ul > li:nth-child(7) > div.tilestack2").children().length;
    $("#p2tile2 > span").text($player2Tiles2);
    $player2Tiles3 = $("body > div.overlay > div.player2_tiles > ul > li:nth-child(8) > div.tilestack3").children().length;
    $("#p2tile3 > span").text($player2Tiles3);
  },
  three: function(column) {
    if (column == 0 && this.game[0].length != 2) {
      console.log(false)
      return false
    } else if (column == 1 && this.game[1].length != 4) {
      console.log(false)
      return false
    } else if (column == 2 && this.game[2].length != 5) {
      console.log(false)

      return false
    } else if (column == 3 && this.game[3].length != 3) {
      console.log(false)

      return false
    } else if (column == 4 && this.game[4].length != 5) {
      console.log(false)

      return false
    } else if (column == 5 && this.game[5].length != 4) {
      console.log(false)

      return false
    } else if (column == 6 && this.game[6].length != 2) {
      console.log(false)
      return false
    } else {
      console.log(true)
      return true
    }
  },
}

////////////////////////////////////////

function init() {
  currentGame = new Game;
  $tilep1  = $('div.tilep1');
  $tilep2  = $('div.tilep2');
  $columns = $('div.col');
  currentGame.updateTileCounts();
  //droppable columns
  $.each($columns, function( index, value ) {
    $(value).droppable( {
      hoverClass: "container_hover",
      drop: function(ev, ui) {
        var column    = parseInt($(this).data('col-idx'));
        var val       = parseInt($(ui.draggable.context).data('val'));
        var draggable = ui.draggable;
        if (column == 0 && val == 3 && currentGame.game[0].length != 2) {
        } else if (column == 1 && val == 3 && currentGame.game[1].length != 4) {
        } else if (column == 2 && val == 3 && currentGame.game[2].length != 5) {
        } else if (column == 3 && val == 3 && currentGame.game[3].length != 3) {
        } else if (column == 4 && val == 3 && currentGame.game[4].length != 5) {
        } else if (column == 5 && val == 3 && currentGame.game[5].length != 4) {
        } else if (column == 6 && val == 3 && currentGame.game[6].length != 2) {
        } else if (currentGame.game[column].length == 7) {
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

//initialize draggability on both player's tiles
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

$checkLeft    = $('body > div > div.player1_tiles > img');
$checkRight   = $('body > div > div.player2_tiles > img');
$rulesShow    = $('body > header > h1:nth-child(3) > a');
$rules        = $('body > div > div.rules-wrap > div');
$winner       = $('#winner > span');
$winnerBox    = $('#winner');
$rulesHide    = $('body > div > div.rules-wrap > div > button')
$player1_name = $('body > div.overlay > div.player1_tiles > ul > span').text();
$player2_name = $('body > div.overlay > div.player2_tiles > ul > span').text();
$newGame      = $('body > header > h1:nth-child(2) > a');

$rulesShow.on("click", function(){
  $rules.removeClass('hide');
})
$rulesHide.on('click', function(){
  $rules.addClass('hide');
});
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


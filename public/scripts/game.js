console.log("game.js connected!")



function Game(){
    this.game = [[],[],[],[],[],[],[],[],[],[],[]];
    this.turn           = true;
    this.player1Tiles   = [12, 8, 3];
    this.player2Tiles   = [12, 8, 3];
    this.player1Name    = prompt("Please enter your name", "Player1");
    this.player2Name    = prompt("Please enter your name", "Player2");
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
            gameWinner = "PLAYER NAME";
            alert('we have a diagonal up winner, turn: '+ this.turn)
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
            gameWinner = "PLAYER NAME";
            alert('we have a diagonal down winner, turn: '+ this.turn)
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
          gameWinner = "PLAYER NAME";
          alert('we have a column winner, turn: '+ this.turn)
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
          alert('we have a row winner, turn: '+ this.turn)
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
}

////////////////////////////////////////

function init() {
  currentGame = new Game;

  $tile = $('div.tile');
  $tile1 = $("body > div.player1_tiles > ul > li:nth-child(4) > div");
  $tile2 = $('#draggable2');
  $tile3 = $('#draggable3');
  $column1 = $("body > div.game_wrap > div:nth-child(1)");
  $column2 = $("body > div.game_wrap > div:nth-child(2)");
  $column3 = $("body > div.game_wrap > div:nth-child(3)");
  $column4 = $("body > div.game_wrap > div:nth-child(4)");
  $column5 = $("body > div.game_wrap > div:nth-child(5)");
  $column6 = $("body > div.game_wrap > div:nth-child(6)");
  $column7 = $("body > div.game_wrap > div:nth-child(7)");
  $columns = $('div.col');
  //droppable columns
  $.each($columns, function( index, value ) {
    $(value).droppable( {
      hoverClass: "container_hover",
      drop: function(ev, ui) {
        var column = parseInt($(this).data('col-idx'));
        var val = parseInt($(ui.draggable.context).data('val'));
        // console.log('dro-o-o-op!', ev, ui, this);
        // console.log("game model index: ", $(this).data('col-idx');
        console.log("game model value: ", $(ui.draggable.context).data('val'));
        var draggable = ui.draggable;
        draggable.draggable( 'option', 'revert', false );
        draggable.draggable( 'disable' );
        draggable.removeClass("stack");
        draggable.detach().css({top: 0,left: 0}).prependTo(this.children);
        currentGame.play(val, column);
      }
    });
  });


// draggable tiles
  $.each($tile, function(index, value){
    // debugger
    $(value).draggable( {
      containment: 'body',
      cursor: 'move',
      revert: true,
    })
  })
}
init();
// g1 = new Game
// g1.play(2,0); //p1
// g1.play(1,1);//p2
// g1.play(2,0);//p1
// g1.play(2,2);//p2
// g1.play(3,0);//p1

// g2 = new Game
// g2.play(2,0); //p1
// g2.play(1,1);//p2
// g2.play(2,1);//p1
// g2.play(2,2);//p2
// g2.play(3,2);//p1
// g2.play(2,0);//p2
// g2.play(3,2);//p1

// g3 = new Game
// g3.play(2,0); //p1
// g3.play(1,0);//p2
// g3.play(2,1);//p1
// g3.play(2,1);//p2
// g3.play(3,2);//p1

// g4 = new Game
// g4.play(2,2); //p1
// g4.play(1,1);//p2
// g4.play(2,1);//p1
// g4.play(2,0);//p2
// g4.play(3,0);//p1
// g4.play(2,5);//p2
// g4.play(3,0);//p1



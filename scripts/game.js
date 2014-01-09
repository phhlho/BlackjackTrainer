function Game() {
    this.round;
    this.lives = 3;
    this.combo = 1; 
    this.score = 0;
    
    this.MakeMove = function(theMove) {
        if (MoveCalculator.IsWinningMove(this.round, theMove)) {
            this.score += TrainerConstants.BASE_SCORE * this.combo;            
        }
        else {
            this.lives -= 1;
            this.combo = 1;
        }
        this.round = new Round();
    }
}

var Renderer = new function() {
    this.renderGame = function() {
        $('#dealerCard').text(Renderer.renderCard(theGame.round.dealerCard));
        $('#userCardOne').text(Renderer.renderCard(theGame.round.userHand.cards[0]));
        $('#userCardTwo').text(Renderer.renderCard(theGame.round.userHand.cards[1]));
        $('#livesDisplay').text("0" + theGame.lives);
        $('#comboDisplay').text("0" + theGame.combo);
        $('#scoreDisplay').text("0000" + theGame.score);
    }
    
    this.renderCard = function(card) {
        var returnString = '';
        returnString += getEnumName(TrainerConstants.RANK, card.rank);
        returnString += ' ' + getEnumName(TrainerConstants.SUIT, card.suit);
        return returnString;
    }
}

var theGame;

// Action Handlers
$(document).ready(function(){
    $('a.action-link').on('click', function() {
        var result = theGame.MakeMove(Number(this.attributes['data-move'].value));
        Renderer.renderGame();
    });     
});

$(function() {
    // Handler for .ready() called.
    theGame = new Game();
    theGame.round = new Round();
    initializeOdometer();
    Renderer.renderGame();      
});

function initializeOdometer() {
    var score = $('#scoreDisplay');
    var od = new Odometer({
        el: score[0],
        value: 1000,
        format: 'd',
        duration: 500,
        animation: 'count'
    });
}
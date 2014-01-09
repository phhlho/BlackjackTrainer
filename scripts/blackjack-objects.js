function Card(suit, rank) {
    this.suit = suit;
    this.rank = rank;
    
    this.isRankTenEquivalent = function() {
        return (rank === TrainerConstants.RANK.TEN ||
                rank === TrainerConstants.RANK.JACK || 
                rank === TrainerConstants.RANK.QUEEN || 
                rank === TrainerConstants.RANK.KING);
    }
}

function Round() {
    this.userHand = Dealer.DealHand();
    this.dealerCard = Dealer.DealCard();
    this.timer = TrainerConstants.MAX_TIME;    
}

function getEnumName(theEnum, value) {
    for(var name in theEnum){
        if (theEnum[name] === value) return name;
    }
    return '';
}

function HandScore() {
    this.value = 0;        
    this.isSoft = false;
    this.isBlackJack = false;
    this.isPair = false;
    this.isBust = false;
}

function Hand () {
    this.cards = new Array();
    
    this.score = function() {
        var returnScore = new HandScore();                      
        var highValueAces = 0;
        for (var i = 0; i < this.cards.length; i++) {
            switch(this.cards[i].rank) {
                case TrainerConstants.RANK.ACE:
                    returnScore.value += 11;
                    highValueAces += 1;
                    break;
                case TrainerConstants.RANK.JACK:
                case TrainerConstants.RANK.QUEEN:
                case TrainerConstants.RANK.KING:
                    returnScore.value += 10;
                    break;
                case TrainerConstants.RANK.UNDECIDED:
                    throw 'Invalid card rank in hand';
                default:
                    returnScore.value += this.cards[i].rank;
            }
        }  
        while (highValueAces > 0 && returnScore.value > 21) {
            returnScore.value -= 10;
            highValueAces--;
        }
        returnScore.isSoft = highValueAces > 0;
        returnScore.isBlackJack = this.cards.length === 2 && returnScore.value === 21
        returnScore.isPair = this.cards.length === 2 && this.cards[0].rank === this.cards[1].rank;
        returnScore.isBust = returnScore.value > 21;
        return returnScore;
    };
}

var Dealer = new function() {
    this.DealCard = function() {
        var rank =  Math.floor(Math.random() * (14 - 2 + 1) + 2);
        var suit = Math.floor(Math.random()*4);
        return new Card(suit, rank);
    }
    this.DealHand = function() {
        var returnHand = new Hand();
        returnHand.cards.push(this.DealCard());
        returnHand.cards.push(this.DealCard());
        return returnHand;
    }    
}

var MoveCalculator = new function() {
    this.IsWinningMove = function (round, move) {        
        if (move === TrainerConstants.MOVE.UNDEFINED || move === TrainerConstants.MOVE.OUT_OF_TIME) return false;                             
        
        var userHand = round.userHand;
        var dealerCard = round.dealerCard;
        
        var userScore = userHand.score();        
        // Do special pair logic        
        if (userScore.isPair) return CalculateWinningPairMove(userHand, dealerCard, userScore, move);
        
        // Do special soft logic
        if (userScore.isSoft && userScore.value > 12) return CalculateWinningSoftMove(userHand, dealerCard, userScore, move);
        
        // Do regular logic                       
        return CalculateWinningRegularMove(userHand, dealerCard, userScore, move);
    }
    
    function CalculateWinningRegularMove(userHand, dealerCard, userScore, move) {
        if (move === TrainerConstants.MOVE.STAND) {
            return (userScore.value >= 17)
                   || (userScore.value >= 13 && userScore.value <= 16 && 
                    dealerCard.rank <= TrainerConstants.RANK.SIX && dealerCard.rank >= TrainerConstants.RANK.TWO)
                   || (userScore.value == 12 &&
                    dealerCard.rank <= TrainerConstants.RANK.SIX && dealerCard.rank >= TrainerConstants.RANK.FOUR);
        }       
        if (move === TrainerConstants.MOVE.DOUBLE) {
            return (userScore.value === 11 && 
                        dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.KING)
                   || (userScore.value === 10 &&
                        dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.NINE)
                   || (userScore.value === 9 &&
                        dealerCard.rank >= TrainerConstants.RANK.THREE && dealerCard.rank <= TrainerConstants.RANK.SIX);
        }
        if (move === TrainerConstants.MOVE.SURRENDER) {
            return (userScore.value === 15 && dealerCard.isRankTenEquivalent())
                   || (userScore.value === 16 && dealerCard.rank >= TrainerConstants.RANK.NINE && dealerCard.rank <= TrainerConstants.RANK.ACE);
        }
        if (move === TrainerConstants.MOVE.HIT) {
            switch (userScore.value) {
                case 16:
                    return (dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.EIGHT);                                                                                
                case 15:
                    return (dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.NINE) || 
                           (dealerCard.rank === TrainerConstants.RANK.ACE);
                case 14:
                case 13:
                    return (dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.ACE);                                                                                
                case 12:
                    return (dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.THREE) ||
                           (dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.NINE);
                case 11:
                    return dealerCard.rank === TrainerConstants.RANK.ACE
                case 10:
                    return (dealerCard.rank >= TrainerConstants.RANK.TEN && dealerCard.rank <= TrainerConstants.RANK.ACE);
                case 9:
                    return (dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.ACE) ||
                            dealerCard.rank === TrainerConstants.RANK.TWO;
                case 8:
                case 7:
                case 6:
                case 5:
                    return true;
            }
        }
        return false;
    }
    
    function CalculateWinningSoftMove(userHand, dealerCard, userScore, move) {
        if (move === TrainerConstants.MOVE.STAND) {
            switch(userScore.value) {
                case 20:
                case 19:
                    return true;                
                case 18:
                    return (dealerCard.rank === TrainerConstants.RANK.TWO ||
                            dealerCard.rank === TrainerConstants.RANK.SEVEN ||
                            dealerCard.rank === TrainerConstants.RANK.EIGHT);
                default:
                    return false;
            }
        }
        if (move === TrainerConstants.MOVE.DOUBLE) {
            switch(userScore.value) {
                case 18:
                case 17:
                    return dealerCard.rank >= TrainerConstants.RANK.THREE
                           && dealerCard.rank <= TrainerConstants.RANK.SIX;
                case 16:
                case 15:
                    return dealerCard.rank >= TrainerConstants.RANK.FOUR
                           && dealerCard.rank <= TrainerConstants.RANK.SIX;
                case 14:
                case 13:
                    return dealerCard.rank === TrainerConstants.RANK.FIVE 
                           || dealerCard.rank === TrainerConstants.RANK.SIX;
            }
        }
        if (move === TrainerConstants.MOVE.HIT) {
            switch(userScore.value) {
                case 18:
                    return (dealerCard.rank >= TrainerConstants.RANK.NINE && dealerCard.rank <= TrainerConstants.RANK.ACE);
                case 17:
                    return (dealerCard.rank === TrainerConstants.RANK.TWO) || 
                           (dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.ACE);                
                case 16:
                case 15:
                    return (dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.THREE) || 
                           (dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.ACE);                                
                case 14:
                case 13:
                    return (dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.FOUR) || 
                           (dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.ACE);                                                
            }
        }
        return false;
    }
    
    function CalculateWinningPairMove(userHand, dealerCard, userScore, move) {
        switch(userScore.value) {
            case 20:
                return (move === TrainerConstants.MOVE.STAND);
            case 18:
                if (move === TrainerConstants.MOVE.STAND) {
                        return (dealerCard.rank === TrainerConstants.RANK.SEVEN 
                                || dealerCard.isRankTenEquivalent() 
                                || dealerCard.rank === TrainerConstants.RANK.ACE);
                }      
                else if (move === TrainerConstants.MOVE.SPLIT) {
                        return (dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.SIX)
                                || (dealerCard.rank === TrainerConstants.RANK.EIGHT)
                                || (dealerCard.rank === TrainerConstants.RANK.NINE);
                }
                break;
            case 16:
                return (move === TrainerConstants.MOVE.SPLIT);
            case 14:
                if (move === TrainerConstants.MOVE.SPLIT) {
                    return (dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.SEVEN);
                }
                if (move === TrainerConstants.MOVE.HIT) {
                    return (dealerCard.rank >= TrainerConstants.RANK.EIGHT && dealerCard.rank <= TrainerConstants.RANK.ACE);
                }
                break;
            case 12:                
                if (userHand.cards[0].rank === TrainerConstants.RANK.ACE) return (move === TrainerConstants.MOVE.SPLIT);
                if (userHand.cards[0].rank === TrainerConstants.RANK.SIX) {
                    return (move === TrainerConstants.MOVE.HIT && dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.ACE)
                           || (move === TrainerConstants.MOVE.SPLIT && dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.SIX);
                }
                break;
            case 10:
                if (dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.NINE)
                    return move === TrainerConstants.MOVE.DOUBLE;
                if (dealerCard.isRankTenEquivalent() || dealerCard.rank === TrainerConstants.RANK.ACE)
                    return move === TrainerConstants.MOVE.HIT;
                break;
            case 8:
                if (move === TrainerConstants.MOVE.SPLIT) {
                    return (dealerCard.rank === TrainerConstants.RANK.FIVE)
                            || dealerCard.rank === TrainerConstants.RANK.SIX;
                }
                if (move === TrainerConstants.MOVE.HIT) {
                    return (dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.FOUR)
                            || (dealerCard.rank >= TrainerConstants.RANK.SEVEN && dealerCard.rank <= TrainerConstants.RANK.ACE);
                }
                break;
            case 6:
            case 4:
                if (dealerCard.rank >= TrainerConstants.RANK.TWO && dealerCard.rank <= TrainerConstants.RANK.SEVEN)
                    return move === TrainerConstants.MOVE.SPLIT;
                if (dealerCard.rank >= TrainerConstants.RANK.EIGHT && dealerCard.rank <= TrainerConstants.RANK.ACE)
                    return move === TrainerConstants.MOVE.HIT;
                break;
            default:
                throw 'Invalid score state';
        }        
        return false;
    }    
}
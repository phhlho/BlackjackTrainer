module('Move tests');

function runIndividualMoveTest(userHandString, dealerCardString, testMove, expectedOutcome, testDescription) {
    var userHand = new Hand();
    var dealerCard = new Card();
    
    if (testDescription === '') {
        testDescription = 'User {0} Dealer {1} {2}'.replace('{0}', userHandString).replace('{1}', dealerCardString).replace('{2}', getEnumName(TrainerConstants.MOVE, testMove));
        if (!expectedOutcome) {
            testDescription += ' - FAIL';
        }
    }
    
    var ranks = userHandString.split(',');
    if (ranks.length < 2) throw 'invalid user hand';
    
    for (var i = 0; i < ranks.length; i++) {
        userHand.cards.push(new Card(TrainerConstants.SUIT.SPADE, getRankFromString(ranks[i])));        
    }
    dealerCard = new Card(TrainerConstants.SUIT.HEART, getRankFromString(dealerCardString));
    
    var round = new Round();
    round.userHand = userHand;
    round.dealerCard = dealerCard;
    
    equal(MoveCalculator.IsWinningMove(round, testMove), expectedOutcome, testDescription);
}

function getRankFromString(rank) {
    switch(rank) {
        case '2':
            return TrainerConstants.RANK.TWO;
        case '3':
            return TrainerConstants.RANK.THREE;
        case '4':
            return TrainerConstants.RANK.FOUR;            
        case '5':
            return TrainerConstants.RANK.FIVE;
        case '6':
            return TrainerConstants.RANK.SIX;
        case '7':
            return TrainerConstants.RANK.SEVEN;
        case '8':
            return TrainerConstants.RANK.EIGHT;
        case '9':
            return TrainerConstants.RANK.NINE;
        case '10':
            return TrainerConstants.RANK.TEN;
        case 'J':
            return TrainerConstants.RANK.JACK;
        case 'Q':
            return TrainerConstants.RANK.QUEEN;
        case 'K':
            return TrainerConstants.RANK.KING;
        case 'A':
            return TrainerConstants.RANK.ACE;
        default:
            throw 'invalid rank string'        
    }
}


test('Auto Fails', function() {
    runIndividualMoveTest('2,3', 'A', TrainerConstants.MOVE.UNDEFINED, false, 'Undefined move');
    runIndividualMoveTest('2,3', 'A', TrainerConstants.MOVE.OUT_OF_TIME, false, 'Out of time move');
});

test('Stands', function() {
    // User 17+
    runIndividualMoveTest('10,8', '10', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('10,8', '10', TrainerConstants.MOVE.HIT, false, '');
    
    runIndividualMoveTest('10,10', '10', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('10,10', '10', TrainerConstants.MOVE.HIT, false, '');
        
    runIndividualMoveTest('10,7', '10', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('10,7', '10', TrainerConstants.MOVE.HIT, false, '');
    
    // User 14-16
    runIndividualMoveTest('10,5', '6', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('10,5', '6', TrainerConstants.MOVE.SPLIT, false, '');
    
    runIndividualMoveTest('10,3', '3', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('10,3', '3', TrainerConstants.MOVE.HIT, false, '');
    
    // 12
    runIndividualMoveTest('10,2', '4', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('10,2', '4', TrainerConstants.MOVE.HIT, false, '');
});

test('Soft Stands', function() {
    // 19 & 20
    runIndividualMoveTest('A,9', 'A', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('A,9', 'A', TrainerConstants.MOVE.HIT, false, '');     
    
    runIndividualMoveTest('A,8', '3', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('A,8', '3', TrainerConstants.MOVE.HIT, false, '');

    // 18
    runIndividualMoveTest('A,7', '2', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('A,7', '2', TrainerConstants.MOVE.HIT, false, '');                           
});

test('Pair Stands', function() {
    var userHand = new Hand();
    var dealerCard = new Card();
    
    // Pair 10s
    runIndividualMoveTest('10,10', '8', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('10,10', '8', TrainerConstants.MOVE.HIT, false, '');                       
    
    // Pair 9s
    runIndividualMoveTest('9,9', '7', TrainerConstants.MOVE.STAND, true, '');
    runIndividualMoveTest('9,9', '10', TrainerConstants.MOVE.STAND, true, '');                                               
    runIndividualMoveTest('9,9', 'A', TrainerConstants.MOVE.STAND, true, '');                                                              
});

test('Surrender', function() {
    var userHand = new Hand();
    var dealerCard = new Card();
    
    // 16
    runIndividualMoveTest('7,9', '9', TrainerConstants.MOVE.SURRENDER, true, '');
    runIndividualMoveTest('7,9', 'A', TrainerConstants.MOVE.SURRENDER, true, '');                                                             
    
    // 15
    runIndividualMoveTest('6,9', 'Q', TrainerConstants.MOVE.SURRENDER, true, '');                                                        
});

test('Regular Doubles', function() {
    // 11
    runIndividualMoveTest('9,2', '2', TrainerConstants.MOVE.DOUBLE, true, '');    
    runIndividualMoveTest('9,2', 'J', TrainerConstants.MOVE.DOUBLE, true, '');                                         
    
    // 10 
    runIndividualMoveTest('6,4', '2', TrainerConstants.MOVE.DOUBLE, true, '');    
    runIndividualMoveTest('6,4', '9', TrainerConstants.MOVE.DOUBLE, true, '');                                       
    
    // 9
    runIndividualMoveTest('5,4', '2', TrainerConstants.MOVE.DOUBLE, false, '');    
    runIndividualMoveTest('5,4', '3', TrainerConstants.MOVE.DOUBLE, true, '');       
    runIndividualMoveTest('5,4', '6', TrainerConstants.MOVE.DOUBLE, true, '');       
    runIndividualMoveTest('5,4', '7', TrainerConstants.MOVE.DOUBLE, false, '');       
});

test('Soft Doubles', function() {
    // 18
    runIndividualMoveTest('7,A', '3', TrainerConstants.MOVE.DOUBLE, true, '');    
    runIndividualMoveTest('7,A', '6', TrainerConstants.MOVE.DOUBLE, true, '');        
    
    // 17
    runIndividualMoveTest('6,A', '3', TrainerConstants.MOVE.DOUBLE, true, '');            
    runIndividualMoveTest('6,A', '6', TrainerConstants.MOVE.DOUBLE, true, '');                                              
    
    // 16
    runIndividualMoveTest('5,A', '4', TrainerConstants.MOVE.DOUBLE, true, '');                                              
    runIndividualMoveTest('5,A', '6', TrainerConstants.MOVE.DOUBLE, true, '');                                              
    
    // 15
    runIndividualMoveTest('4,A', '4', TrainerConstants.MOVE.DOUBLE, true, '');                                              
    runIndividualMoveTest('4,A', '6', TrainerConstants.MOVE.DOUBLE, true, '');                                                                                   
    
    // 14
    runIndividualMoveTest('3,A', '5', TrainerConstants.MOVE.DOUBLE, true, '');                                              
    runIndividualMoveTest('3,A', '6', TrainerConstants.MOVE.DOUBLE, true, '');                                                                                
    
    // 13
    runIndividualMoveTest('2,A', '5', TrainerConstants.MOVE.DOUBLE, true, '');                                              
    runIndividualMoveTest('2,A', '6', TrainerConstants.MOVE.DOUBLE, true, '');                                              
});

test('Pair Doubles', function() {
    // Pair 5s   
    runIndividualMoveTest('5,5', '9', TrainerConstants.MOVE.DOUBLE, true, 'User 5,5 Dealer 9 Double');                                                  
    runIndividualMoveTest('5,5', '10', TrainerConstants.MOVE.DOUBLE, false, 'User 5,5 Dealer 10 No Double');                                                                                
});

test('Regular Hits', function() {
    // 16
    runIndividualMoveTest('9,7', '7', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('9,7', '8', TrainerConstants.MOVE.HIT, true, ''); 
    // 15
    runIndividualMoveTest('9,6', 'A', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('9,6', '9', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('9,6', '7', TrainerConstants.MOVE.HIT, true, ''); 
    // 14
    runIndividualMoveTest('8,6', '8', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('8,6', 'K', TrainerConstants.MOVE.HIT, true, ''); 
    // 13
    runIndividualMoveTest('7,6', '7', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('7,6', 'A', TrainerConstants.MOVE.HIT, true, ''); 
    // 12
    runIndividualMoveTest('7,5', '3', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('7,5', '2', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('7,5', '7', TrainerConstants.MOVE.HIT, true, ''); 
    // 11
    runIndividualMoveTest('6,5', 'A', TrainerConstants.MOVE.HIT, true, ''); 
    // 10
    runIndividualMoveTest('6,4', 'A', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('6,4', 'J', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('6,4', '10', TrainerConstants.MOVE.HIT, true, ''); 
    // 9
    runIndividualMoveTest('5,4', '2', TrainerConstants.MOVE.HIT, true, '');      
    runIndividualMoveTest('5,4', '7', TrainerConstants.MOVE.HIT, true, ''); 
    runIndividualMoveTest('5,4', 'A', TrainerConstants.MOVE.HIT, true, ''); 
    // 8
    runIndividualMoveTest('6,2', 'Q', TrainerConstants.MOVE.HIT, true, '');      
    // 7
    runIndividualMoveTest('5,2', 'A', TrainerConstants.MOVE.HIT, true, '');      
    // 6    
    runIndividualMoveTest('4,2', '2', TrainerConstants.MOVE.HIT, true, '');      
    // 5
    runIndividualMoveTest('3,2', '7', TrainerConstants.MOVE.HIT, true, '');      
});

test('Soft Hits', function() {
    // 18
    runIndividualMoveTest('A,7', '9', TrainerConstants.MOVE.HIT, true, '');
    // 17
    runIndividualMoveTest('A,6', '2', TrainerConstants.MOVE.HIT, true, '');
    runIndividualMoveTest('A,6', '7', TrainerConstants.MOVE.HIT, true, '');
    // 16
    runIndividualMoveTest('A,5', '3', TrainerConstants.MOVE.HIT, true, '');
    runIndividualMoveTest('A,5', '7', TrainerConstants.MOVE.HIT, true, '');
    // 15
    runIndividualMoveTest('A,4', '3', TrainerConstants.MOVE.HIT, true, '');
    runIndividualMoveTest('A,4', '7', TrainerConstants.MOVE.HIT, true, '');
    // 14
    runIndividualMoveTest('A,3', '4', TrainerConstants.MOVE.HIT, true, '');
    runIndividualMoveTest('A,3', '7', TrainerConstants.MOVE.HIT, true, '');    
    // 13
    runIndividualMoveTest('A,2', '4', TrainerConstants.MOVE.HIT, true, '');
    runIndividualMoveTest('A,2', '7', TrainerConstants.MOVE.HIT, true, '');
    runIndividualMoveTest('A,2', 'A', TrainerConstants.MOVE.HIT, true, '');    
});

test('Pair Hits', function() {    
    // 7s
    runIndividualMoveTest('7,7', '8', TrainerConstants.MOVE.HIT, true, '');    
    runIndividualMoveTest('7,7', 'A', TrainerConstants.MOVE.HIT, true, '');    
    // 6s
    runIndividualMoveTest('6,6', '7', TrainerConstants.MOVE.HIT, true, '');    
    runIndividualMoveTest('6,6', 'K', TrainerConstants.MOVE.HIT, true, '');        
    // 5s
    runIndividualMoveTest('5,5', '10', TrainerConstants.MOVE.HIT, true, '');    
    runIndividualMoveTest('5,5', 'A', TrainerConstants.MOVE.HIT, true, '');    
    // 4s
    runIndividualMoveTest('4,4', '2', TrainerConstants.MOVE.HIT, true, '');    
    runIndividualMoveTest('4,4', '4', TrainerConstants.MOVE.HIT, true, '');    
    runIndividualMoveTest('4,4', '7', TrainerConstants.MOVE.HIT, true, '');    
    runIndividualMoveTest('4,4', 'A', TrainerConstants.MOVE.HIT, true, '');        
    // 3s
    runIndividualMoveTest('3,3', '8', TrainerConstants.MOVE.HIT, true, '');    
    runIndividualMoveTest('3,3', 'A', TrainerConstants.MOVE.HIT, true, '');        
    // 2s
    runIndividualMoveTest('2,2', 'A', TrainerConstants.MOVE.HIT, true, '');    
    runIndividualMoveTest('2,2', '8', TrainerConstants.MOVE.HIT, true, '');    
});

test('Splits', function() {
    // Aces
    runIndividualMoveTest('A,A', '5', TrainerConstants.MOVE.SPLIT, true, 'User A,A Dealer 5 Split');                       
    
    // Nines    
    runIndividualMoveTest('9,9', '6', TrainerConstants.MOVE.SPLIT, true, 'User 9,9 Dealer 6 Split');                       
    runIndividualMoveTest('9,9', '8', TrainerConstants.MOVE.SPLIT, true, 'User 9,9 Dealer 8 Split');                           
    runIndividualMoveTest('9,9', '9', TrainerConstants.MOVE.SPLIT, true, 'User 9,9 Dealer 9 Split');                                                  

    // Eights
    runIndividualMoveTest('8,8', '6', TrainerConstants.MOVE.SPLIT, true, 'User 8,8 Dealer 6 Split');                                                                         
    
    // Sevens
    runIndividualMoveTest('7,7', '7', TrainerConstants.MOVE.SPLIT, true, 'User 7,7 Dealer 7 Split');                                                                       
    
    // Sixes
    runIndividualMoveTest('6,6', '6', TrainerConstants.MOVE.SPLIT, true, 'User 6,6 Dealer 6 Split');                                                                         
        
    // Fours
    runIndividualMoveTest('4,4', '6', TrainerConstants.MOVE.SPLIT, true, 'User 4,4 Dealer 6 Split');                                                      
    runIndividualMoveTest('4,4', '5', TrainerConstants.MOVE.SPLIT, true, 'User 4,4 Dealer 5 Split');                                                                         
    
    // Threes
    runIndividualMoveTest('3,3', '7', TrainerConstants.MOVE.SPLIT, true, 'User 3,3 Dealer 7 Split');                                                                         
                          
    // Twos
    runIndividualMoveTest('2,2', '7', TrainerConstants.MOVE.SPLIT, true, 'User 2,2 Dealer 7 Split');                                                                         
});

module('Hand tests');

test('Hand()', function() {
    var testHand = new Hand();
    testHand.cards.push(new Card(TrainerConstants.SUIT.SPADE, TrainerConstants.RANK.TWO));
    testHand.cards.push(new Card(TrainerConstants.SUIT.HEART, TrainerConstants.RANK.THREE));
    equal(testHand.score().value, 5, '2,3 hand equals 5');
    
    testHand = new Hand();
    testHand.cards.push(new Card(TrainerConstants.SUIT.SPADE, TrainerConstants.RANK.ACE));
    testHand.cards.push(new Card(TrainerConstants.SUIT.HEART, TrainerConstants.RANK.THREE));
    equal(testHand.score().value, 14, 'A,3 hand equals 14');    
    ok(testHand.score().isSoft, 'A,3 hand is soft');        
    
    testHand = new Hand();
    testHand.cards.push(new Card(TrainerConstants.SUIT.SPADE, TrainerConstants.RANK.ACE));
    testHand.cards.push(new Card(TrainerConstants.SUIT.HEART, TrainerConstants.RANK.ACE));
    equal(testHand.score().value, 12, 'A,A hand equals 12');        
    ok(testHand.score().isSoft, 'A,A hand is soft');        
    ok(testHand.score().isPair, 'A,A hand is pairs');        
    
    testHand = new Hand();
    testHand.cards.push(new Card(TrainerConstants.SUIT.SPADE, TrainerConstants.RANK.TEN));
    testHand.cards.push(new Card(TrainerConstants.SUIT.HEART, TrainerConstants.RANK.TEN));
    testHand.cards.push(new Card(TrainerConstants.SUIT.DIAMOND, TrainerConstants.RANK.FOUR));
    ok(testHand.score().isBust, '10,10,4 hand equals bust');            
    
    testHand = new Hand();
    testHand.cards.push(new Card(TrainerConstants.SUIT.SPADE, TrainerConstants.RANK.TEN));
    testHand.cards.push(new Card(TrainerConstants.SUIT.HEART, TrainerConstants.RANK.TEN));
    testHand.cards.push(new Card(TrainerConstants.SUIT.DIAMOND, TrainerConstants.RANK.ACE));
    equal(testHand.score().value, 21, '10,10,A hand equals 21');            
    ok(!testHand.score().isSoft, '10,10,A hand is not soft');  
    ok(!testHand.score().isBlackJack, '10,10,A hand is not blackjack');  
    
    testHand = new Hand();    
    testHand.cards.push(new Card(TrainerConstants.SUIT.HEART, TrainerConstants.RANK.TEN));
    testHand.cards.push(new Card(TrainerConstants.SUIT.DIAMOND, TrainerConstants.RANK.ACE));
    equal(testHand.score().value, 21, '10,A hand equals 21');            
    ok(testHand.score().isSoft, '10,A hand is soft');  
    ok(testHand.score().isBlackJack, '10,A hand is blackjack');            
});

module('Deal tests');
test('DealCard()', function() {
    for (var i = 0; i < 20; i++) {
        var newCard = Dealer.DealCard();
        ok(newCard.suit >= 0 && newCard.suit <= 3, 'Dealt card has valid suit');
        ok(newCard.rank >= 2 && newCard.rank <= 14, 'Dealt card has valid rank');    
    }
});
test('DealHand()', function() {
    for (var i = 0; i < 20; i++) {
        var newHand = Dealer.DealHand();
        ok(newHand.cards.length === 2, 'Dealt hand has 2 cards');
        var newCard = newHand.cards[0];
        ok(newCard.suit >= 0 && newCard.suit <= 3, 'Dealt card 1 has valid suit');
        ok(newCard.rank >= 2 && newCard.rank <= 14, 'Dealt card 1 has valid rank');    
        newCard = newHand.cards[1];
        ok(newCard.suit >= 0 && newCard.suit <= 3, 'Dealt card 2 has valid suit');
        ok(newCard.rank >= 2 && newCard.rank <= 14, 'Dealt card 2 has valid rank');            
    }
});

test('Round()', function() {
    var newRound = new Round();
    ok(newRound.userHand.cards.length === 2, 'Round has user hand of two cards');
    ok(newRound.dealerCard.suit >= 0 && newRound.dealerCard.suit <= 3, 'Round has valid dealer card suit');
    ok(newRound.dealerCard.rank >= 2 && newRound.dealerCard.rank <= 14, 'Round has valid dealer card rank');

});
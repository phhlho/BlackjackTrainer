var TrainerConstants = TrainerConstants || {};

TrainerConstants.SUIT = {
    UNDEFINED: -1,
    SPADE: 0,
    DIAMOND: 1,
    CLUB: 2,
    HEART: 3
};

TrainerConstants.RANK = {
    UNDEFINED: -1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    JACK: 11,
    QUEEN: 12,
    KING: 13,
    ACE: 14
};

TrainerConstants.MOVE = {
    UNDEFINED: -1,
    HIT: 1,
    STAND: 2,
    DOUBLE: 3,
    SURRENDER: 4,
    SPLIT: 5,
    OUT_OF_TIME: 6
}

TrainerConstants.MAX_TIME = 1000;
TrainerConstants.BASE_SCORE = 50;
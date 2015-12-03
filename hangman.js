// The desired length of allowed words.
var word_length = 6;
var game = {
    // Number of guesses that the player has.
    lives: 10,
    // All words that are currently eligible.
    words: [],
    // Letters that have already been guessed.
    guessed: [],
    // An array of boolean values stating whether character i in the 
    // word should be revealed to the player.
    showing: [],
    
    // Returns true if all letters have been guessed, otherwise returns
    // false.
    solved: function() {
        for (var i = 0; i < this.showing.length; i++) {
            if (!this.showing[i]) return false;
        }
        
        return true;
    },
    
    /**
     * Generates the text we should show to users.
     */
    showWord: function () {
        var chars = [];        
        for (var i = 0; i < word_length; i++) {
            if (this.showing[i]) chars.push(this.words[0][i]);
            else chars.push('_');
        }
        
        return chars.join(' ');
    },    
    
    /**
     * Generates a string representing guesses that have already been made.
     */
    showGuesses: function () {
        return this.guessed.join(', ');
    }
};

/**
 * Link our 'game' object to the template defined in index.html using Rivets,
 * an open source and freely available library (http://rivetsjs.com/).
 */
window.addEventListener('load', function () {
    // Initialize a new game.
    newGame();

    // Initialize Rivets and bind the game object as the Source of Truth.
    rivets.bind(document.getElementById('game'), { game: game });    
});

/**
 * Resets the shared state of the global 'game' object and configures all defaults.
 */
function newGame() {
    game.lives = 13;
    game.words = all_words.filter(function (word) { return word_length == word.length; });
    game.guessed = [];
    game.showing = [];
    
    for (var i = 0; i < word_length; i++) {
        game.showing.push(false);
    }
}

/**
 * Apply a user's guess (the single-character value in #guess) to the
 * game and update the game object with outcomes.
 */
function guess() {
    // Can't guess when you've already used up all of your guesses.
    if (game.lives <= 0) {
        console.log("No more guesses -- sorry! Start a new game.");
        return;
    }

    var guess = document.getElementById('guess').value;
    game.guessed.push(guess);
  
    var best_pattern = findBestPattern(game.words, guess);
    // If no characters were exposed, remove a life.
    if (best_pattern.split('_').join('').length == 0) {
        game.lives -= 1;
    }
    
    // Apply this pattern to our 'showing' array in case any characters need to
    // be shown to players.
    best_pattern.split('').forEach(function(letter, i) {
        if (letter != '_') game.showing[i] = true;
    });
    
    // Reduce the word list to only words that match this pattern.
    game.words = game.words.filter(function (word) {
       for (var i = 0; i < word.length; i++) {
           // If the pattern has the guess in slot i but the word does not.
           if (best_pattern[i] == guess && word[i] != guess) return false;
           // If the word has the guess in slot i but the pattern does not.
           if (best_pattern[i] != guess && word[i] == guess) return false;
       }
           
       return true;
    });   
    
    // HACK: Rivets isn't updating the bindings when the value is changed; only when 
    // a new value is added. Unfortunately this is expected behavior :(
    //    https://github.com/mikeric/rivets/issues/520
    game.showing.push(true);

    // Victory and failure conditions.
    if (game.solved()) {
        console.log('You figured it out! Congratulations!');
    } else if (game.lives == 0) {
        console.log('Doh, you lose! My word was "' + game.words[0] + '"! Maybe next time ;-)');
        game.showing = game.showing.map(function() { return true; });
    }
}

/**
 * Given all words, what's the pattern among words in the provided list
 * that will give us the longest list of resulting words to dodge between
 * later?
 */
function findBestPattern(words, guess) {
    // Generate a mapping between all patterns and the number of times they
    // appear in the list. Example output: {
    //   '__b__': 5,
    //   '_b__b': 1,
    //   'b____': 7,
    // }
    var pattern_counts = words.map(function (word) {
        return word.split('').map(function (letter) {
            if (letter == guess) return letter;
            else return '_';
        }).join('');
    }).reduce(function (patterns, masked) {
        if (masked in patterns) patterns[masked]++;
        else patterns[masked] = 1;
            
        return patterns;
    }, {});
    
    // Reduce across the patterns above to find the pattern that occurs most
    // frequently.
    return Object.keys(pattern_counts).reduce(function(largest, current) {
        if (pattern_counts[current] > largest.count) {
            return {
                pattern: current,
                count: pattern_counts[current],
            }
        } else return largest;
    }, { pattern: '', count: 0 }).pattern;
}
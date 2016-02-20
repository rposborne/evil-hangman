# Evil Hangman - Free Crash Course on Ruby
Based on Keith Schwarz's [Nifty Assignment](http://nifty.stanford.edu/2011/schwarz-evil-hangman/).
Shamelessly converted to ruby fomr [Evil-Hangman]()

## Overview
Our Evil Hangman crash course provides an intro to Ruby by building a humorous variant of the classic Hangman game. The course will give participants an intro to programming and the core features of the Ruby programming language.

Evil Hangman is played in exactly the same way as the original game; in fact, the player should have no idea that they're not playing the original game. The difference, however, is that the computer is actually cheating to make the game as hard as possible for the player: it doesn't actually settle on a word until the very end of the game, but tries to keep the player in the dark for as long as possible. Instead of picking a word at the very beginning a la regular hangman, it chooses a word but readily changes to a different word if the player starts guessing letters correctly.

## Outcomes
By the end of the course, participants will have their own version of Evil Hangman and a basic understanding of the power of programming in Ruby. Oh, and an amazing prank for your favorite word nerd.

## Requirements
- Laptop that is Wifi capable.
- Text editor (Sublime, Atom, etc)

## Agenda
1. Demo completed app
2. Introduction to programming
3. Ruby: programming
4. Variables, data types
5. String processing
7. Functions, (optional) higher-order functions
8. Algorithms

## Instructor's guide
This crash course is intended to last about three hours and provides an overview of Ruby programming. It's got a heavier emphasis on programming and specifically does not focus on HTML and CSS. The objective is for students to see some code and have fun developing an algorithm using common programming tools (string manipulation, lists, and functions).

You can start the exercise using the basic scaffolding available on the [master branch](https://github.com/rposborne/evil-hangman), which includes a 2,000-word word list. Example end states for code after each stage described below is available on the `stage-X` branch.

### Stage 1: understanding the problem
Start off by demoing the working app at the URL in this repo's description. Play a few games with the audience, and then walk through what
the game is doing at a conceptual level (see overview above). Use this to introduce the notion of *programming* as a way to operate on inputs
to generate outputs.

#### Inputs and outputs
**Goal:** give a concrete application of where programming can be useful and why. The role of programming, both generally and in this particular case, is to perform operations on various inputs in order to produce specific outputs.

Two forms of input that we get: (a) data, in this case a particular guess that the user is making, and (b) events, or actions from users suggesting they want something to happen, such as a button click. They expect a few different forms of output, all of them related to a guess: potentially new letters showing up on the board, the lives counter decreasing, etc.

Our task in this case is to figure out how to instruct the computer how to move from the inputs we're given to the outputs users are expecting. This applies to everything from clicking a 'like' button on Facebook to complex weather forecasting.

#### Evil Hangman
Provide a more detail walkthrough of inputs and outputs, including whiteboard / code comments or skeleton. Explain:

- **Inputs:** guess input box, guess button, new game button, word list
- **Outputs:** correctly guessed letters, lives left, previous guesses, triggering wins and losses

Also walk through the high level algorithm to convert the inputs into the outputs (roughly 5 - 10 minutes; the algorithm will get a lot more time later once we're in Stage 3 below). The core algorithmic problems that we need to solve for this activity are:

1. Find all words in a list that have a length of `X`.
2. Convert a list of words into a list of *patterns*, where a pattern has all characters replaced with `_` except for the specified character, i.e. `patternize('title', 't')` => `t _ t _ _`.
3. Given a list of patterns, determine which one occurs most frequently.
4. Filter a list of words to only those that match a given pattern.
5. Verify whether success or failure criteria have been met.

### Stage 2: playing with data
**Goal:** introduce basic programming concepts that are important for solving the Evil Hangman use case. In particular:

- Variables, arithmetic, and inequalities
- Strings and lists

Note that this won't be a full immersive course equivalent for each of these topics, but should cover the fundamental data types and related operations that are important for solving the Evil Hangman challenge. For example, make sure people understand that `lives` can be used to store a number, and that we can add / subtract from that value and still refer to it as `lives`.

#### Variables, arithmetic, and inequalities
Introduce numeric variables and related operations, and ensure that the audience knows enough to implement `lives` logic, including adding and removing as well as inequality tests (i.e. `lives > 0`).

**Suggested exercise:** implement logic that decrements the value of `lives` every time it's clicked, and print an end-of-times message to the dev console when you run out of lives.

#### Strings and lists
Ensure that the audience understands variables containing strings and associated operations, i.e. finding the length of strings and determining whether a character exists in a string. Provide a foundation for students to understand list operations.

**Suggested exercise:** filter a list of words to contain only those of length `X`.

**Suggested exercise:** implement `patternize(word, letter)` as shown in the Stage 1 description.

**Suggested exercise:** filter a list of words to contain only those that match a provided pattern, i.e. `_ _ t _ t`.

### Stage 3: the hangman comes to town
**Goal:** walk the audience through the thought process of developing the core Evil Hangman flow and algorithms, then implement `guess()`. This should be about 50/50 discussion and coding.

First be very clear about the goal of the algorithm in `goal()`: to find and apply the pattern that maximizes the number of words we have to fall back on later. Most of the work involves some combination of list and string manipulations, and will likely be easier to talk through before writing the code. Pseudocode for the `guess()` function looks something like this:
```javascript
// Global variables
game = an object containing game-specific state
eligibleWords = an array of words that match the exposed characters

function guess()
    // Sanity checks
    if checkLoss(game), print message and return
    if no guess provided, print message and return

    // Find the best pattern
    patterns = getPatternsFrom(eligibleWords)
    commonPattern = mostCommonPattern(patterns)

    // Apply the pattern
    exposeLetters(game, commonPattern)
    eligibleWords = filterByPattern(eligibleWords, commonPattern)
    lives -= 1

    // Check win / loss conditions
    if checkWin(game), print message and return
    if checkLoss(game), print message and return
```
Note that the core functions can be implemented either functionally using `map`, `filter`, and `reduce`, or in a more imperative style, depending on instructor preference and audience comfort.
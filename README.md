# Wordle Bot - Coding Test Submission

## Overview

This project creates a bot interacting with a Wordle-like puzzle API to guess random words automatically. The bot attempts to solve the puzzle by making predictions and processing feedback from the API to refine future predictions.

## Features

- **Automated Word Guessing:** The bot guesses words from a pre-defined word list, refining guesses based on the feedback received.
- **Multiple Game Modes:** Supports `daily`, `random`, and `word` modes as per the API's capabilities.
- **Efficient Word Filtering:** Uses regular expressions to filter potential words after each guess, optimizing the guessing process.
- **Dynamic Guessing Strategy:** Continuously updates the possible letters for each position to narrow down the word list.
- **Error Handling:** Handles API errors gracefully and provides informative logs for debugging.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the Project Directory:**

   ```bash
   cd wordle-bot
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

## Usage

1. **Run the Bot:**
   ```bash
   node index.js
   ```
2. **Configuration:**
   - You can configure the mode (`daily`, `random`, `word`) and other options by modifying the `playGame` method in `index.js`.

## Implementation Details

- Programming Language: JavaScript (Node.js)
- Dependencies:
  - axios: Used for making HTTP requests to the Wordle API.
- Word List: A comprehensive list of potential words is stored in words.js.

## Key Methods:

- `makeGuess(word)`: Sends a guess to the API and returns the result.
- `updatePossibleLetters(guessResults)`: Updates the possible letters for each position based on the feedback from the API.
- `filterPossibleWords()`: Uses a regular expression to filter the word list to only include words that match the current known constraints.

## API Documentation

The API documentation can be found at: [Wordle API Documentation](https://wordle.votee.dev:8000/redoc)

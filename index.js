const axios = require("axios");
const WORD_LIST = require("./words");

const BASE_URL = "https://wordle.votee.dev:8000";

const isCorrect = (results) =>
  results.every((result) => result.result === "correct");

class WordleBot {
  constructor() {
    this.wordLength = 5;
    this.possibleLetters = {};
    this.possibleWords = WORD_LIST;
    this.guessCount = 0;
    this.maxGuesses = 10;
    this.mode = "daily"; //support mode: 'daily', 'random', 'word'
    this.seed = null;
    this.targetWord = null;
  }

  async makeGuess(word) {
    try {
      let endpoint;
      let params = { guess: word.toLowerCase() };
      switch (this.mode) {
        case "daily":
          endpoint = `${BASE_URL}/daily`;
          params.size = this.wordLength;
          break;

        case "random":
          endpoint = `${BASE_URL}/random`;
          params.size = this.wordLength;
          if (this.seed) params.seed = this.seed;
          break;

        case "word":
          endpoint = `${BASE_URL}/word/${this.targetWord}`;
          break;
        default:
          throw new Error("Invalid game mode");
      }
      const res = await axios.get(endpoint, { params });
      return res.data;
    } catch (error) {
      console.error("Error making game: ", error.message);
      throw error;
    }
  }

  updatePossibleLetters(guessResults) {
    guessResults.forEach(({ slot, result, guess }) => {
      if (result === "correct") {
        this.possibleLetters[slot] = new Set([guess]);
      } else if (result === "present") {
        if (!this.possibleLetters[slot]) {
          this.possibleLetters[slot] = new Set(
            "abcdefghiklmnopqrstuvwxyz".split("")
          );
        }
        this.possibleLetters[slot].delete(guess);
      } else if (result === "absent") {
        for (let i = 0; i < this.wordLength; i++) {
          if (!this.possibleLetters[i]) {
            this.possibleLetters[i] = new Set(
              "abcdefghiklmnopqrstuvwxyz".split("")
            );
          }
          this.possibleLetters[i].delete(guess);
        }
      }
    });

    this.filterPossibleWords();
  }

  filterPossibleWords() {
    const regexString = Array.from({ length: this.wordLength }, (_, i) => {
      const letters = this.possibleLetters[i];
      if (letters && letters.size > 0) {
        return `[${Array.from(letters).join("")}]`;
      } else {
        return `.`;
      }
    }).join("");

    console.log("regexString: ", regexString);
    const regex = new RegExp(`^${regexString}$`);
    this.possibleWords = this.possibleWords.filter((word) => regex.test(word));
    console.log("possibleWords length = ", this.possibleWords.length);
  }

  async playGame(mode = "daily", options = {}) {
    this.mode = mode;
    this.seed = options.seed;
    this.targetWord = options.targetWord;
    this.guessCount = 0;
    this.possibleLetters = {};
    let solved = false;

    console.log(`Starting new ${mode} game...`);

    while (
      !solved &&
      this.guessCount < this.maxGuesses &&
      this.possibleWords.length > 0
    ) {
      console.log("possibleWords: ", this.possibleWords);
      const word = this.possibleWords[0];
      console.log(`Making guess ${this.guessCount + 1}: ${word}`);
      const result = await this.makeGuess(word);
      this.guessCount++;

      console.log("Result: ", result);
      if (isCorrect(result)) {
        solved = true;
        console.log(`Solved in ${this.guessCount} guesses!`);
        break;
      } else if (this.possibleWords.length === 2) {
        this.possibleWords = [this.possibleWords[1]];
      }

      this.updatePossibleLetters(result);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!solved) {
      console.log("Fail to solve the wordle!");
    }

    return {
      solved,
      guesses: this.guessCount,
    };
  }
}

async function playGames() {
  const bot = new WordleBot();

  try {
    // await bot.playGame("daily");
    await bot.playGame("random", { seed: Math.floor(Math.random() * 1000) });
    // await bot.playGame("word", { targetWord: "games" });
  } catch (error) {
    console.log("Error playing games: ", error);
  }
}

playGames();

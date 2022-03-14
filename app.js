class Game {
  constructor(word) {
    this.word = word;
    this.drawPart = document.querySelectorAll(".draw-part");
    this.lives = this.drawPart.length;
    this.parent = document.querySelector(".word");
  }
  create() {
    this.wordSplit = [];
    this.letterBox = [];
    for (let i = 0; i < this.word.length; i++) {
      // create elements
      let div = document.createElement("div");
      let textNode = document.createTextNode(this.word[i]);
      // add classes
      div.classList.add("letter-box");

      // append
      if (Math.random() * 100 < 30) {
        div.append(textNode);
      }
      this.parent.append(div);
      // add as property
      this.letterBox.push(div);
      this.wordSplit.push(this.word[i]);
    }
  }
  start(letter, continueN) {
    if (this.letterBox[continueN].innerHTML != "") {
      return this.start(letter, ++continueN);
    }
    if (letter.toLowerCase() === this.word.charAt(continueN).toLowerCase()) {
      let textNode = document.createTextNode(letter);

      this.letterBox[continueN].append(textNode);

      if (this.word.length - 1 == continueN) {
        this.gameOver(true);
      }

      return true;
    } else {
      this.gameOver(false);

      return false;
    }
  }
  gameOver(isWin) {
    let congrats = document.querySelector(".gameover");

    if (isWin) {
      setInterval(() => {
        congrats.innerHTML = "Game Over, You Win";
        congrats.style.display = "grid";

        this.gameover = false;
      });
    } else {
      if (this.lives != 0) {
        this.drawPart[this.drawPart.length - this.lives].style.display =
          "block";
      }
      this.lives--;

      if (this.lives == 0) {
        congrats.innerHTML = "Game Over, You lose";
        congrats.style.display = "grid";

        this.gameover = false;
      }
    }
  }
}

class Hangman {
  constructor() {
    this.categores = { countries: [], movies: [] };
  }
  async getInfo() {
    this.categores.countries = await contriesInfo();
    this.categores.movies = await moviesInfo();
    this.generateWord();

    let category = document.querySelector("header span");

    category.innerHTML = this.currentCategory;
  }
  letters() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz ".split("");
    const parent = document.querySelector(".letters");

    for (let i = 0; i < alphabet.length; i++) {
      let div = document.createElement("div");
      let textNode = document.createTextNode(alphabet[i]);

      div.classList.add("letter");
      if (i == alphabet.length - 1) {
        div.classList.add("space");
      }

      div.append(textNode);
      parent.append(div);
    }
  }
  generateWord() {
    let objLength = Object.keys(this.categores).length;
    let randomNumber = Math.floor(Math.random() * objLength);
    this.currentCategory = Object.keys(this.categores)[randomNumber];
    let randomWord = Math.floor(Math.random() * this.currentCategory.length);
    this.word = this.categores[this.currentCategory][randomWord];
    this.startGame();
  }
  startGame() {
    let lettersEl = document.querySelectorAll(".letter");
    let game = new Game(this.word);
    let i = 0;
    game.create();
    setInterval(() => {
      for (let letterEl of lettersEl) {
        letterEl.onclick = () => {
          let isCorrect = game.start(letterEl.innerHTML, i);

          if (isCorrect) {
            i++;
            lettersEl.forEach((e) => e.classList.remove("used"));
          } else {
            letterEl.classList.add("used");
          }
        };
      }
    });
  }
}

async function contriesInfo() {
  let response = await fetch("contries.json");
  let result = await response.json();

  result = await result.map((e) => e.name);
  result = await result.filter((e) => e.length <= 14);
  result.splice(result.indexOf("Israel"), 1);

  return result;
}
async function moviesInfo() {
  let response = await fetch("movies.json");
  let result = await response.json();
  result = result.map((e) => e.Title).filter((e) => e.length <= 14);
  return result;
}

let hangman = new Hangman();

hangman.letters();
hangman.getInfo();

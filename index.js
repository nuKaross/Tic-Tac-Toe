//Player factory func
const createPlayer = (name, symbol) => {
  return { name, symbol }
}

//IIFE module
const Gameboard = (() => {
  let gameBoard = ['', '', '', '', '', '', '', '', '']

  //displays board
  const display = () => {
    let boardHTML = ''
    let playerBoard = ''

    gameBoard.forEach((element, index) => {
      boardHTML += `<div class="square" id="${index}">${element}</div> `
    })
    document.querySelector('.board').innerHTML = boardHTML

    const squares = document.querySelectorAll('.square')
    squares.forEach(square => {
      square.addEventListener('click', Game.handleClick)
    })
  }
  //updates current state of game
  const update = (index, value) => {
    gameBoard[index] = value
    display()
  }

  const getGameboard = () => gameBoard

  return {
    display,
    update,
    getGameboard,
  }
})()

//Displays win/lose/tie messages
const messages = (() => {
  const winMsg = name => {
    document.querySelector('#gameMsg').innerHTML = `${name} won`
  }

  const tieMsg = () => {
    document.querySelector('#gameMsg').innerHTML = `TIE`
  }
  return { winMsg, tieMsg }
})()

const Game = (() => {
  let players = []
  let gameOver = false
  let currentPlayer

  const startGame = () => {
    players = [
      createPlayer(document.querySelector('#name1').value, 'X'),
      createPlayer(document.querySelector('#name2').value, 'O'),
    ]
    currentPlayer = 0
    gameOver = false
    Gameboard.display()
  }

  const checkForTie = board => {
    return board.every(element => element !== '')
  }

  const checkWinner = board => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (i = 0; i < winningPatterns.length; i++) {
      const [a, b, c] = winningPatterns[i]
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return true
      }
    }
    return false
  }
  const handleClick = event => {
    if (gameOver) {
      return
    }
    if (Gameboard.getGameboard()[event.target.id] !== '') return
    Gameboard.update(event.target.id, players[currentPlayer].symbol)
    currentPlayer = currentPlayer === 0 ? 1 : 0

    if (checkWinner(Gameboard.getGameboard(), players[currentPlayer])) {
      gameOver = true
      messages.winMsg(players[currentPlayer].name)
      return
    }
    if (checkForTie(Gameboard.getGameboard())) {
      messages.tieMsg()
      gameOver = true
    }
  }

  const restartGame = () => {
    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, '')
    }

    Game.startGame()
    Gameboard.display()
  }

  return { startGame, handleClick, checkWinner, restartGame }
})()

const restartBtn = document.querySelector('#restartGame')

restartBtn.addEventListener('click', () => {
  Game.restartGame()
})

const startBtn = document.querySelector('#startGame')

startBtn.addEventListener('click', () => {
  Game.startGame()
})

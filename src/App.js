import React from "react";
import Confetti from 'react-confetti'

import Die from "./components/Die"
import {nanoid} from "nanoid"
import Stopwatch from "./components/Stopwatch";


function App() {
  const [dice, setDice] = React.useState(startDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [time, setTime] = React.useState(0);
  const [stopwatchIsRunning, setStopwatchIsRunning] = React.useState(false)
  const [bestTime , setBestTime] = React.useState(() => localStorage.getItem("bestTime") || "")

  React.useEffect(() => {
    const allHeld = dice.every(die=>die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die=>die.value===firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      setStopwatchIsRunning(false)
      if (time < bestTime || bestTime === "") {
        localStorage.setItem("bestTime", time)
        setBestTime(time)
      }
      console.log("You won!")
    }
  }, [dice, bestTime, time])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random()*6), 
      isHeld: false, 
      id: nanoid()
    }
  }
  
  function startDice() {
    const startDiceArray = []
    const defaultStr = "STARTGAME!"
    for (let i = 0; i<10; i++) {
      startDiceArray.push({value: defaultStr[i], id: nanoid()})
    }
    return startDiceArray
  }
  

  function allNewDice() {
    const newDiceArray = []
    for (let i = 0; i<10; i++) {
      newDiceArray.push(generateNewDie())
    }
    return newDiceArray
  }

  function handleClick() {
    if (dice[0].value==="S") setStopwatchIsRunning(true)
    if (tenzies === true) {
      setTime(0)
      setDice(allNewDice())
      setTenzies(false)
      setStopwatchIsRunning(true)
      return
    }
    setDice(oldDice => oldDice.map(die => die.isHeld === true ? die : generateNewDie()))
  }

  function holdDice(id) {
    if (!stopwatchIsRunning) return
    setDice(oldDice => oldDice.map(die => die.id===id ? {...die, isHeld: !die.isHeld} : die))
  }

  const diceElements = dice.map(die=> <Die 
                                        key={die.id} 
                                        value={die.value}
                                        isHeld={die.isHeld}
                                        holdDice={()=>holdDice(die.id)}
                                      />)

  function representBestTime() {
    let m = ("0" + Math.floor((bestTime / 60000) % 60)).slice(-2)
    let s = ("0" + Math.floor((bestTime / 1000) % 60)).slice(-2)
    let ms = ("0" + ((bestTime / 10) % 100)).slice(-2)
    return `${m}:${s}:${ms}`
  }

  return (
      <main>
          {tenzies && <Confetti />}
          <h1 className="title">Tenzies</h1>
          <p className="instructions">Roll until all dice are the same. 
          Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
          {diceElements}
        </div>
        <button 
            className="roll-dice" 
            onClick={handleClick}
        >
            {(tenzies || dice[0].value==="S") ? "New Game" : "Roll"}
        </button>
            <div className="time">
                {bestTime!=="" && <div className="best-time">Best time: {representBestTime()}</div>}
                <Stopwatch running={stopwatchIsRunning} time={time} setTime={setTime} />
            </div>
      </main>
  );
}

export default App;

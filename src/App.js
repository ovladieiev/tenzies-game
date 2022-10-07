import React from "react";
import Confetti from 'react-confetti'

import Die from "./components/Die"
import {nanoid} from "nanoid"


function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)

  React.useEffect(() => {
    const allHeld = dice.every(die=>die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die=>die.value===firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      console.log("You won!")
    }
  }, [dice])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random()*6), 
      isHeld: false, id: 
      nanoid()}
  }

  function allNewDice() {
    const newDiceArray = []
    for (let i = 0; i<10; i++) {
      newDiceArray.push(generateNewDie())
    }
    return newDiceArray
  }

  function rollDice() {
    if (tenzies === true) {
      setDice(allNewDice())
      setTenzies(false)
      return
    }
    setDice(oldDice => oldDice.map(die => die.isHeld === true ? die : generateNewDie()))
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => die.id===id ? {...die, isHeld: !die.isHeld} : die))
  }

  const diceElements = dice.map(die=> <Die 
                                        key={die.id} 
                                        value={die.value} 
                                        isHeld={die.isHeld}
                                        holdDice={()=>holdDice(die.id)}
                                      />)

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
          onClick={rollDice}
      >
          {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;

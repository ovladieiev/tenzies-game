import React from 'react'

export default function Stopwatch({running, time, setTime}) {
    const styles={color: (running||time===0) ? "black" : "#59E391"}

    React.useEffect(() => {
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
                }, 10);
        } else if (!running) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [running, setTime]);
  
    const m = ("0" + Math.floor((time / 60000) % 60)).slice(-2)
    const s = ("0" + Math.floor((time / 1000) % 60)).slice(-2)
    const ms = ("0" + ((time / 10) % 100)).slice(-2)

    return (
    <div className="stopwatch">
      <div style={styles} className="numbers">
        <span>{`${m}:${s}:${ms}`}</span>
      </div>
    </div>
  )
}

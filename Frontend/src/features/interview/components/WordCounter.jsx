import React from 'react'
import '../style/word-counter.scss'

const WordCounter = ({ currentWords, maxWords }) => {
  const percentage = (currentWords / maxWords) * 100
  
  return (
    <div className="word-counter">
      <span className="word-text">{currentWords} / {maxWords} words</span>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

export default WordCounter

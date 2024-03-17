import React from 'react'

export default function FinishScreen({points, maxPoints, dispatch}) {
  const percentage = (points/maxPoints * 100)

  let emoji;
  if(percentage === 100) emoji = '🥇';
  if(percentage >= 50 && percentage < 100) emoji = '🎉';
  if(percentage >= 30 && percentage < 50) emoji = '🧐'; 
  if(percentage < 30) emoji = 'It is time to study 🚀'; 
 
  return (
    <>
    <p className='result'>
        <span>{emoji}</span> You scored <strong>{points}</strong> out of {maxPoints} ({Math.ceil(percentage)}%)
    </p>
    <button className='btn btn-ui' onClick={()=> dispatch({type: 'restart'})}>
        Restart quiz
    </button>
    </>
  )
}

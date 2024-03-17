import React, { useEffect } from 'react'

export default function Timer({secondsRemaining, dispatch}) {
 const mins = Math.floor(secondsRemaining / 60);
 const seconds = secondsRemaining % 60;

  useEffect(function(){
    const id = setInterval(() => {
        dispatch({type: 'tick'})
    }, 1000);

    return () => clearInterval(id); // This is a cleanup function in useEffect hook in React. And I think this is the best use case for it
  }, [dispatch])
  return (
    <div className='timer'>
        {mins < 10 && "0"}{mins}:{seconds < 10 && "0"}{seconds}
    </div>
  )
}

import { useEffect, useReducer } from "react";
import "./Components/DateCounter";
import "./index.css";
import Header from  "./Components/Header";
import Main from "./Components/Main";
import Loader from "./Components/Loader";
import Error from "./Components/Error";
import StartScreen from "./Components/StartScreen";
import Question from "./Components/Question";
import NextButton from "./Components/NextButton";
import Progress from "./Components/Progress";
import FinishScreen from "./Components/FinishScreen";
import Footer from "./Components/Footer";
import Timer from "./Components/Timer";

//Initial value
const initialState = 
{
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
}

const TIME_PER_QUESTION = 10;

//useReducer function
function reducer(state, action)
{
  switch(action.type){
    case 'dataReceived':
      return {...state, questions: action.payload, status: 'ready'};

    case 'dataFailed':
      return {...state, status: 'error',};

    case 'start':
      return {...state, status: 'active', secondsRemaining: state.questions.length * TIME_PER_QUESTION};

    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {...state, answer: action.payload, points: action.payload === question.correctOption ? state.points + question.points : state.points };

    case 'nextQuestion':
      return {...state, index: state.index+1, answer: null};

    case 'finish':
      return {...state, status: 'finished'};

    case 'restart':
      return {...initialState, questions: state.questions, status: "ready"};

    case 'tick':
      return {...state, secondsRemaining: state.secondsRemaining-1, status: state.secondsRemaining === 0 ? "finished" : state.status}

    default:
      throw new Error('Action is unknown');
  }
}

function App() {

  const [{questions, status, index, answer, points, secondsRemaining}, dispatch] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  //fetching the data
  useEffect(function(){
    fetch('http://localhost:8000/questions').
    then(res => res.json()).
    then(data => dispatch({type: 'dataReceived', payload: data})).
    catch((error) => dispatch({type: 'dataFailed'}));
  }, [])

  return (
    <div className="app">
     <Header/>

     <Main>
      {status === 'loading' && <Loader/>}
      {status === 'error' && <Error/>}
      {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>} 
      {status === 'active' && 
      (<>
      <Progress index={index} numQuestions={numQuestions} points={points} maxPoints={maxPoints} answer={answer} />
      <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
      <Footer>
        <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
        <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
      </Footer>
       </>
      )}
      {status === 'finished' && <FinishScreen points={points} maxPoints={maxPoints} index={index} numQuestions={numQuestions} dispatch={dispatch} />}
     </Main>
    </div>
  );
}

export default App;

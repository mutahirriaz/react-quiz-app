import React,{useState} from 'react';
// import QuestionCard
import QuestionCard from './components/QuestionCard'
// components
import {fetchQuizQuestion} from './API'
import {Difficulty,QuestionState} from './API'
import './App.css'


// type of AnswerObject
export type AnswerObject = {
  question:string;
  answer:string;
  correctAnswer:string;
  correct:boolean;
}

function App() {

// Total Question
const TOTAL_QUESTIONS = 10;
// our states which dynamic our app
const [loading, setLoading] = useState(false);
const [questions, setQuestions] = useState<QuestionState[]>([]);
const [number, setNumber] = useState(0);
const [userAnswers, setUserAnswers] = useState<AnswerObject[]> ([]);
const [score, setScore] = useState(0);
const [gameOver, setGameOver] = useState(true)

console.log(questions)


  // function calling the api
  const startTrivia = async() =>{

    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestion (
      TOTAL_QUESTIONS,
      Difficulty.Easy
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  // function for check the answer
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {

    if(!gameOver){
      // userAnswer
      const answer = e.currentTarget.value;
      // check answer against correct answer
      const correct = questions[number].correct_answer === answer ;
      // Add score if answer is correct
      if(correct) setScore(prev => prev + 1)
      // save answer in array for user answer
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev)=> [...prev , answerObject]);
    
    }

  }

  // function for next question
  const nextQuestion = () => {
    // move to next question if not the last question
    const nextQuestion = number + 1
    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true)
    }
    else{
      setNumber(nextQuestion)
    }
  }
  return(
    <div className="App" id='wrapper'>
       <h1>Welcome To Quiz-App</h1>
       {/* operation */}
       {gameOver || userAnswers.length===TOTAL_QUESTIONS ?(

       <button className='start' onClick={startTrivia} >
         Start</button>

         ):null}

       {!gameOver?<p style={{color:"white"}} className='score'>score  {score}</p>:null}
      { loading && <p style={{color:"white"}}>Loading Question...</p>}
      
       {!loading && !gameOver ?( <QuestionCard
        questionNr={number+1}
        totalQuestions={TOTAL_QUESTIONS}
        question = {questions[number].question}
        answers = {questions[number].answers}
        userAnswer = {userAnswers ? userAnswers[number] : undefined}
        callback = {checkAnswer}
       />):null}

       { !gameOver && 
       !loading && 
       userAnswers.length === number+1 &&
        number !== TOTAL_QUESTIONS-1 ? (
        <button className='next' onClick={nextQuestion}>Next Question</button>
        ):null}
    </div>
  );
}

export default App;

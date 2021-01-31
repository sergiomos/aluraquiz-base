/* eslint-disable react/prop-types */
import React from 'react';
import Router from 'next/router';
import Lottie from 'react-lottie';
import animationData from '../spinner.json';

// import db from '../../../db.json';
import QuizBackground from '../QuizBackground';
import QuizLogo from '../QuizLogo';
import Widget from '../Widget';
import Footer from '../Footer';
import QuizContainer from '../QuizContainer';
import Button from '../Button';
import AlternativeForm from '../AlternativeForm';
import BackLinkArrow from '../BackLinkArrow';

function ResultsWidget({ results }) {
  const { name } = Router.query;
  return (
    <Widget>
      <Widget.Header>
        Resultados
      </Widget.Header>

      <Widget.Content>
        <p>
          {/* Parabéns você acertou
          {' '}
          {results.reduce((somatoriaAtual, resultAtual) => {
            const isAcerto = resultAtual === true;
            if (isAcerto) {
              return somatoriaAtual + 1;
            }
            return somatoriaAtual;
          }, 0)}
          {' '}
          questoẽs, parabéns! */}

          {name !== undefined && name}

          {`, você acertou ${results.filter((x) => x === true).length} questões, Parabéns`}

        </p>
        <ul>
          {results.map((result, question) => (
            <li key={`result__${result}`}>
              {`#${question + 1} Resuldado: 
              ${result === true
                ? 'Acertou'
                : 'Errou'}` }
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function LoadingWidget() {
  const [isStopped, isPaused] = React.useState(false);
  // const [isPaused, setIsPaused] = React.useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <Lottie
          options={defaultOptions}
          height={100}
          width={100}
          isStopped={isStopped}
          isPaused={isPaused}
        />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  totalQuestion,
  questionIndex,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState();
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <div>
      <Widget>
        <Widget.Header>
          <BackLinkArrow href="/" />
          <h3>
            {`Pergunta ${questionIndex + 1} de ${totalQuestion}`}
          </h3>
        </Widget.Header>

        <img
          alt="Descrição"
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
          }}
          src={question.image}
        />

        <Widget.Content>
          <h2>
            {question.title}
          </h2>
          <p>
            {question.description}
          </p>

          <AlternativeForm
            onSubmit={(event) => {
              event.preventDefault();
              setIsQuestionSubmited(true);
              setTimeout(() => {
                addResult(isCorrect);
                onSubmit();
                setSelectedAlternative(undefined);
                setIsQuestionSubmited(false);
              }, 1 * 1000);
            }}
          >
            {question.alternatives.map((alternative, alternativeIndex) => {
              const alternativeId = `alternative__${alternativeIndex}`;
              const selectedAlternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
              const isSelected = selectedAlternative === alternativeIndex;
              return (
                <Widget.Topic
                  as="label"
                  key={alternativeId}
                  htmlFor={alternativeId}
                  data-selected={isSelected}
                  data-status={isQuestionSubmited && selectedAlternativeStatus}

                >
                  <input
                    style={{ display: 'none' }}
                    id={alternativeId}
                    name={questionId}
                    onChange={() => setSelectedAlternative(alternativeIndex)}
                    type="radio"
                  />
                  {alternative}
                </Widget.Topic>
              );
            })}

            <Button type="submit" disabled={!hasAlternativeSelected}>
              Proxima
            </Button>
          </AlternativeForm>
        </Widget.Content>
      </Widget>
    </div>
  );
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function QuizPage({ externalDb: db }) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResult] = React.useState([]);
  const totalQuestion = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  function addResult(result) {
    setResult([
      ...results,
      result,
    ]);
  }

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 3 * 1000);
  }, []);

  function handleSubmit() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.QUIZ
           && (
           <QuestionWidget
             question={question}
             totalQuestion={totalQuestion}
             questionIndex={questionIndex}
             onSubmit={handleSubmit}
             addResult={addResult}
           />
           )}

        {screenState === screenStates.RESULT && <ResultsWidget results={results} /> }

        <Footer />
      </QuizContainer>
    </QuizBackground>
  );
}

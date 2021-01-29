/* eslint-disable react/prop-types */
import React from 'react';

import db from '../db.json';
import QuizBackground from '../src/components/QuizBackground';
import QuizLogo from '../src/components/QuizLogo';
import GitHubCorner from '../src/components/GitHubCorner';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import QuizContainer from '../src/components/QuizContainer';
import Button from '../src/components/Button';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  totalQuestion,
  questionIndex,
  onSubmit,
}) {
  const questionId = `question__${questionIndex}`;

  function correctAnswer(event) {
    const playerAnswer = event.target.value;
    if (Number(playerAnswer) === question.answer) {
      alert('Resposta correta');
    }
  }
  return (
    <div>
      <Widget>
        <Widget.Header>
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

          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            {question.alternatives.map((alternative, alternativeIndex) => {
              const alternativeId = `alternative__${alternativeIndex}`;
              return (
                <Widget.Topic htmlFor={alternativeId} as="label">
                  <input
                    style={{ display: 'none' }}
                    type="radio"
                    id={alternativeId}
                    name={questionId}
                    onClick={correctAnswer}
                    value={alternativeIndex}
                  />
                  {alternative}
                </Widget.Topic>
              );
            })}

            <Button type="submit">
              Proxima
            </Button>
          </form>
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

export default function QuizPage() {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const totalQuestion = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];

  React.useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function handleSubmit() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestion) {
      setCurrentQuestion(nextQuestion);
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
           />
           )}

        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/sergiomos/aluraquiz-base" />
    </QuizBackground>
  );
}

import React from 'react';
import QuizScreen from '../../src/components/screens/QuizScreen';

export default function QuizDaGaleraPage({ externalDb }) {
  return (
    <QuizScreen
      externalDb={externalDb}
    />
  );
}

export async function getServerSideProps() {
  const externalDb = await fetch('https://witchquiz.sergiomos.vercel.app/api/db')
    .then((serverResponse) => {
      if (serverResponse.ok) {
        return serverResponse.json();
      }
      throw new Error('Falha em pegar os dados');
    })
    .catch((err) => console.error(err));

  return {
    props: {
      externalDb,
    },
  };
}

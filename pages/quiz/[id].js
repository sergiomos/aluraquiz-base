import React from 'react';
import { ThemeProvider } from 'styled-components';

import QuizScreen from '../../src/components/screens/QuizScreen';

export default function QuizDaGaleraPage({ externalDb }) {
  return (
    <ThemeProvider theme={externalDb.theme}>
      <QuizScreen
        externalDb={externalDb}
      />
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  try {
    const { id } = context.query;
    const [projectName, author] = id.split('___');

    const externalDb = await fetch(`https://${projectName}.${author}.vercel.app/api/db`)
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
  } catch (error) {
    throw new Error('Falha em pegar os dados');
  }
}

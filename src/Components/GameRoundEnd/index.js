import React from 'react';

const GameRoundEnd = ({ answers }) => {
  return (
    <section>
      {answers.map((answer, i) => {
        return (
          <article key={i}>
            <h2>{answer.answer}</h2>
            <p>written by</p>
            <h3>{answer.userName}</h3>
            <p>They fooled</p>
            <h3>{answer.selectedBy}</h3>
          </article>
        );
      })}
    </section>
  );
};

export default GameRoundEnd;

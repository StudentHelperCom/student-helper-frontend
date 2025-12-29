'use client'

import {CardsModeType} from "@src/types/api-requests.types";
import React from "react";

interface Props {
  tasksData: CardsModeType;
}

const mockTasksData = {
  mode: 'cards',
  flashcards: [
    {id: 1, question: "question (1)", answer: "answer (1)"},
    {id: 2, question: "question (2)", answer: "answer (2)"},
    {id: 3, question: "question (3)", answer: "answer (3)"},
    {id: 4, question: "question (4)", answer: "answer (4)"},
    {id: 5, question: "question (5)", answer: "answer (5)"},
  ]
}

export default function CardsMode({tasksData}: Props) {
  const [currentCardId, setCurrentCardId] = React.useState<number>(0);
  const [isFlipped, setFlipped] = React.useState<boolean>(false);
  const [isHidden, setHidden] = React.useState<boolean>(false);

  const changeCard = (direction: 'l' | 'r') => {
    setHidden(true);
    setTimeout(() => {
      setFlipped(false);
      console.log('changed content');
      setHidden(false);
    }, 500);
  }

  return (
    <div className="cards-mode">
      <div
        className={
          "cards-mode__card"
          + ((isFlipped) ? " is-flipped" : "")
          + ((isHidden) ? " is-hidden" : "")
        }
        onClick={() => setFlipped(!isFlipped)}
      >
        <div className="cards-mode__side-front">
          FRONT
        </div>
        <div className="cards-mode__side-back">
          BACK
        </div>
      </div>
      <nav className="cards-mode__nav">
        <button className="cards-mode__nav-prev" onClick={() => changeCard('l')}>
          ←
        </button>
        <button className="cards-mode__nav-next" onClick={() => changeCard('r')}>
          →
        </button>
      </nav>
    </div>
  );
}
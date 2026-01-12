'use client'

import {CardsModeType} from "@src/types/api-requests.types";
import React from "react";

interface Props {
  tasksData: CardsModeType;
}

export default function CardsMode({tasksData}: Props) {
  const [currentCardId, setCurrentCardId] = React.useState<number>(0);
  const [isFlipped, setFlipped] = React.useState<boolean>(false);
  const [isChangingCard, setChangingCard] = React.useState<boolean>(false);

  const flashcards = tasksData?.flashcards || [];
  const currentCard = flashcards[currentCardId];
  const hasCards = flashcards.length > 0;

  const changeCard = (isNext: boolean) => {
    // true - right; false - left;
    if (!hasCards) return;
    if (isNext && currentCardId >= flashcards.length - 1) return;
    if (!isNext && currentCardId <= 0) return;

    setChangingCard(true);
    setFlipped(false);

    setTimeout(() => {
      setCurrentCardId((prev) => prev + (isNext ? 1 : -1));
      setChangingCard(false);
    }, 500);
  }

  return (
    <div className="cards-mode">
      <div
        className={
          "cards-mode__card"
          + ((isFlipped) ? " is-flipped" : "")
          + ((isChangingCard) ? " is-hidden" : "")
        }
        onClick={() => setFlipped(!isFlipped)}
      >
        <div className="cards-mode__side-front">
          {currentCard ? currentCard.question : "No flashcards available"}
        </div>
        <div className="cards-mode__side-back">
          {currentCard ? currentCard.answer : ""}
        </div>
      </div>
      <span className="cards-mode__pages">
        {currentCardId + 1}/{flashcards.length}
      </span>
      <nav className="cards-mode__nav">
        <button
          className="cards-mode__nav-prev"
          onClick={() => changeCard(false)}
          disabled={!hasCards || currentCardId === 0}
        >
          ←
        </button>
        <button
          className="cards-mode__nav-next"
          onClick={() => changeCard(true)}
          disabled={!hasCards || currentCardId === flashcards.length - 1}
        >
          →
        </button>
      </nav>
    </div>
  );
}
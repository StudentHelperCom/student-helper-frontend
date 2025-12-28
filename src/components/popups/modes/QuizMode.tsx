'use client'

import {QuizModeType} from "@src/types/api-requests.types";
import {useState} from "react";
import {useAlert} from "@components/contexts/AlertDialogContext";

interface Props {
  tasksData: QuizModeType;
}

export default function QuizMode({tasksData}: Props) {
  const [chosenAnswers, setChosenAnswers] = useState<Record<number, number>>({});
  const [isRevealedAnswers, setIsRevealedAnswers] = useState<boolean>(false);
  const {showAlert} = useAlert();

  const showResults = () => {
    let correctAnsCounter = 0;

    const correctAnswersMap =
      tasksData.questions.reduce((acc, question, index) => {
        const correctAnsIndex = question.answers.findIndex((ans) => ans.is_correct);

        if (correctAnsIndex !== -1) {
          acc[index] = correctAnsIndex;
        }

        return acc;
      }, {} as Record<number, number>);

    for (const que in correctAnswersMap) {
      const questionIndex = Number(que);
      if (chosenAnswers[questionIndex] === correctAnswersMap[questionIndex]) {
        correctAnsCounter++;
      }
    }

    const totalQuestions = Object.keys(correctAnswersMap).length;
    const scoreRatio = correctAnsCounter / totalQuestions;
    let message = '';

    if (scoreRatio === 1) {
      message += 'Perfect score! 🏆';
    } else if (scoreRatio > 0.8) {
      message += 'Impressive work! You know your stuff.';
    } else if (scoreRatio > 0.5) {
      message += 'Not bad! A little more study needed.';
    } else {
      message += 'Oof, tough one. Give it another shot!';
    }

    const percentage = scoreRatio.toLocaleString(undefined, { style: 'percent' });
    showAlert(`${message} You scored ${correctAnsCounter} (${percentage}) out of ${totalQuestions}.`, false);
  }

  const onCheckAnswer = () => {
    if (Object.keys(chosenAnswers).length < tasksData.questions.length) {
      showAlert('Select an answer to each question before completing the test', true);
      return;
    }

    showResults();
    setIsRevealedAnswers(true);
  }

  const onRestart = () => {
    setChosenAnswers({});
    setIsRevealedAnswers(false);
  }

  return (
    <div className="quiz-mode">
      <ul className="quiz-mode__list">
        {
          tasksData?.questions?.map((que, queID) => {
            return (
              <li className="quiz-mode__question" key={queID}>
                <span className="quiz-mode__question-text">
                  {`${que.id}. ${que.question}`}
                </span>

                <div className="quiz-mode__answers">
                  {que?.answers?.map((ans, ansID) => {
                    const labelLink = `q${queID}-a${ansID}`;
                    const revealedColorClass =
                      ' quiz-mode__answer' + ((ans.is_correct) ? '--correct' : '--incorrect');

                    return (
                      <label
                        className={`quiz-mode__answer 
                          ${isRevealedAnswers ? revealedColorClass : ''}
                        `}
                        key={queID + ansID}
                        htmlFor={labelLink}
                      >
                        <input
                          className="quiz-mode__radio"
                          type="radio"
                          id={labelLink}
                          name={`question-${queID}`}
                          checked={chosenAnswers[queID] === ansID}
                          onChange={() => setChosenAnswers(prev => ({...prev, [queID]: ansID}))}
                          disabled={isRevealedAnswers}
                        />
                        <span className="quiz-mode__answer-text">
                          {ans.text}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </li>
            );
          })
        }
      </ul>

      <div className="quiz-mode__buttons">
        <button className="quiz-mode__button quiz-mode__button--larger" onClick={onCheckAnswer} disabled={isRevealedAnswers}>
          Check answers
        </button>
        <button className="quiz-mode__button quiz-mode__button--smaller" onClick={onRestart}>
          Restart
        </button>
      </div>
    </div>
  );
}
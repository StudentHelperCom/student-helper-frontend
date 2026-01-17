import {EvaluatePair, EvaluatePayload, ExpandedModeType} from "@src/types/api-requests.types";
import {ChangeEvent, useEffect, useState} from "react";
import {useEvaluate} from "@src/hooks/useEvaluate";
import {useAlert} from "@components/contexts/AlertDialogContext";

interface Props {
  tasksData: {
    data: ExpandedModeType;
    selectedIds: string[],
  };
}

type ChosenAnswersType = Record<number, { answer: string, chars: number }>;
type SuggestionsType = Record<number, { isCorrect: boolean, correctAnswer: string, problems: string[] }>;

export default function ExpandedMode({tasksData}: Props) {
  const [chosenAnswers, setChosenAnswers] = useState<ChosenAnswersType>({});
  const [suggestions, setSuggestions] = useState<SuggestionsType>({});
  const {data, selectedIds} = tasksData || {};
  const {evaluate} = useEvaluate();
  const {showAlert} = useAlert();

  const handleSubmit = () => {
    if (Object.keys(chosenAnswers).length < data.questions.length) {
      showAlert('Enter answer to each question before checking');
      return;
    }

    const payload = {
      topicIds: selectedIds,
      answers: Object.entries(chosenAnswers).map(([key, value]) => ({
        id: key,
        question: data.questions.find((x) => x.id === +key)?.question,
        answer: value.answer,
      })) as unknown as EvaluatePair[]
    }

    evaluate(
      payload as EvaluatePayload,
      {
        onSuccess: (data) => {
          setSuggestions(() => {
            const suggestionData = data.results.reduce((prev, item) => {
              const singleSuggestion = {
                isCorrect: item.is_correct,
                correctAnswer: item.correct_answer,
                problems: item.problems,
              };

              return {...prev, [item.id]: singleSuggestion}
            }, {});

            return suggestionData as SuggestionsType;
          });
        },
        onError: (error) => {
          console.error("Evaluating error:", error);
        }
      }
    );
  }
  
  useEffect(() => {console.log(suggestions)}, [suggestions])

  return (
    <div className="expanded-mode">
      <ul className="expanded-mode__list">
        {
          data?.questions?.map((que, index) => (
            <li className="flex flex-col gap-2" key={index}>
              <span className="expanded-mode__question-text">
                {`${index + 1}. ${que.question}`}
              </span>
              <textarea
                className={`expanded-mode__answer-area ${
                  suggestions[que.id]?.isCorrect === true ? 'expanded-mode__answer-area--correct'
                    : suggestions[que.id]?.isCorrect === false ? 'expanded-mode__answer-area--incorrect'
                      : ''
                }`}
                maxLength={500}
                placeholder="Enter your answer here"
                value={chosenAnswers[que.id]?.answer || ''}
                onChange={
                  (e: ChangeEvent<HTMLTextAreaElement>) => setChosenAnswers(prev => (
                    {...prev, [que.id]: {answer: e.target.value, chars: e.target.value.length}}
                  ))
                }
                disabled={Object.keys(suggestions).length !== 0}
              />
              <span className="text-right">
                {chosenAnswers[que.id]?.chars || 0}/500
              </span>
              {suggestions[que.id] && (
                <div className="flex flex-col">
                  <p>Your answer is {(suggestions[que.id].correctAnswer) ? 'correct' : 'incorrect'}</p>

                  <p className="font-bold">Suggested answer:</p>
                  <p className="opacity-80 ml-2">{suggestions[que.id].correctAnswer}</p>

                  <p className="font-bold">
                    {suggestions[que.id]?.problems?.length && 'The following problems were noticed:'}
                  </p>
                  <ul className="opacity-80 ml-2">
                    {
                      suggestions[que.id]?.problems?.map((problem, index) => (
                        <li key={index}> — {problem}</li>
                      ))
                    }
                  </ul>
                </div>
              )}
            </li>
          ))
        }
      </ul>

      <div className="expanded-mode__buttons">
        <button
          className="expanded-mode__button expanded-mode__button--larger"
          onClick={handleSubmit}
        >
          Check answers
        </button>
        <button
          className="expanded-mode__button expanded-mode__button--smaller"
          onClick={() => {
            setChosenAnswers({});
            setSuggestions({});
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

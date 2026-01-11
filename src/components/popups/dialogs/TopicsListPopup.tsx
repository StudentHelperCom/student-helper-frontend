'use client'

import React, {useEffect, useState} from "react";
import {useTopicsList} from "@src/hooks/useTopicsList";
import {useSession} from "next-auth/react";
import {useClassManager} from "@components/contexts/ClassManagerContext";
import {useModeGenerator} from "@src/hooks/useModeGenerator";
import {useLoader} from "@components/contexts/LoaderContext";
import {PopupName, usePopupManager} from "@components/contexts/PopupManagerContext";

export enum availableModes {
  'Quiz' = 'Quiz mode',
  'Study' = 'Studying',
  'Expanded' = 'Expanded answers',
  'Cards' = 'Flip cards',
}

interface Props {
  currentMode: availableModes
}

export default function TopicsListPopup({currentMode}: Props) {
  const {data: session} = useSession();
  const {selectedClass} = useClassManager();
  const {setLoaderStatus} = useLoader();
  const {openPopup} = usePopupManager();

  const {
    topics,
    isLoading,
    isError,
  } = useTopicsList(session?.user.backendToken, selectedClass?.classID || null);

  const {
    generate,
    data: generatedData,
    isLoading: isGenerating,
    isError: isGeneratorError
  } = useModeGenerator(session?.user.backendToken);

  const [selectedTopics, setSelectedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (topics && topics.length > 0) {
      const initialState = topics.reduce(
        (acc, topic) => ({...acc, [topic.topicID]: false}),
        {} as Record<string, boolean>
      );
      setSelectedTopics(initialState);
    }
  }, [topics]);

  useEffect(() => {
    setLoaderStatus(isGenerating);
  }, [isGenerating, setLoaderStatus]);

  const handleToggle = (topicId: string) => {
    setSelectedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const handleSubmit = () => {
    const selectedIds = Object.keys(selectedTopics).filter(id => selectedTopics[id]);

    generate(
      {mode: currentMode, topicIds: selectedIds},
      {
        onSuccess: (data) => {
          openPopup(currentMode as unknown as PopupName, data);
        },
        onError: (error) => {
          console.error("Generating error:", error);
        }
      }
    );
  };

  return (
    <div className="topics">
      <ul className="topics__list">
        {isError && <li className="topics__element" style={{color: 'red'}}>Error loading topics.</li>}

        {!isError && !isLoading && topics?.map((topic, index) => (
          <li className="topics__element" key={index}>
            <label className="topics__name" htmlFor={`topic-${topic.topicID}`}>
              {(index + 1) + ". " + topic.name}
            </label>
            <input
              className="topics__checkbox"
              type="checkbox"
              id={`topic-${topic.topicID}`}

              checked={!!selectedTopics[topic.topicID]}
              onChange={() => handleToggle(topic.topicID)}
            />
          </li>
        ))}

        {!isLoading && !isError && topics?.length === 0 && (
          <li className="topics__element">
            There are no topics yet.
          </li>
        )}
      </ul>

      <button
        className="topics__button"
        onClick={handleSubmit}
        disabled={!isLoading && !isError && topics?.length === 0}
      >
        Submit topics
      </button>
    </div>
  )
}
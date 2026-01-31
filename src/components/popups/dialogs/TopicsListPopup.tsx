'use client'

import React, {useEffect, useState} from "react";
import {useTopicsList} from "@src/hooks/useTopicsList";
import {useClassManager} from "@components/contexts/ClassManagerContext";
import {useModeGenerator} from "@src/hooks/useModeGenerator";
import {PopupName, usePopupManager} from "@components/contexts/PopupManagerContext";

export enum availableModes {
  'Summary' = 'Summary',
  'Cards' = 'Flip cards',
  'Quiz' = 'Quiz mode',
  'Expanded' = 'Expanded answers',
}

interface Props {
  currentMode: availableModes
}

export default function TopicsListPopup({currentMode}: Props) {
  const {selectedClass} = useClassManager();
  const {openPopup} = usePopupManager();

  const {
    topics,
    isLoading,
    isError,
  } = useTopicsList(selectedClass?.classID || null);

  const {generate} = useModeGenerator();

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
          if (currentMode as string !== 'Expanded') {
            openPopup(currentMode as unknown as PopupName, data);
          } else {
            openPopup(currentMode as unknown as PopupName, {data, selectedIds});
          }
        },
        onError: (error) => {
          console.error("Generating error:", error);
        }
      }
    );
  };

  const handleSelectionAll = (setValue: boolean) => {
    setSelectedTopics(
      Object.fromEntries(Object.keys(selectedTopics)
        .map(key => [key, setValue])
      )
    );
  };

  return (
    <div className="topics">
      {!isLoading && !isError && (topics?.length ?? 0) > 0 && (
        <div className="flex w-full">
          <button className="topics__selection-button" onClick={() => handleSelectionAll(true)}>
            Select All
          </button>
          <button className="topics__selection-button" onClick={() => handleSelectionAll(false)}>
            Unselect All
          </button>
        </div>
      )}
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

              checked={selectedTopics[topic.topicID] || false}
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
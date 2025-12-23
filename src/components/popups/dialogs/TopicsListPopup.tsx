'use client'

import React, { useEffect, useState } from "react";
import { useTopicsList } from "@src/hooks/useTopicsList";
import { useSession } from "next-auth/react";
import { useClassManager } from "@components/contexts/ClassManagerContext";
import {useQuiz} from "@src/hooks/useQuiz";

export const availableModes = ['Quiz', 'Study', 'Expanded', 'Cards'];
export const availableModesNames = ['Test mode', 'Studying', 'Expanded answers', 'Flip cards'];

export default function TopicsListPopup({ currentMode }: { currentMode: string }) {
  const { data: session } = useSession();
  const { selectedClass } = useClassManager();

  const {
    topics,
    isLoading,
    isError,
  } = useTopicsList(session?.user.backendToken, selectedClass?.id || null);
  const {data: quiz, generateQuiz, isLoading: isGenerating} = useQuiz(session?.user.backendToken);

  const [selectedTopics, setSelectedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (topics && topics.length > 0) {
      const initialState = topics.reduce(
        (acc, topic) => ({ ...acc, [topic.id]: false }),
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

    generateQuiz({mode: currentMode, topicIds: selectedIds});
  };

  useEffect(() => {
    console.log('quiz: ', quiz);
  }, [quiz]);

  return (
    <div className="topics">
      <ul className="topics__list">
        {isError && <li className="topics__element" style={{ color: 'red' }}>Error loading topics.</li>}

        {!isError && !isLoading && topics?.map((topic, index) => (
          <li className="topics__element" key={topic.id}>
            <label className="topics__name" htmlFor={`topic-${topic.id}`}>
              {(index + 1) + ". " + topic.topicName}
            </label>
            <input
              className="topics__checkbox"
              type="checkbox"
              id={`topic-${topic.id}`}

              checked={!!selectedTopics[topic.id]}
              onChange={() => handleToggle(topic.id)}
            />
          </li>
        ))}

        {!isLoading && !isError && topics?.length === 0 && (
          <li className="topics__element">
            There are no topics yet.
          </li>
        )}
      </ul>

      <button className="topics__button" onClick={handleSubmit}>
        Submit topics
      </button>
    </div>
  )
}
'use client'

import React, {useEffect} from "react"; // useEffect usunięty, bo console.log nie jest konieczny
import {useTopicsList} from "@src/hooks/useTopicsList";
import {useSession} from "next-auth/react";
import {useClassManager} from "@components/contexts/ClassManagerContext";

export const availableModes = ['test', 'study', 'expanded', 'flip'];
export const availableModesNames = ['Test mode', 'Studying', 'Expanded answers', 'Flip cards'];

interface TopicsListProps {
  currentMode: string,
}

export default function TopicsListPopup({currentMode}: TopicsListProps) {
  const {data: session} = useSession();
  const {selectedClass} = useClassManager();
  const {
    topics,
    isLoading,
    isError,
  } = useTopicsList(session?.user.backendToken || null, selectedClass?.id || null);

  return (
    <div className="topics">
      <ul className="topics__list">
        
        {isError && <li className="topics__element" style={{color: 'red'}}>Error loading topics.</li>}
        
        {!isError && !isLoading && topics?.map((topic, index) => (
          <li className="topics__element" key={topic.id || index}>
            <label className="topics__name" htmlFor={"topic" + index}>
              {(index + 1) + ". " + topic.topicName}
            </label>
            <input className="topics__checkbox" type="checkbox" id={"topic" + index}/>
          </li>
        ))}
        
        {!isLoading && !isError && topics?.length === 0 && (
          <li className="topics__element">
            There are no topics yet.
          </li>
        )}
      </ul>
      <button className="topics__button">
        Submit topics
      </button>
    </div>
  )
}
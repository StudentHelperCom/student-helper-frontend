'use client'

import React from "react";

export default function TopicsListPopup({ topics }: { topics: Array<string> }) {
  return (
    <div className="topics">
      <ul className="topics__list">
        {topics.map((topic, index) => (
          <li className="topics__element" key={index}>
            <label className="topics__name" htmlFor={"topic" + index}>{(index + 1) + ". " + topic}</label>
            <input className="topics__checkbox" type="checkbox" id={"topic" + index} />
          </li>
        ))}
      </ul>
      <button className="topics__button">
        Submit topics
      </button>
    </div>
  )
}
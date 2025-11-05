'use client'

export default function TopicsListPopup({ topics }: { topics: Array<string> }) {
  return (
    <ul className="topics">
      {topics.map((topic, index) => (
        <li className="topics__element" key={index}>
          <label className="topics__name" htmlFor={"topic" + index}>{(index + 1) + ". " + topic}</label>
          <input className="topics__checkbox" type="checkbox" id={"topic" + index} />
        </li>
      ))}
    </ul>
  )
}
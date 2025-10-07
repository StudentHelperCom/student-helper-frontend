export default function TopicsListPopup({ topics }: { topics: Array<string> }) {
  return (
    <ul className="topics">
      {topics.map((topic, index) => (
        <li className="topics__element" key={index}>
          <span className="topics__name">{(index + 1) + ". " + topic}</span>
          <input className="topics__checkbox" type="checkbox" />
        </li>
      ))}
    </ul>
  )
}
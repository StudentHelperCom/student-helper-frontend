import {SummaryBlock, SummaryModeType} from "@src/types/api-requests.types";

interface Props {
  tasksData: SummaryModeType;
}

export default function SummaryMode({tasksData}: Props) {

  const parseBoldText = (text: string) => {
    const parts = text.split('**');

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <b key={index}>{part}</b>;
      }
      return part;
    });
  };

  const createDocElement = (block: SummaryBlock, index: number) => {
    switch (block.type) {
      case 'heading':
        return (
          <h1 className="summary-mode__heading" key={index}>
            {block.value}
          </h1>
        );
      case 'text':
        return (
          <p className="summary-mode__text" key={index}>
            {parseBoldText(block.value)}
          </p>
        );
      case 'list':
        return (
          <ul className="summary-mode__list" key={index}>
            {block?.items?.map((item, index) => (
              <li key={index}>{parseBoldText(item)}</li>
            ))}
          </ul>
        );
      default:
        return (
          <p className="color-red">Unknown element type</p>
        )
    }
  }

  return (
    <div className="summary-mode">
      <div className="summary-mode__content">
        {
          tasksData?.summary?.map((elem, index) => {
            return createDocElement(elem, index);
          })
        }
      </div>
    </div>
  );
}
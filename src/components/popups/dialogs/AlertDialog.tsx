interface Props {
  message: string;
  closeFn: () => void;
}

export default function AlertDialog({message, closeFn}: Props) {
  return (
    <div className="scrim scrim--opened">
      <div className="alert">
        <span className="alert__message" >
          {message}
        </span>
        <button className="alert__button" onClick={closeFn}>
          Got it!
        </button>
      </div>
    </div>
  );
}
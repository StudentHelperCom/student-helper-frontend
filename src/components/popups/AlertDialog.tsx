interface Props {
  message: string;
  showCloseButton: boolean;
  closeFn: () => void;
}

export default function AlertDialog({message, showCloseButton, closeFn}: Props) {
  return (
    <div className="scrim scrim--opened">
      <div className="alert">
        <span className="alert__message" >
          {message}
        </span>
        {showCloseButton && <button className="alert__button" onClick={closeFn}>
            Got it!
        </button>}
      </div>
    </div>
  );
}
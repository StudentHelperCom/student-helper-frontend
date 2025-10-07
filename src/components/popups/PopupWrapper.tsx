import Image from "next/image"

export default function PopupWrapper({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="scrim">
      <section className="popup">
        <div className="popup__header">
          <span className="popup__title">{title}</span>
          <button className="popup__close">
            <Image src="icons/close.svg" alt="Close" width={30} height={30} />
          </button>
        </div>
        <div className="popup__content">
          {children}
        </div>
      </section>
    </div>
  )
}
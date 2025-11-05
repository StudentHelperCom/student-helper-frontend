'use client'

import Image from "next/image"
import React from "react";

type Props = {
  children: React.ReactNode,
  title: string,
  isOpened: boolean,
  closeAction: () => void
}

export default function PopupWrapper({children, title, isOpened, closeAction}: Props) {
  return (
    <div className={"scrim" + (isOpened ? " scrim--opened" : "")}>
      <section className="popup">
        <div className="popup__header">
          <span className="popup__title">{title}</span>
          <button className="popup__close" onClick={() => closeAction()}>
            <Image src="icons/close.svg" alt="Close" width={30} height={30}/>
          </button>
        </div>
        <div className="popup__content">
          {children}
        </div>
      </section>
    </div>
  )
}
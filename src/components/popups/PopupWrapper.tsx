'use client'

import Image from "next/image"
import React from "react";

type Props = {
  children: React.ReactNode,
  title: string,
  refIsOpened: boolean,
  refSetIsOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function PopupWrapper({children, title, refIsOpened, refSetIsOpened}: Props) {
  return (
    <div className={"scrim" + (refIsOpened ? " scrim--opened" : "")}>
      <section className="popup">
        <div className="popup__header">
          <span className="popup__title">{title}</span>
          <button className="popup__close" onClick={() => refSetIsOpened(false)}>
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
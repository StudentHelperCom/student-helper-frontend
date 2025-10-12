'use client'

import Image from "next/image"
import React from "react";

export default function PopupWrapper({ children, title }: { children: React.ReactNode, title: string }) {
  const [opened, setOpened] = React.useState(true)

  if (opened) {
    return (
      <div className="scrim">
        <section className="popup">
          <div className="popup__header">
            <span className="popup__title">{title}</span>
            <button className="popup__close" onClick={() => setOpened(false)}>
              <Image src="icons/close.svg" alt="Close" width={30} height={30} />
            </button>
          </div>
          <div className="popup__content">
            {children}
          </div>
        </section>
      </div>
    )
  } else {
    return <></>
  }
}
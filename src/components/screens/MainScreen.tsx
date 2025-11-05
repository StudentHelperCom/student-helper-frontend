'use client'

import Image from "next/image"
import React, {useEffect} from "react";
import {useLoaderContext} from "@components/contexts/LoaderContext";
import {usePopupManager} from "@components/contexts/PopupManagerContext";

export default function MainScreen() {
  const {activePopup, openPopup, closePopup} = usePopupManager()
  const {getter: loaderOpened, setter: setLoaderOpened} = useLoaderContext();

  const availableModes = ["Studying", "Test mode", "Expanded answers", "Flip cards"];

  useEffect(() => {
    setLoaderOpened(true)
    setTimeout(() => {
      setLoaderOpened(false)
    }, 1000)
  }, [setLoaderOpened]);

  return (
    <>
      <main className="main">
        <div className="main__side">
          <span className="main__title">
            wdm
          </span>
          <div className="main__doc-preview">
          </div>
          <div className="main__manage-options">
            <button className="main__single-option" onClick={() => {
              openPopup("add")
            }}>
              <Image src="/icons/add.svg" className="main__option-icon" alt="Add" width={100} height={100}
                     draggable={false}/>
            </button>
            <button className="main__single-option">
              <Image src="/icons/download.svg" className="main__option-icon" alt="Add" width={100} height={100}
                     draggable={false}/>
            </button>
          </div>
        </div>
        <div className="main__side">
          <span className="main__title">
            Choose mode
          </span>
          <ul className="main__modes-list">
            {availableModes.map((modeName, index) => {
              return (
                <li key={index}>
                  <button className="main__single-mode" onClick={() => {
                    openPopup("topics")
                  }}>
                    {modeName}
                  </button>
                </li>
              )
            })}
          </ul>
          <Image src="/images/actually.gif" className="rounded-[15px] opacity-3" width={200} height={200} alt="akfuawi" />
        </div>
      </main>
    </>
  )
}
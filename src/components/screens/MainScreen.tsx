'use client'

import Image from "next/image"
import ClassesMenu from "@components/ClassesMenu";
import CalendarMenu from "@components/CalendarMenu";
import AddSourcesPopup from "@components/popups/AddSourcePopup";
import PopupWrapper from "@components/popups/PopupWrapper";
import TopicsListPopup from "@components/popups/TopicsListPopup";
import NewClassPopup from "@components/popups/NewClassPopup";
import LoaderOverlay from "@components/LoaderOverlay";
import React from "react";
import {LoaderContext} from "@components/contexts/LoaderContext";

export default function MainScreen() {
  const [isOpenedAdd, setIsOpenedAdd] = React.useState(false);
  const [isOpenedNew, setIsOpenedNew] = React.useState(false);
  const [isOpenedTopics, setIsOpenedTopics] = React.useState(false);

  const [loaderOpened, setLoaderOpened] = React.useState(true);

  setTimeout(() => {
    setLoaderOpened(false)
  }, 1000)

  return (
    <>
      <LoaderContext.Provider value={{getter: loaderOpened, setter: setLoaderOpened}}>
        <main className="main">
          <div className="main__side">
          <span className="main__title">
            wdm
          </span>
            <div className="main__doc-preview">
            </div>
            <div className="main__manage-options">
              <button className="main__single-option" onClick={() => {setIsOpenedAdd(true)}}>
                <Image src="icons/add.svg" className="main__option-icon" alt="Add" width={100} height={100} draggable={false} />
              </button>
              <button className="main__single-option">
                <Image src="icons/download.svg" className="main__option-icon" alt="Add" width={100} height={100} draggable={false} />
              </button>
            </div>
          </div>
          <div className="main__side">
          <span className="main__title">
            Choose mode
          </span>
            <ul className="main__modes-list">
              <li>
                <button className="main__single-mode" onClick={() => {setIsOpenedTopics(true)}}>
                  Studying
                </button>
              </li>
              <li>
                <button className="main__single-mode" onClick={() => {setIsOpenedTopics(true)}}>
                  Test mode
                </button>
              </li>
              <li>
                <button className="main__single-mode" onClick={() => {setIsOpenedTopics(true)}}>
                  Expanded answers
                </button>
              </li>
              <li>
                <button className="main__single-mode" onClick={() => {setIsOpenedTopics(true)}}>
                  Flip cards
                </button>
              </li>
            </ul>
          </div>
        </main>

        {loaderOpened && <LoaderOverlay/>}

        <ClassesMenu />
        <CalendarMenu />

        <PopupWrapper title="Add Sources" refIsOpened={isOpenedAdd} refSetIsOpened={setIsOpenedAdd}>
          <AddSourcesPopup  />
        </PopupWrapper>

        <PopupWrapper title="List of Topics" refIsOpened={isOpenedTopics} refSetIsOpened={setIsOpenedTopics}>
          <TopicsListPopup topics={[
            "Fajny topic dla nauki",
            "Ekstra topic tez fajny",
            "A ten to jest sigma++",
            "Fajny topic dla nauki",
            "Ekstra topic tez fajny",
            "A ten to jest sigma++",
          ]} />
        </PopupWrapper>

        <PopupWrapper title="New Class" refIsOpened={isOpenedNew} refSetIsOpened={setIsOpenedNew}>
          <NewClassPopup />
        </PopupWrapper>
      </LoaderContext.Provider>
    </>
  )
}
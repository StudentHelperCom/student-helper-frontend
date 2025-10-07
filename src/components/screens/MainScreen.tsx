'use client'

import Image from "next/image"
import ClassesMenu from "@components/ClassesMenu";
import CalendarMenu from "@components/CalendarMenu";
import AddSourcesPopup from "@components/popups/AddSourcePopup";
import PopupWrapper from "@components/popups/PopupWrapper";
import TopicsListPopup from "@components/popups/TopicsListPopup";
import NewClassPopup from "@components/popups/NewClassPopup";

export default function MainScreen() {
  const showAddPopup = false
  const showTopicsPopup = true
  const showNewPopup = false

  return (
    <>
      <ClassesMenu />

      <main className="main">
        <div className="main__side">
          <span className="main__title">
            wdm
          </span>
          <div className="main__doc-preview">
          </div>
          <div className="main__manage-options">
            <button className="main__single-option">
              <Image src="icons/add.svg" className="h-full" alt="Add" width={100} height={100} draggable={false} />
            </button>
            <button className="main__single-option">
              <Image src="icons/download.svg" className="h-[80%]" alt="Add" width={100} height={100} draggable={false} />
            </button>
          </div>
        </div>
        <div className="main__side">
          <span className="main__title">
            Choose mode
          </span>
          <ul className="main__modes-list">
            <li>
              <button className="main__single-mode">
                Studying
              </button>
            </li>
            <li>
              <button className="main__single-mode">
                Test mode
              </button>
            </li>
            <li>
              <button className="main__single-mode">
                Expanded answers
              </button>
            </li>
            <li>
              <button className="main__single-mode">
                Flip cards
              </button>
            </li>
          </ul>
        </div>
      </main>

      {showAddPopup && (
        <PopupWrapper title="Add Sources">
          <AddSourcesPopup />
        </PopupWrapper>
      )}

      {showTopicsPopup && (
        <PopupWrapper title="List of Topics">
          <TopicsListPopup topics={[
              "Fajny topic dla nauki",
              "Ekstra topic tez fajny ghj gh jgh jgh ghj gj gh gh jg",
              "A ten to jest sigma++",
              "Fajny topic dla nauki",
              "Ekstra topic tez fajny",
              "A ten to jest sigma++",
              "Fajny topic dla nauki",
              "Ekstra topic tez fajny",
              "A ten to jest sigma++",
              "Fajny topic dla nauki",
              "Ekstra topic tez fajny",
              "A ten to jest sigma++",
              "Fajny topic dla nauki",
              "Ekstra topic tez fajny",
              "A ten to jest sigma++",
              "Fajny topic dla nauki",
              "Ekstra topic tez fajny",
              "A ten to jest sigma++",
            ]} />
        </PopupWrapper>
      )}

      {showNewPopup && (
        <PopupWrapper title="New Class">
          <NewClassPopup />
        </PopupWrapper>
      )}

      <CalendarMenu />
    </>
  )
}
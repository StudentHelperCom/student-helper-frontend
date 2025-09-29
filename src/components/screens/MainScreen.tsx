'use client'

import ClassesMenu from "@components/ClassesMenu";
import CalendarMenu from "@components/CalendarMenu";

export default function MainScreen() {
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
              edt
            </button>
            <button className="main__single-option">
              add
            </button>
            <button className="main__single-option">
              dwnld
            </button>
            <button className="main__single-option">
              fnd
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

      <CalendarMenu />
    </>
  )
}
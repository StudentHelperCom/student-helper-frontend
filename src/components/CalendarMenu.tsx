'use client'

import Image from "next/image";
import React from "react";
import dayjs from "dayjs";

interface Props {
  isOpened: boolean;
  onToggle: () => void;
}

export default function CalendarMenu({isOpened, onToggle}: Props) {
  const [currentMonth, setCurrentMonth] = React.useState(dayjs());

  function getCellsData() {
    const cellsData: Array<{ day: number }> = [];

    const firstDayFormatted =
      (currentMonth.date(1).day() != 0) ? currentMonth.date(1).day() : 7;
    const daysInMonth = currentMonth.daysInMonth();

    for (let i = 2 - firstDayFormatted; cellsData.length < 42; i++) {
      if (i > 0 && i <= daysInMonth) {
        cellsData.push({day: i})
      } else {
        cellsData.push({day: -1})
      }
    }

    return cellsData;
  }

  return (
    <aside className={"calendar-menu" + (isOpened ? " calendar-menu--opened" : "")}>
      <div className="calendar-menu__content">
        <span className="calendar-menu__title">
          Calendar
        </span>
        <div className="calendar">
          <div className="calendar__nav">
            <button className="calendar__change-month"
                    onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}>
              <Image src="icons/arrow.svg" className="calendar__arrow-icon--rotated" alt="Go previous" width={100}
                     height={100} draggable={false}/>
            </button>
            <span className="calendar__current-month">
              {currentMonth.format('MMMM')}
            </span>
            <button className="calendar__change-month" onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}>
              <Image src="icons/arrow.svg" alt="Go next" width={100} height={100} draggable={false}/>
            </button>
          </div>
          <ul className="calendar__days-of-week">
            <li className="calendar__day-name">Mon</li>
            <li className="calendar__day-name">Tue</li>
            <li className="calendar__day-name">Wed</li>
            <li className="calendar__day-name">Thu</li>
            <li className="calendar__day-name">Fri</li>
            <li className="calendar__day-name">Sat</li>
            <li className="calendar__day-name">Sun</li>
          </ul>
          <div className="calendar__grid">
            {/*<div className="calendar__day-cell calendar__day-cell--highlighted">7</div>*/}
            {
              getCellsData().map((cell, index) => {
                let setOfClassNames = "calendar__day-cell";

                (cell.day === -1) ? setOfClassNames += " calendar__day-cell--inactive" : 0;

                // remember: replace below testing line with correct condition
                (cell.day === 17 || cell.day === 9 || cell.day === 27) ?
                  setOfClassNames += " calendar__day-cell--highlighted" : 0;

                return (
                  <div className={setOfClassNames} key={index}>
                    {(cell.day !== -1) ? cell.day : ''}
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <div className="calendar-menu__trigger" onClick={onToggle}>
        <Image src="icons/calendar.svg" className="calendar-menu__calendar-icon" alt="Calendar" width={100} height={100} draggable={false}/>
      </div>
    </aside>
  )
}
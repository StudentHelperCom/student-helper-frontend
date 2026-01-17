'use client'

import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import { useClassesList } from "@src/hooks/useClassesList";
import { useSession } from "next-auth/react";
import { useAlert } from "@components/contexts/AlertDialogContext";

interface Props {
  isOpened: boolean;
  onToggle: () => void;
}

type CellType = {
  day: number;
  isCurrentMonth: boolean;
  highlight: boolean;
  examClasses: string[];
};

export default function CalendarMenu({ isOpened, onToggle }: Props) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const { showAlert } = useAlert();

  const { classes, isLoading, isError } = useClassesList();

  const cellsData = useMemo(() => {
    if (!classes) return [];

    // {day: [examName1, examName2]}
    const examsOnDays: Record<number, string[]> = {};

    classes.forEach((item) => {
      const examDate = dayjs(item.examDate);

      if (examDate.isSame(currentMonth, 'month')) {
        const dayNumber = examDate.date();

        if (!examsOnDays[dayNumber]) {
          examsOnDays[dayNumber] = [];
        }
        examsOnDays[dayNumber].push(item.name);
      }
    });

    // data for grid render
    const data: CellType[] = [];

    const firstDayOfMonth = currentMonth.date(1).day();
    const firstDayAdjusted = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;
    const daysInMonth = currentMonth.daysInMonth();

    for (let i = 2 - firstDayAdjusted; data.length < 42; i++) {
      const isDayInCurrentMonth = i > 0 && i <= daysInMonth;

      if (isDayInCurrentMonth) {
        const examsForThisDay = examsOnDays[i] || [];

        data.push({
          day: i,
          isCurrentMonth: true,
          highlight: examsForThisDay.length > 0,
          examClasses: examsForThisDay,
        });
      } else {
        data.push({
          day: -1,
          isCurrentMonth: false,
          highlight: false,
          examClasses: [],
        });
      }
    }

    return data;
  }, [currentMonth, classes]);


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
              {currentMonth.format('MMMM YYYY')}
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
            {!isError && !isLoading && cellsData.map((cell, index) => {

              let setOfClassNames = "calendar__day-cell";
              if (!cell.isCurrentMonth) setOfClassNames += " calendar__day-cell--inactive";
              if (cell.highlight) setOfClassNames += " calendar__day-cell--highlighted";

              return (
                <div
                  className={setOfClassNames}
                  key={index}
                  onClick={() => {
                    if (cell.highlight && cell.examClasses.length > 0) {
                      showAlert('Assigned exams: ' + cell.examClasses.join(', '));
                    }
                  }}
                >
                  {cell.isCurrentMonth ? cell.day : ''}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="calendar-menu__trigger" onClick={onToggle}>
        <Image src="icons/calendar.svg" className="calendar-menu__calendar-icon" alt="Calendar" width={100} height={100} draggable={false}/>
      </div>
    </aside>
  )
}
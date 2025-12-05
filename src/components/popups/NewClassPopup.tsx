'use client'

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function NewClassPopup() {
  const [chosenDate, setChosenDate] = useState<Date | null>(null);

  return (
    <div className="new-class">
      <input className="new-class__field" type="text" placeholder="Class name"/>
      <DatePicker
        className="new-class__field"
        selected={chosenDate}
        dateFormat="dd.MM.yyyy"
        onChange={(date) => setChosenDate(date)}
        placeholderText="Exam date"
        onKeyDown={(e) => e.preventDefault()}
      />
      <input className="new-class__field" type="text" placeholder="Location (e.g. Room 235)"/>
      <button className="new-class__button">
        Create
      </button>
    </div>
  )
}
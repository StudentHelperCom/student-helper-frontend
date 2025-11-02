'use client'

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function NewClassPopup() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  return (
    <div className="new-class">
      <input className="new-class__field" type="text" placeholder="Class name"/>
      <DatePicker
        className="new-class__field"
        selected={startDate}
        dateFormat="dd.MM.yyyy"
        onChange={(date) => setStartDate(date)}
      />
      <button className="new-class__button">
        Create
      </button>
    </div>
  )
}
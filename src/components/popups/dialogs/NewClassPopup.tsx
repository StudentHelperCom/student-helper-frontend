'use client'

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNewClass } from "@src/hooks/useNewClass";
import { useAlert } from "@components/contexts/AlertDialogContext";
import { useSession } from "next-auth/react";
import { useClassesList } from "@src/hooks/useClassesList";
import { usePopupManager } from "@components/contexts/PopupManagerContext";

export default function NewClassPopup() {
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [classData, setClassData] = useState({
    className: '',
    examLocation: '',
  });

  const { closePopup } = usePopupManager();

  const { createNewClass, isLoading } = useNewClass();
  const { showAlert } = useAlert();
  const { data: session } = useSession();

  const { refreshClasses } = useClassesList();

  const onSubmit = () => {
    const isValid = Object.values(classData).every(value => value.trim().length > 0);

    if (!isValid || dateTime === null) {
      showAlert('The fields were filled out incorrectly. Please check the entered data.',);
      return;
    }

    if (!session?.user.backendToken) {
      showAlert('Authorization error');
      return;
    }

    createNewClass(
      {
        ...classData,
        examDate: dateTime.toISOString(),
      },
      {
        onSuccess: () => {
          showAlert('Successfully created class!');
          refreshClasses();
          closePopup();
        },
        onError: (error) => {
          console.error(error);
          showAlert('Failed to create new class. Please try again.');
        }
      }
    );
  };

  return (
    <div className="new-class">
      <input
        className="new-class__field"
        type="text"
        placeholder="Class name"
        value={classData.className}
        maxLength={100}
        onChange={(e) =>
          setClassData({
            ...classData, className: e.target.value
          })}
      />

      <DatePicker
        selected={dateTime}
        dateFormat="dd.MM.yyyy HH:mm"
        onChange={(date) => setDateTime(date)}
        minDate={new Date()}
        showTimeSelect={true}
        timeFormat="HH:mm"
        timeIntervals={10}
        filterTime={(date) => {
          const isToday = new Date().getDate() === date.getDate() &&
            new Date().getMonth() === date.getMonth() &&
            new Date().getFullYear() === date.getFullYear();

          return isToday ? date > new Date() : true;
        }}
        className="new-class__field"
        placeholderText="Exam date"
        onKeyDown={(e) => e.preventDefault()}
      />

      <input
        className="new-class__field"
        type="text"
        placeholder="Location (e.g. Room 235)"
        value={classData.examLocation}
        maxLength={100}
        onChange={(e) =>
          setClassData({
            ...classData, examLocation: e.target.value
          })}
      />

      <button
        className="new-class__button"
        onClick={onSubmit}
        disabled={isLoading}
        style={{ opacity: isLoading ? 0.7 : 1 }}
      >
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </div>
  )
}
'use client'

import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useNewClass} from "@src/hooks/useNewClass";
import {NewClassPayload} from "@src/types/api-requests.types";
import {useAlert} from "@components/contexts/AlertDialogContext";
import {useLoader} from "@components/contexts/LoaderContext";
import {useSession} from "next-auth/react";
import {useClassesList} from "@src/hooks/useClassesList";
import {usePopupManager} from "@components/contexts/PopupManagerContext";

interface Props {
  closeMenu: () => void;
}

export default function NewClassPopup({closeMenu}: Props) {
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [classData, setClassData] = useState({
    className: '',
    examLocation: '',
  });
  const {closePopup} = usePopupManager();
  const {createNewClass} = useNewClass();
  const {showAlert} = useAlert();
  const { data: session } = useSession();
  const {refreshClasses} = useClassesList(session?.user.backendToken);
  const {setLoaderStatus} = useLoader();

  const onSubmit = async () => {
    const isValid = Object.values(classData).every(value => value.trim().length > 0);

    if (!isValid || dateTime === null) {
      showAlert('The fields were filled out incorrectly. Please check the entered data.', false);
      return;
    }

    setLoaderStatus(true);

    const {response, message} = await createNewClass({
      ...classData,
      examDate: dateTime?.toISOString(),
      token: session?.user.backendToken,
    } as NewClassPayload);

    showAlert(message, !response);
    refreshClasses();

    setLoaderStatus(false);
    closePopup();
    closeMenu();
  }

  return (
    <div className="new-class">
      <input
        className="new-class__field"
        type="text"
        placeholder="Class name"
        onChange={(e) =>
          setClassData({
            ...classData, className: e.target.value
          })}
      />
      <DatePicker
        // date
        selected={dateTime}
        dateFormat="dd.MM.yyyy HH:mm"
        onChange={(date) => setDateTime(date)}
        minDate={new Date()}
        // time
        showTimeSelect={true}
        timeFormat="HH:mm"
        timeIntervals={10}
        filterTime={(date) => {
          const isToday = new Date().getDate() === date.getDate() &&
            new Date().getMonth() === date.getMonth() &&
            new Date().getFullYear() === date.getFullYear();

          return isToday ? date > new Date() : true;
        }}
        // other
        className="new-class__field"
        placeholderText="Exam date"
        onKeyDown={(e) => e.preventDefault()}
      />
      <input
        className="new-class__field"
        type="text"
        placeholder="Location (e.g. Room 235)"
        onChange={(e) =>
          setClassData({
            ...classData, examLocation: e.target.value
          })}
      />
      <button className="new-class__button" onClick={onSubmit}>
        Create
      </button>
    </div>
  )
}
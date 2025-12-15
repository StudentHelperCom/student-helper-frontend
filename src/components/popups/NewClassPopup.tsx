'use client'

import React, {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useNewClass} from "@src/hooks/useNewClass";
import {NewClassPayload} from "@src/types/api-requests.types";
import {useAlert} from "@components/contexts/AlertDialogContext";
import {useLoader} from "@components/contexts/LoaderContext";
import {useSession} from "next-auth/react";

export default function NewClassPopup() {
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [classData, setClassData] = useState({
    className: '',
    examLocation: '',
  });
  const {createNewClass} = useNewClass();
  const {showAlert} = useAlert();
  const { data: session } = useSession();
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

    if (!response) {
      showAlert(message, false);
    } else {
      showAlert(message, true);
    }

    setLoaderStatus(false);
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
        // time
        showTimeSelect={true}
        timeFormat="HH:mm"
        timeIntervals={10}
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
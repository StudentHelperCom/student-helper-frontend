'use client'

import React, {ReactNode} from "react";
import ClassesMenu from "@components/ClassesMenu";
import CalendarMenu from "@components/CalendarMenu";
import PopupWrapper from "@components/popups/PopupWrapper";
import AddSourcesPopup from "@components/popups/AddSourcePopup";
import TopicsListPopup from "@components/popups/TopicsListPopup";
import NewClassPopup from "@components/popups/NewClassPopup";
import {usePopupManager} from "@components/contexts/PopupManagerContext";

export default function AppShell({children}: {children: ReactNode}) {
  const {activePopup, openPopup, closePopup} = usePopupManager()

  return (
    <>
      {children}

      <ClassesMenu />
      <CalendarMenu />

      <PopupWrapper title="Add Sources" isOpened={activePopup === "add"} closeAction={closePopup}>
        <AddSourcesPopup  />
      </PopupWrapper>

      <PopupWrapper title="List of Topics" isOpened={activePopup === "topics"} closeAction={closePopup}>
        <TopicsListPopup topics={[
          "Fajny topic dla nauki",
          "Ekstra topic tez fajny",
          "A ten to jest sigma++",
          "Fajny topic dla nauki",
          "Ekstra topic tez fajny",
          "A ten to jest sigma++",
        ]} />
      </PopupWrapper>

      <PopupWrapper title="New Class" isOpened={activePopup === "newClass"} closeAction={closePopup}>
        <NewClassPopup />
      </PopupWrapper>
    </>
  )
}
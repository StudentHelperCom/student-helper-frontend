'use client'

import React, {ReactNode, useState} from "react";
import ClassesMenu from "@components/ClassesMenu";
import CalendarMenu from "@components/CalendarMenu";
import PopupWrapper from "@components/popups/PopupWrapper";
import AddSourcesPopup from "@components/popups/dialogs/AddSourcePopup";
import TopicsListPopup, {availableModes} from "@components/popups/dialogs/TopicsListPopup";
import NewClassPopup from "@components/popups/dialogs/NewClassPopup";
import {usePopupManager} from "@components/contexts/PopupManagerContext";
import QuizMode from "@components/popups/modes/QuizMode";
import {QuizModeType} from "@src/types/api-requests.types";

type ActiveMenu = 'classes' | 'calendar' | null;

export default function AppShell({children}: { children: ReactNode }) {
  const {activePopup, closePopup, popupData} = usePopupManager()
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);

  const toggleMenu = (menu: ActiveMenu) => {
    setActiveMenu(prev => prev === menu ? null : menu);
  };

  return (
    <>
      {children}

      <ClassesMenu
        isOpened={activeMenu === 'classes'}
        onToggle={() => toggleMenu('classes')}
      />
      <CalendarMenu
        isOpened={activeMenu === 'calendar'}
        onToggle={() => toggleMenu('calendar')}
      />

      <PopupWrapper title="Add Sources" isOpened={activePopup === "Add"} closeAction={closePopup}>
        <AddSourcesPopup/>
      </PopupWrapper>

      <PopupWrapper title="List of Topics" isOpened={activePopup === "Topics"} closeAction={closePopup}>
        <TopicsListPopup
          currentMode={popupData as availableModes}
        />
      </PopupWrapper>

      <PopupWrapper title="New Class" isOpened={activePopup === "NewClass"} closeAction={closePopup}>
        <NewClassPopup/>
      </PopupWrapper>

      <PopupWrapper title="Test" isOpened={activePopup === 'Quiz'} closeAction={closePopup}>
        <QuizMode tasksData={popupData as QuizModeType}/>
      </PopupWrapper>
    </>
  )
}
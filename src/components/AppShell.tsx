'use client'

import React, {ReactNode, useState} from "react";
import ClassesMenu from "@components/ClassesMenu";
import CalendarMenu from "@components/CalendarMenu";
import PopupWrapper from "@components/popups/PopupWrapper";
import AddSourcesPopup from "@components/popups/AddSourcePopup";
import TopicsListPopup from "@components/popups/TopicsListPopup";
import NewClassPopup from "@components/popups/NewClassPopup";
import {usePopupManager} from "@components/contexts/PopupManagerContext";
import {SessionProvider} from "next-auth/react";
import {LoaderProvider} from "@components/contexts/LoaderContext";
import ContextWrapper from "@components/contexts/ContextWrapper";
import AlertDialog from "@components/popups/AlertDialog";
import {QueryClient} from "@tanstack/query-core";

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

      <PopupWrapper title="Add Sources" isOpened={activePopup === "add"} closeAction={closePopup}>
        <AddSourcesPopup/>
      </PopupWrapper>

      <PopupWrapper title="List of Topics" isOpened={activePopup === "topics"} closeAction={closePopup}>
        <TopicsListPopup
          currentMode={popupData as string}
        />
      </PopupWrapper>

      <PopupWrapper title="New Class" isOpened={activePopup === "newClass"} closeAction={closePopup}>
        <NewClassPopup/>
      </PopupWrapper>
    </>
  )
}
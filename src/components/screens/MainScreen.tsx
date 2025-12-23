'use client'

import Image from "next/image"
import React, {useEffect} from "react";
import {useLoader} from "@components/contexts/LoaderContext";
import {usePopupManager} from "@components/contexts/PopupManagerContext";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useClassManager} from "@components/contexts/ClassManagerContext";
import {availableModes, availableModesNames} from "@components/popups/dialogs/TopicsListPopup";
import {useTopicsList} from "@src/hooks/useTopicsList";
import {useAlert} from "@components/contexts/AlertDialogContext";

export default function MainScreen() {
  const {openPopup} = usePopupManager();
  const {setLoaderStatus: setLoaderOpened} = useLoader();
  const {showAlert} = useAlert();

  const {data: session, status} = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth');
    }
  });
  const router = useRouter();
  const {selectedClass} = useClassManager();
  const {refreshTopics} = useTopicsList(session?.user.backendToken || null, selectedClass?.id || null);

  useEffect(() => {
    setLoaderOpened(status === 'loading');
  }, [status, setLoaderOpened]);

  return (
    <>
      <main className="main">
        <header className="header">
          <div className="header__user">
            <Image src="/icons/user.svg" className="header__user-icon" alt="Logout" width={100} height={100}
                   draggable={false}/>
            <span className="leading-[115%]">
              <span className="header__user-prefix">Welcome back,</span>
              <br/>
              <span className="header__user-name">{session?.user.login}</span>
            </span>
          </div>
          <button onClick={() => signOut()}>
            <Image src="/icons/logout.svg" className="header__logout" alt="Logout" width={100} height={100}
                   draggable={false}/>
          </button>
        </header>
        <div className="main__side">
          <span className="main__title">
            {selectedClass?.name || 'Choose a class'}
          </span>
          <div className="main__doc-preview">
          </div>
          <div className="main__manage-options">
            <button className="main__single-option" onClick={() => {
              if (selectedClass?.name) {
                openPopup("add");
              } else {
                showAlert('First select a class', true);
              }
            }}>
              <Image src="/icons/add.svg" className="main__option-icon" alt="Add" width={100} height={100}
                     draggable={false}/>
            </button>
            <button className="main__single-option">
              <Image src="/icons/download.svg" className="main__option-icon" alt="Add" width={100} height={100}
                     draggable={false}/>
            </button>
          </div>
        </div>
        <div className="main__side">
          <span className="main__title">
            Choose mode
          </span>
          <ul className="main__modes-list">
            {availableModesNames.map((modeName, index) => {
              return (
                <li key={index}>
                  <button className="main__single-mode" onClick={() => {
                    if (selectedClass?.name) {
                      openPopup("topics", availableModes[index]);
                      refreshTopics();
                    } else {
                      showAlert('First select a class', true);
                    }
                  }}>
                    {modeName}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </main>
    </>
  )
}
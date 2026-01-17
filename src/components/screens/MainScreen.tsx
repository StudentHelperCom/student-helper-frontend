'use client'

import Image from "next/image"
import React, {useEffect} from "react";
import {usePopupManager} from "@components/contexts/PopupManagerContext";
import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useClassManager} from "@components/contexts/ClassManagerContext";
import {availableModes} from "@components/popups/dialogs/TopicsListPopup";
import {useTopicsList} from "@src/hooks/useTopicsList";
import {useAlert} from "@components/contexts/AlertDialogContext";
import {useFilesList} from "@src/hooks/useFilesList";
import {FileItem} from "@src/types/api-requests.types";
import {useProcessStatus} from "@src/hooks/useProcessingStatus";

export default function MainScreen() {
  const {openPopup} = usePopupManager();
  const {showAlert} = useAlert();

  const {data: session} = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth');
    }
  });
  const router = useRouter();
  const {selectedClass} = useClassManager();
  const {refreshTopics} = useTopicsList(selectedClass?.classID || null);
  const {files, isLoading, isError} = useFilesList(selectedClass?.classID || null);
  const filesList = Array.isArray(files) ? files : (files)?.files || [];

  const { currentStatus } = useProcessStatus(selectedClass?.classID || null);
  const displayStatus = {
    text: '',
    color: '',
  };
  switch (currentStatus) {
    case 'processing':
      displayStatus.text = 'In progress...';
      displayStatus.color = '#f1b534';
      break;
    case 'success':
      displayStatus.text = 'Finished successfully';
      displayStatus.color = '#465acf';
      break;
    case 'failed':
      displayStatus.text = 'Processing failed';
      displayStatus.color = '#F53838';
      break;
    case undefined:
      displayStatus.text = 'Idle 💤';
      displayStatus.color = '#CCCCCC';
      break;
    default:
      displayStatus.text = 'Error';
      displayStatus.color = 'red';
  }

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
          <div className="flex flex-col items-center leading-[115%]">
            <span className="text-[0.75rem] opacity-70">Processing status:</span>
            <span
              className='font-bold'
              style={{ color: displayStatus.color }}
            >{displayStatus.text}</span>
          </div>
          <button className="justify-self-end" onClick={() => signOut()}>
            <Image src="/icons/logout.svg" className="header__logout" alt="Logout" width={100} height={100}
                   draggable={false}/>
          </button>
        </header>
        <div className="main__side">
          <span className="main__title">
            {selectedClass?.name || 'Choose a class'}
          </span>
          {!isLoading && !isError && (
            <ul className="main__uploads-preview">
              {filesList.length > 0 ? (
                filesList.map((item: FileItem, index: number) => (
                  <li className="main__uploads-item" key={index}>
                      <span className="main__uploads-name" title={item.filename}>
                        {item.filename || item.filename}
                      </span>
                    <span className="text-xs text-gray-400">
                        {Math.ceil((item.size || 0) / 1024)} KB
                      </span>
                    <span className="text-xs text-gray-400">
                        {item.created
                          ? new Date(item.created).toLocaleDateString('pl-PL', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '-'
                        }
                      </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm p-4 text-center">
                  No files uploaded yet.
                </li>
              )}
            </ul>
          )}
          <div className="main__manage-options">
            <button className="main__single-option" onClick={() => {
              if (selectedClass?.name) {
                openPopup("Add");
              } else {
                showAlert('First select a class');
              }
            }}>
              <Image src="/icons/add.svg" className="main__option-icon" alt="Add" width={100} height={100}
                     draggable={false}/>
            </button>
          </div>
        </div>
        <div className="main__side">
          <span className="main__title">
            Modes
          </span>
          <ul className="main__modes-list">
            {Object.entries(availableModes).map(([mode, modeName], index) => {
              return (
                <li key={index}>
                  <button
                    className="main__single-mode"
                    onClick={() => {
                      if (selectedClass?.name) {
                        openPopup("Topics", mode);
                        refreshTopics();
                      } else {
                        showAlert('First select a class');
                      }
                    }}
                  >
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
'use client'

import Image from "next/image";
import React, {useEffect} from "react";
import {usePopupManager} from "@components/contexts/PopupManagerContext";
import {useSession} from "next-auth/react";
import {useClassesList} from "@src/hooks/useClassesList";
import {useClassManager} from "@components/contexts/ClassManagerContext";
import {useAlert} from "@components/contexts/AlertDialogContext";

interface Props {
  isOpened: boolean;
  onToggle: () => void;
}

export default function ClassesMenu({ isOpened, onToggle }: Props) {
  const {openPopup} = usePopupManager();
  const {data: session} = useSession();
  const {classes, isLoading, isError} = useClassesList(session?.user.backendToken);
  const {setClass} = useClassManager();

  return (
    <aside className={"classes" + (isOpened ? " classes--opened" : "")}>
      <div className="classes__content">
        <span className="classes__title">
        Classes
        </span>
        <ul className="classes__list">

          {!isError && !isLoading && classes?.map((item, index) => (
            <li
              className="classes-item"
              key={index}
              onClick={() => {
                setClass({
                  name: item.name,
                  classID: item.classID,
                });
                onToggle();
              }}
            >
              <div className="flex justify-between">
                <span className="classes-item__name">{item.name}</span>
                <button className="classes-item__delete-button">
                  <Image src="icons/close.svg" className="classes-item__delete-icon" alt="Close" width={30} height={30} draggable={false} />
                </button>
              </div>
              <div className="flex justify-between items-end">
                <span className="classes-item__exam">
                  {new Date(item.examDate).toLocaleDateString(
                    'pl-PL',
                    { day: '2-digit', month: 'short', year: 'numeric'}
                  )}
                </span>
                <div className="flex flex-col">
                  <span className="classes-item__info">Location: <b>{item.examLocation}</b></span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button className="classes__add-button" onClick={() => openPopup('NewClass')}>
          <Image src="icons/add.svg" className="classes__add-icon" alt="Add" width={100} height={100} draggable={false} />
        </button>
      </div>
      <div className="classes__trigger" onClick={onToggle}>
        <Image src="icons/menu.svg" className="classes__menu-icon" alt="Classes" width={100} height={100} draggable={false} />
      </div>
    </aside>
  )
}
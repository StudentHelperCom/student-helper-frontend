'use client'

import Image from "next/image";
import React from "react";

interface Props {
  isOpened: boolean;
  onToggle: () => void;
}

export default function ClassesMenu({ isOpened, onToggle }: Props) {

  return (
    <aside className={"classes" + (isOpened ? " classes--opened" : "")}>
      <div className="classes__content">
        <span className="classes__title">
        Classes
      </span>
        <ul className="classes__list">
          <li className="classes-item">
            <div className="flex justify-between">
              <span className="classes-item__name">wdm</span>
              <button className="classes-item__delete-button">
                <Image src="icons/close.svg" className="classes-item__delete-icon" alt="Close" width={30} height={30} draggable={false} />
              </button>
            </div>
            <div className="flex justify-between items-end">
              <span className="classes-item__exam">21.07</span>
              <div className="flex flex-col">
                <span className="classes-item__info">Created: 03.05</span>
                <span className="classes-item__info">Modified: 19.06</span>
              </div>
            </div>
          </li>
          <li className="classes-item">
            <div className="flex justify-between">
              <span className="classes-item__name">bst</span>
              <button className="classes-item__delete-button">
                <Image src="icons/close.svg" className="classes-item__delete-icon" alt="Close" width={30} height={30} draggable={false} />
              </button>
            </div>
            <div className="flex justify-between items-end">
              <span className="classes-item__exam">25.07</span>
              <div className="flex flex-col">
                <span className="classes-item__info">Created: 15.05</span>
                <span className="classes-item__info">Modified: 23.06</span>
              </div>
            </div>
          </li>
        </ul>
        <button className="classes__add-button">
          <Image src="icons/add.svg" className="classes__add-icon" alt="Add" width={100} height={100} draggable={false} />
        </button>
      </div>
      <div className="classes__trigger" onClick={onToggle}>
        <Image src="icons/menu.svg" className="classes__menu-icon" alt="Classes" width={100} height={100} draggable={false} />
      </div>
    </aside>
  )
}
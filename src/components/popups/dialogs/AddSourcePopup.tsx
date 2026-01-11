'use client'

import React, { useState } from "react";
import { useUpload } from "@src/hooks/useUpload"; // Upewnij się, że importujesz nowy hook
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useAlert } from "@components/contexts/AlertDialogContext";
import { useClassManager } from "@components/contexts/ClassManagerContext";

export default function AddSourcePopup() {
  const { upload, isLoading } = useUpload();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { data: session } = useSession();
  const { showAlert } = useAlert();
  const { selectedClass } = useClassManager();

  const validateFiles = (filesArray: Array<File>) => {
    return filesArray.every((file) => {
      const name = file.name.toLowerCase();
      return name.endsWith('.pdf') || name.endsWith('.txt');
    });
  }

  const removeFile = (index: number) => {
    const newArray = [...selectedFiles];
    newArray.splice(index, 1);
    setSelectedFiles(newArray);
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(selectedFiles.concat(Array.from(e.target.files)));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    if (!selectedFiles.length) {
      showAlert('No file selected', true);
      return;
    }

    if (!validateFiles(selectedFiles)) {
      showAlert('Incorrect files extensions. Only .pdf and .txt are allowed!', true);
      return;
    }

    if (!session?.user.backendToken) {
      showAlert('You are not authorized', true);
      return;
    }

    upload(
      {
        files: selectedFiles,
        className: selectedClass?.name || '',
        token: session.user.backendToken,
      },
      {
        onSuccess: () => {
          showAlert('The files have been sent. Give us some time (may take 2-5 min), then check topics list. 😉', false);
          setSelectedFiles([]);
        },
        onError: (error) => {
          console.error('Error while uploading files', error);
          showAlert('Error while uploading file. Please try again.', true);
        }
      }
    );
  };

  return (
    <div className="add-sources">
      <ul className="add-sources__file-list">
        {selectedFiles.map((item, index) => (
          <li className="add-sources__file" key={index}>
            <span className="add-sources__file-name">{item.name}</span>
            <button className="add-sources__delete-button" type="button" onClick={() => removeFile(index)}>
              <Image src="icons/close.svg" alt="Delete" width={20} height={20}/>
            </button>
          </li>
        ))}
        {!selectedFiles.length && ("Files not chosen")}
      </ul>

      <input
        className="hidden"
        type="file"
        id="upload-files"
        onChange={onFileChange}
        multiple={true}
        accept=".pdf,.txt"
      />

      <label className="add-sources__button" htmlFor="upload-files">
        Add New Files
      </label>

      <button
        className="add-sources__button"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : 'Submit'}
      </button>
    </div>
  )
}
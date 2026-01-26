'use client'

import React, { useState} from "react";
import { useUpload } from "@src/hooks/useUpload";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useAlert } from "@components/contexts/AlertDialogContext";
import { useClassManager } from "@components/contexts/ClassManagerContext";
import {useProcessStatus} from "@src/hooks/useProcessingStatus";

export default function AddSourcePopup() {
  const { upload, isLoading } = useUpload();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { data: session } = useSession();
  const { showAlert } = useAlert();
  const { selectedClass } = useClassManager();
  const { startPolling } = useProcessStatus(selectedClass?.classID || null);
  
  const validateFiles = (filesArray: Array<File>) => {
    return filesArray.every((file) => {
      const name = file.name.toLowerCase();
      const sumOfSizes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
      return (name.endsWith('.pdf') || name.endsWith('.txt')) // limit of formats
        && sumOfSizes < 20 * Math.pow(2, 20); // 10 * 2 ^ 20 = 20MB
    }) && filesArray.length <= 5; // limit of files
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

  const onSubmit = () => {
    if (!selectedFiles.length) {
      showAlert('No file selected');
      return;
    }

    if (!validateFiles(selectedFiles)) {
      showAlert('Check your selection. Requirements: (1) .pdf/.txt files; (2) maximum number of files: 5; (3) maximum total size: 20MB');
      return;
    }

    if (!session?.user.backendToken) {
      showAlert('You are not authorized');
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
          showAlert('The files have been sent. Give us some time (may take 1-4 min), then check topics list. 😉');
          setSelectedFiles([]);
          setTimeout(()=> {
            startPolling();
          }, 500)
        },
        onError: (error) => {
          console.error('Error while uploading files', error);
          showAlert('Error while uploading file. Please try again.');
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
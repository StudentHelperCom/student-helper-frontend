'use client'

import {useUpload} from "@src/hooks/useUpload";
import {useState} from "react";
import {useSession} from "next-auth/react";
import {AxiosResponse} from "axios";
import {useLoaderContext} from "@components/contexts/LoaderContext";

export default function AddSourcePopup() {
  const { handleUpload } = useUpload();
  const { setter: setLoading } = useLoaderContext();
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const { data: session } = useSession();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles) return;

    setLoading(true);

    try {
      const response:AxiosResponse | undefined = await handleUpload({
        files: selectedFiles,
        className: "max_superclass",
        token: session?.user.backendToken
      });

      if(response && response.status === 201) {
        alert('SUCCESS');
      } else {
        throw new Error('Bad status');
      }
    } catch (err) {
      console.error('Error while uploading files', err);
      alert('Error while uploading file');
    }

    setLoading(false);
    setSelectedFiles(null);
  };

  return (
    <div className="add-sources">
      <span className="add-sources__file-list">
        {selectedFiles?.map(
          (item, index) =>
            <span className="add-sources__file-name" key={index}>{item.name}</span>)
          || "Files are not chosen"}
      </span>
      <input className="hidden" type="file" id="upload-files" onChange={onFileChange} multiple={true}/>
      <label className="add-sources__button" htmlFor="upload-files">
        Open File Explorer
      </label>
      <button className="add-sources__button" onClick={onSubmit}>
        Submit
      </button>
    </div>
  )
}
import {useUpload} from "@src/hooks/useCdn";
import {useEffect, useState} from "react";

export default function AddSourcePopup() {
  const { handleUpload, status, error } = useUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    await handleUpload(selectedFile);
  };

  useEffect(() => {
    console.log("status: ", status);
    console.log("error: ", error);
  }, [handleUpload, status, error]);

  useEffect(() => {
    console.log("selectedFile: ", selectedFile);
  }, [selectedFile]);

  return (
    <div className="add-sources">
      <span>
        {selectedFile?.name || "File is not chosen"}
      </span>
      <input className="hidden" type="file" id="upload-files" onChange={onFileChange} />
      <label className="add-sources__button" htmlFor="upload-files">
        Open File Explorer
      </label>
      <button className="add-sources__button" onClick={onSubmit}>
        Submit
      </button>
    </div>
  )
}
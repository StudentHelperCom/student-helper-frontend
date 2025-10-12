export default function AddSourcePopup() {
  return (
    <div className="add-sources">
      <input className="hidden" type="file" id="upload-files"/>
      <label className="add-sources__button" htmlFor="upload-files">
        Open File Explorer
      </label>
      <button className="add-sources__button">
        Submit
      </button>
    </div>
  )
}
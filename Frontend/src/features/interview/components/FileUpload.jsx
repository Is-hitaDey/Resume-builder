import React from 'react'
import '../style/file-upload.scss'

const FileUpload = ({ onFileSelect, fileName }) => {
  return (
    <div className="file-upload-container">
      <div className="upload-area">
        <div className="upload-icon">☁️</div>
        <h3 className="upload-title">Click or drag to upload</h3>
        <p className="upload-subtitle">PDF, DOCX up to 10MB</p>
        <input
          type="file"
          id="resume-upload"
          className="file-input"
          accept=".pdf,.docx"
          onChange={(e) => onFileSelect(e.target.files[0])}
          hidden
        />
        <label htmlFor="resume-upload" className="upload-label">
          Choose File
        </label>
      </div>
      {fileName && <p className="file-name">{fileName}</p>}
    </div>
  )
}

export default FileUpload

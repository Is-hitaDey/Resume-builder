import React, { useState } from 'react'
import '../style/home.scss'

const Home = () => {
  const [fileName, setFileName] = useState('')
  const [wordCount, setWordCount] = useState(0)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const handleSelfDescriptionChange = (e) => {
    const text = e.target.value
    setWordCount(text.split(/\s+/).filter(word => word.length > 0).length)
  }

  return (
    <main className="home">
      {/* Header Section */}
      <header className="home-header">
        <h1 className="page-title">Interview Preparation</h1>
        <p className="page-subtitle">Upload your details to generate personalized AI interview questions based on your unique profile and target role.</p>
      </header>

      {/* Main Content */}
      <div className="home-content">
        <div className="content-wrapper">
          {/* Left Section - Job Description */}
          <section className="input-section left-section">
            <div className="section-header">
              <span className="section-icon">📋</span>
              <h2 className="section-title">Job Description</h2>
            </div>
            <textarea
              className="input-textarea"
              placeholder="Paste the job description here..."
            />
          </section>

          {/* Right Section - Resume and Self Description */}
          <section className="input-section right-section">
            {/* Resume Upload */}
            <div className="resume-section">
              <div className="section-header">
                <span className="section-icon">📄</span>
                <h2 className="section-title">Resume</h2>
                <span className="required-badge">Required</span>
              </div>
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
                    onChange={handleFileSelect}
                    hidden
                  />
                  <label htmlFor="resume-upload" className="upload-label">
                    Choose File
                  </label>
                </div>
                {fileName && <p className="file-name">{fileName}</p>}
              </div>
            </div>

            {/* Self Description */}
            <div className="description-section">
              <div className="section-header">
                <span className="section-icon">👤</span>
                <h2 className="section-title">Self Description</h2>
              </div>
              <textarea
                className="input-textarea self-description"
                placeholder="Tell us about your background and experience..."
                onChange={handleSelfDescriptionChange}
              />
              <div className="word-counter">
                <span className="word-text">{wordCount} / 500 words</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(wordCount / 500) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button className="generate-btn">
              Generate Interview Questions <span className="arrow">→</span>
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Home

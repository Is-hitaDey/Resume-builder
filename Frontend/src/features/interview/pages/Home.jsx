import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import WordCounter from '../components/WordCounter'
import FileUpload from '../components/FileUpload'
import '../style/home.scss'

const Home = () => {
  const [fileName, setFileName] = useState('')

  const handleFileSelect = (file) => {
    if (file) {
      setFileName(file.name)
    }
  }

  return (
    <div className="home-layout">
      <Sidebar />
      
      <main className="home-main">
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
                rows="15"
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
                <FileUpload onFileSelect={handleFileSelect} fileName={fileName} />
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
                  rows="8"
                />
                <WordCounter currentWords={0} maxWords={500} />
              </div>

              {/* Generate Button */}
              <button className="generate-btn">
                Generate Interview Questions <span className="arrow">→</span>
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

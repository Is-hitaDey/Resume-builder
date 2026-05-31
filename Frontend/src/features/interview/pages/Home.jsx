import React, { useState,useRef } from 'react'
import '../style/home.scss'
import {useInterview} from "../hooks/useInterview.js"
import { useNavigate } from 'react-router'

const Home = () => {

  const {loading,generateReport} = useInterview()
  const [fileName, setFileName] = useState('')

  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const resumeInputRef = useRef()

  const navigate=useNavigate()

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]
    const data= await generateReport({resumeFile, selfDescription, jobDescription})
    navigate(`/interview/${data._id}`)
  }

  

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
    }
  }

  if (loading){
    return(
      <main className="home loading-state">
        <h1>Loading your interview plan...</h1>
      </main>
    )
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
            onChange={(e)=> {setJobDescription(e.target.value)}}
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
                    ref={resumeInputRef}
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
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            {/* Generate Button */}
            <button 
            onClick={handleGenerateReport}
            className="generate-btn">
              Generate Interview Questions <span className="arrow">→</span>
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Home

const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")

async function generateInterviewReportController(req,res){
    const resumeFile = req.file
    const resumeContent= await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText()
    const {selfDescription, jobDescription}= req.body
    const interviewReportModel = require("../models/interviewReport.model")

    const interviewReportByAi= await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}

module.exports={generateInterviewReportController}

const express=require ("express")
const authMiddleware= require("../middlewares/auth.middleware")
const interviewController= require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

const interviewRouter= express.Router()

/**
 * @route POST /api/interview
 * @desc Generate new interview report on the basis of user self description, resume pdf and job description
 * @access Private
 */
interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

/**
 * @route GET /api/interview/:interviewId
 * @desc Get interview report by interviewId
 * @access Private
 */
interviewRouter.get("/:interviewId",authMiddleware.authUser,interviewController.getInterviewReportController)
 
/**
 * @route POST /api/interview
 * @description get all interview reports of logged in user
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser,interviewController.getAllInterviewReportsController)

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf on the basis of user self description, resume and job description
 * @access Private
 */
 interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)



module.exports=interviewRouter
import {getAllInterviewReports, generateInterviewReport, getInterviewReportById} from "../services/interview.api"
import {useContext} from "react"
import {interviewContext} from "../interview.context"

export const useInterview=()=>{

    const context = useContext(interviewContext)

    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {loading,setLoading,report,setReport,reports,setReports} = context

    const generateReport=async({resumeFile, selfDescription, jobDescription})=>{
        setLoading(true)
        let response=null
        try{
            response = await generateInterviewReport({resumeFile, selfDescription, jobDescription})
            setReport(response.interviewReport)
        } catch (error) {
            console.log("Error generating interview report:", error)
        } finally {
            setLoading(false)
        }

        return response.interviewReport

    }

    const getReportById=async(interviewId)=>{
        setLoading(true)
        let response=null
        try{
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log("Error fetching interview report:", error)
        } finally {
            setLoading(false)
        } 

        return response.interviewReport
    }  

    const getReports=async()=>{
        setLoading(true)   
        response=null 
        try{
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        }
        catch (error) {
            console.log("Error fetching interview reports:", error)
        } finally {
            setLoading(false)
        }
        return response.interviewReports
    }

    return {
        loading, report, reports, generateReport, getReportById, getReports}
}
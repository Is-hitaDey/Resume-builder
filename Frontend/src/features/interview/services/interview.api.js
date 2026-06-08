import axios from "axios";

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials: true,
});

/**
 * @desc Generate new interview report on the basis of user self description, resume pdf and job description
 */
export const generateInterviewReport = async({ resumeFile, selfDescription, jobDescription }) => {

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const response=await  api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })  

    return response.data
}

/**
 * @desc Get interview report by interviewId
 */

export const getInterviewReportById = async(interviewId) => {
    const response = await api.get(`/api/interview/${interviewId}`)

    return response.data
}

/**
 * @desc get all interview reports of logged in user
 */

export const getAllInterviewReports = async() => {
    const response = await api.get("/api/interview")

    return response.data
}

/**
 * @desc Service to generate resume pdf based on user interview report and self description
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(
        `/api/interview/resume/pdf/${interviewReportId}`,
        null,
        {
            responseType: "blob"
        }
    );

    return response.data;
};
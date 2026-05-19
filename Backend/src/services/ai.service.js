const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const responseSchema = {
        type: "OBJECT",

        properties: {
            matchScore: {
                type: "NUMBER",
                description: "A score between 0 and 100 indicating how well the candidate's resume and self-description match the job description."
            },

            technicalQuestions: {
                type: "ARRAY",
                description: "Technical questions that can be asked in the interview along with their intention and how to answer them.",
                items: {
                    type: "OBJECT",
                    properties: {
                        question: {
                            type: "STRING",
                            description: "The technical question that can be asked in the interview"
                        },

                        intention: {
                            type: "STRING",
                            description: "The intention of interviewer behind asking this question"
                        },

                        answer: {
                            type: "STRING",
                            description: "How to answer this question, what points to cover, what approach to take etc."
                        }
                    },

                    required: ["question", "intention", "answer"]
                }
            },

            behavioralQuestions: {
                type: "ARRAY",
                description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them.",

                items: {
                    type: "OBJECT",

                    properties: {
                        question: {
                            type: "STRING",
                            description: "The behavioral question that can be asked in the interview"
                        },

                        intention: {
                            type: "STRING",
                            description: "The intention of interviewer behind asking this question"
                        },

                        answer: {
                            type: "STRING",
                            description: "How to answer this question, what points to cover, what approach to take etc."
                        }
                    },

                    required: ["question", "intention", "answer"]
                }
            },

            skillGaps: {
                type: "ARRAY",

                description: "The skill gaps that the candidate has with respect to the job description, along with their severity.",

                items: {
                    type: "OBJECT",

                    properties: {
                        skill: {
                            type: "STRING",
                            description: "The skill which the candidate is lacking"
                        },

                        severity: {
                            type: "STRING",
                            enum: ["low", "medium", "high"],
                            description: "The severity of the skill gap"
                        }
                    },

                    required: ["skill", "severity"]
                }
            },

            preparationPlan: {
                type: "ARRAY",

                description: "A day-wise preparation plan for the candidate to prepare for the interview.",

                items: {
                    type: "OBJECT",

                    properties: {
                        day: {
                            type: "NUMBER",
                            description: "The day number of the preparation plan"
                        },

                        focus: {
                            type: "STRING",
                            description: "The main focus of preparation for that day"
                        },

                        tasks: {
                            type: "ARRAY",

                            description: "Specific preparation tasks",

                            items: {
                                type: "STRING"
                            }
                        }
                    },

                    required: ["day", "focus", "tasks"]
                }
            }
        },

        required: [
            "matchScore",
            "technicalQuestions",
            "behavioralQuestions",
            "skillGaps",
            "preparationPlan"
        ]
    };

    const prompt = `Generate an interview report STRICTLY in the provided JSON schema format.

Rules:
- Return ONLY valid JSON
- Do NOT add extra fields
- Do NOT change field names
- Follow the schema exactly
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}`




    const response = await ai.models.
        generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema
            }

        });
    const data = JSON.parse(response.text)
    console.log(JSON.stringify(data, null, 2));
    return data;
}

module.exports = generateInterviewReport
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});


// ======================================================
// ZOD VALIDATION SCHEMA
// ======================================================

const responseZodSchema = z.object({
    matchScore: z
        .number()
        .min(0)
        .max(100),
    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),
    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum([
                "low",
                "medium",
                "high"
            ])
        })
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(
                z.string()
            )
        })
    ),
    title: z.string().describe("The title of the job for which the interview report is generated")
});


// ======================================================
// GEMINI RESPONSE SCHEMA
// ======================================================

const responseSchema = {

    type: "OBJECT",

    properties: {

        matchScore: {
            type: "NUMBER",
            description:
                "A score between 0 and 100"
        },

        technicalQuestions: {

            type: "ARRAY",

            items: {

                type: "OBJECT",

                properties: {

                    question: {
                        type: "STRING"
                    },

                    intention: {
                        type: "STRING"
                    },

                    answer: {
                        type: "STRING"
                    }

                },

                required: [
                    "question",
                    "intention",
                    "answer"
                ]

            }

        },

        behavioralQuestions: {

            type: "ARRAY",

            items: {

                type: "OBJECT",

                properties: {

                    question: {
                        type: "STRING"
                    },

                    intention: {
                        type: "STRING"
                    },

                    answer: {
                        type: "STRING"
                    }

                },

                required: [
                    "question",
                    "intention",
                    "answer"
                ]

            }

        },

        skillGaps: {

            type: "ARRAY",

            items: {

                type: "OBJECT",

                properties: {

                    skill: {
                        type: "STRING"
                    },

                    severity: {

                        type: "STRING",

                        enum: [
                            "low",
                            "medium",
                            "high"
                        ]
                    }
                },

                required: [
                    "skill",
                    "severity"
                ]

            }

        },

        preparationPlan: {

            type: "ARRAY",

            items: {

                type: "OBJECT",
                properties: {
                    day: {
                        type: "NUMBER"
                    },

                    focus: {
                        type: "STRING"
                    },

                    tasks: {

                        type: "ARRAY",

                        items: {
                            type: "STRING"
                        }

                    }

                },

                required: [
                    "day",
                    "focus",
                    "tasks"
                ]

            }

        },

        title: {
            type: "STRING",
            description:
                "The title of the job for which the interview report is generated"
        }

    },

    required: [
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan",
        "title"
    ]

};


// ======================================================
// MAIN FUNCTION
// ======================================================

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Generate an interview report STRICTLY in valid JSON format.

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT return markdown
- Do NOT use \`\`\`
- Do NOT add explanations
- Do NOT add extra fields
- Follow schema exactly
- skillGaps MUST contain:
  - skill
  - severity
- severity must ONLY be:
  - low
  - medium
  - high

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    try {

        const response =
            await ai.models.generateContent({

                model: "gemini-2.5-flash",

                contents: prompt,

                config: {

                    responseMimeType:
                        "application/json",

                    responseSchema

                }

            });

        // ============================================
        // RAW RESPONSE
        // ============================================

        const rawData =
            JSON.parse(response.text);

        // ============================================
        // OPTIONAL AUTO FIXES
        // ============================================

        // Auto-fix missing severity

        if (rawData.skillGaps) {

            rawData.skillGaps =
                rawData.skillGaps.map((item) => {

                    // if AI returns string instead of object

                    if (typeof item === "string") {

                        return {
                            skill: item,
                            severity: "medium"
                        };
                    }

                    // if severity missing

                    if (!item.severity) {

                        item.severity = "medium";
                    }

                    return item;
                });
        }

        // ============================================
        // VALIDATE USING ZOD
        // ============================================

        const validatedData =
            responseZodSchema.parse(rawData);

        console.log(
            JSON.stringify(
                validatedData,
                null,
                2
            )
        );

        return validatedData;

    } catch (error) {

        console.error(
            "AI Interview Report Generation Error:",
            error
        );

        // ============================================
        // ZOD VALIDATION ERROR
        // ============================================

        if (error.name === "ZodError") {

            console.log(error.issues);

            throw new Error(

                `Invalid AI response format:\n${JSON.stringify(
                    error.issues,
                    null,
                    2
                )}`

            );
        }

        // ============================================
        // INVALID JSON
        // ============================================

        if (error instanceof SyntaxError) {

            throw new Error(
                "AI returned invalid JSON."
            );
        }

        // ============================================
        // GENERIC ERROR
        // ============================================

        throw new Error(
            error.message ||
            "Failed to generate interview report."
        );
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", margin:{
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm"
    } });
    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    // const resumepdfSchema = z.object({
    //     html: z.string().describe("The HTML content of the resume which can be converted to PDF using a library like Puppeteer")
    // })

    const resumeResponseSchema = {
    type: "OBJECT",
    properties: {
        html: {
            type: "STRING"
        }
    },
    required: ["html"]
};

    const prompt = `
Generate a resume in HTML format based on the following information:
Resume:${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

The content of the resume should not sound like its generated by AI. It should be natural and human like. The resume should be tailored to the job description and should highlight the skills and experiences mentioned in the self description. The HTML should be well structured and formatted, ready to be converted to PDF using a library like Puppeteer. You can highlight the content using some colors or different font styles but the overall design should be simple and professional. The content should be ATS friendly i.e. it should be easily readable by Applicant Tracking Systems without losing important information.
The resume should not be so lengthy, it should ideally be 1-2 pages when converted to PDF. Focus on quality rather than quantity and make sure to include all relevant information that can increase the chances of getting an interview call for the given job description.

IMPORTANT:
- Return ONLY valid JSON
- Do NOT return markdown
- Do NOT use \`\`\`
- Do NOT add explanations
- Follow schema exactly
`
    const response = await ai.models.generateContent({

        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumeResponseSchema
        }

    })

    const jsonContent= JSON.parse(response.text);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
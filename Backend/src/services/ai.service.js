const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

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

module.exports = generateInterviewReport;
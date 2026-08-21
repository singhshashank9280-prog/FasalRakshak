const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");


// =====================================================
// ENVIRONMENT CONFIGURATION
// =====================================================

dotenv.config();


// =====================================================
// SERVER CONFIGURATION
// =====================================================

const app = express();

const PORT = process.env.PORT || 3000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(
    express.json({
        limit: "10mb"
    })
);


// =====================================================
// GEMINI API KEY CHECK
// =====================================================

if (!process.env.GEMINI_API_KEY) {

    console.error(
        "❌ GEMINI_API_KEY is missing."
    );

    process.exit(1);
}


// =====================================================
// GEMINI INITIALIZATION
// =====================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.json({
        status: "online",
        service: "FasalRakshak Gemini Backend"
    });

});


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {

    res.json({
        status: "ok",
        gemini: "configured",
        model: "gemini-3.6-flash"
    });

});


// =====================================================
// GEMINI CROP IMAGE ANALYSIS
// =====================================================

app.post("/api/analyze", async (req, res) => {

    try {

        const {
            image,
            question
        } = req.body;


        // -------------------------------------------------
        // CHECK IMAGE
        // -------------------------------------------------

        if (!image) {

            return res.status(400).json({

                success: false,

                error: "Image is required."

            });

        }


        // -------------------------------------------------
        // EXTRACT IMAGE DATA
        // -------------------------------------------------

        let mimeType = "image/jpeg";

        let base64Image = image;


        const dataUrlMatch = image.match(
            /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/
        );


        if (dataUrlMatch) {

            mimeType = dataUrlMatch[1];

            base64Image = dataUrlMatch[2];

        }


        // -------------------------------------------------
        // GEMINI PROMPT
        // -------------------------------------------------

        const prompt = `

You are FasalRakshak AI, an agricultural
crop-health assistant.

Analyze the provided plant or crop image carefully.

Help identify possible crop diseases,
plant health problems, and visible symptoms.

Provide:

1. Crop Name
2. Plant Part Visible
3. Health Status
4. Possible Disease or Condition
5. Visible Symptoms
6. Severity
7. Possible Causes
8. Preventive Measures
9. Recommended Next Steps

${question
    ? `Farmer's Question:
${question}`
    : ""
}

IMPORTANT RULES:

- Analyze only what can reasonably be observed.
- If the crop cannot be identified confidently, say so.
- If the disease cannot be identified confidently, say so.
- Do not claim that the result is a laboratory-confirmed diagnosis.
- Clearly mention uncertainty when appropriate.
- Do not invent symptoms.
- Give practical agricultural guidance.
- Keep the response understandable for farmers.

Use this format:

Crop:
Plant Part:
Health Status:
Possible Disease/Condition:
Visible Symptoms:
Severity:
Possible Causes:
Preventive Measures:
Recommended Next Steps:
Confidence:
`;


        // -------------------------------------------------
        // SEND IMAGE TO GEMINI
        // -------------------------------------------------

        const response =
            await ai.models.generateContent({

                model: "gemini-3.6-flash",

                contents: [

                    {

                        role: "user",

                        parts: [

                            {
                                text: prompt
                            },

                            {

                                inlineData: {

                                    mimeType,

                                    data: base64Image

                                }

                            }

                        ]

                    }

                ]

            });


        // -------------------------------------------------
        // GEMINI RESPONSE
        // -------------------------------------------------

        const analysis =
            response.text;


        // -------------------------------------------------
        // SEND RESULT
        // -------------------------------------------------

        res.json({

            success: true,

            analysis,

            mode: "online",

            model: "gemini-3.6-flash"

        });

    }

    catch (error) {

        console.error(
            "❌ Gemini error:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                error.message ||
                "Gemini analysis failed."

        });

    }

});


// =====================================================
// START SERVER
// =====================================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `🌱 FasalRakshak Gemini server running on port ${PORT}`
        );

    }
);
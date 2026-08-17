// ============================================================
// FasalRakshak - Teachable Machine Local Model
// ============================================================

import * as tmImage from "@teachablemachine/image";


// ============================================================
// MODEL STATE
// ============================================================

let cropModel = null;
let modelLoading = null;


// ============================================================
// LOAD CROP MODEL
// ============================================================

export function loadCropModel() {

    // Model already loaded
    if (cropModel) {
        return Promise.resolve(cropModel);
    }


    // Model is currently loading
    if (modelLoading) {
        return modelLoading;
    }


    // Teachable Machine model location
    const modelURL =
        "/model/model.json";

    const metadataURL =
        "/model/metadata.json";


    // Load model only once
    modelLoading =
        tmImage
            .load(
                modelURL,
                metadataURL
            )

            .then((model) => {

                cropModel = model;

                console.log(
                    "🌱 Crop model loaded successfully."
                );

                return model;
            })

            .catch((error) => {

                console.error(
                    "❌ Failed to load crop model:",
                    error
                );

                // Allow another loading attempt
                modelLoading = null;

                throw error;
            });


    return modelLoading;
}


// ============================================================
// ANALYZE IMAGE WITH LOCAL MODEL
// ============================================================

export async function analyzeWithLocalModel(
    imageElement
) {

    const model =
        await loadCropModel();


    if (!model) {

        throw new Error(
            "Offline CropHealth model failed to load."
        );

    }


    // Run prediction
    const predictions =
        await model.predict(
            imageElement
        );


    // Sort from highest probability to lowest
    predictions.sort(
        (a, b) =>
            b.probability -
            a.probability
    );


    // Highest probability prediction
    const top =
        predictions[0];


    return {

        success: true,

        mode: "offline",

        prediction:
            top.className,

        confidence:
            Math.round(
                top.probability * 100
            ),

        predictions:
            predictions,

        model:
            "FasalRakshak Local Model"

    };
}
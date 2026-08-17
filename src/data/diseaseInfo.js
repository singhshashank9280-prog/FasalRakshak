// ============================================================
// FasalRakshak - Disease Information Database
// ============================================================

export const DISEASE_INFO = {

    Tomato_healthy: {
        name: "Tomato - Healthy",
        cropFamily: "Tomato",
        cause: "No disease detected.",
        precautions: "Continue regular watering, balanced fertilization, and routine monitoring.",
        remedy: "No treatment needed. Keep monitoring weekly."
    },

    Tomato_Early_blight: {
        name: "Tomato - Early Blight",
        cropFamily: "Tomato",
        cause: "Fungal spores (Alternaria solani) spreading in warm, humid weather, often via wet foliage.",
        precautions: "Space plants for airflow, water at the base only, rotate crops each season.",
        remedy: "Remove and destroy infected lower leaves. Apply a copper-based fungicide every 7-10 days."
    },

    Tomato_Late_blight: {
        name: "Tomato - Late Blight",
        cropFamily: "Tomato",
        cause: "Water-mould pathogen (Phytophthora infestans) that spreads rapidly in cool, wet conditions.",
        precautions: "Avoid overhead watering, ensure good drainage, remove volunteer potato/tomato plants nearby.",
        remedy: "Destroy infected plants immediately to stop spread. Apply preventive fungicide in humid weather."
    },

    Tomato_Septoria_leaf_spot: {
        name: "Tomato - Septoria Leaf Spot",
        cropFamily: "Tomato",
        cause: "Fungal infection (Septoria lycopersici) that thrives in wet, humid conditions and spreads via splashing water.",
        precautions: "Mulch around the base to reduce soil splash, avoid working with plants when leaves are wet.",
        remedy: "Remove affected leaves, apply fungicide, and improve air circulation between plants."
    },

    Potato_healthy: {
        name: "Potato - Healthy",
        cropFamily: "Potato",
        cause: "No disease detected.",
        precautions: "Maintain regular monitoring and proper irrigation.",
        remedy: "No treatment needed."
    },

    Potato_Late_blight: {
        name: "Potato - Late Blight",
        cropFamily: "Potato",
        cause: "Water-mould pathogen (Phytophthora infestans), same as tomato late blight, spreads fast in cool wet weather.",
        precautions: "Improve field drainage, avoid dense planting, rotate crops next season.",
        remedy: "Remove infected foliage promptly. Apply a mancozeb-based fungicide."
    },

    Corn_healthy: {
        name: "Corn (Maize) - Healthy",
        cropFamily: "Corn",
        cause: "No disease detected.",
        precautions: "Continue standard care and monitoring.",
        remedy: "No treatment needed."
    },

    Corn_Common_rust: {
        name: "Corn (Maize) - Common Rust",
        cropFamily: "Corn",
        cause: "Fungal spores (Puccinia sorghi) carried by wind, favoured by moderate temperatures and moisture.",
        precautions: "Plant rust-resistant varieties where available, avoid excess nitrogen fertilizer.",
        remedy: "Apply a foliar fungicide if severity is high; usually manageable with resistant hybrids."
    },

    Corn_Northern_Leaf_Blight: {
        name: "Corn (Maize) - Northern Leaf Blight",
        cropFamily: "Corn",
        cause: "Fungal pathogen (Exserohilum turcicum) favoured by humid weather and crop residue left in fields.",
        precautions: "Rotate crops, till under old crop residue, choose resistant hybrids.",
        remedy: "Apply fungicide at early signs; remove heavily infected leaves where practical."
    },

    Grape_healthy: {
        name: "Grape - Healthy",
        cropFamily: "Grape",
        cause: "No disease detected.",
        precautions: "Maintain regular pruning and monitoring.",
        remedy: "No treatment needed."
    },

    Grape_Black_rot: {
        name: "Grape - Black Rot",
        cropFamily: "Grape",
        cause: "Fungal infection (Guignardia bidwellii) that spreads in warm, wet conditions, overwinters in old fruit/leaves.",
        precautions: "Remove mummified fruit and fallen leaves each season, prune for airflow.",
        remedy: "Apply fungicide starting early in the season; remove infected fruit clusters."
    },

    Grape_Esca: {
        name: "Grape - Esca (Black Measles)",
        cropFamily: "Grape",
        cause: "A complex of fungal pathogens that infect through pruning wounds, worsened by vine stress and age.",
        precautions: "Prune during dry weather, disinfect pruning tools, avoid unnecessary vine stress.",
        remedy: "No full cure - remove and destroy severely affected vines to limit spread; manage stress factors."
    },

    Apple_healthy: {
        name: "Apple - Healthy",
        cropFamily: "Apple",
        cause: "No disease detected.",
        precautions: "Continue standard orchard care and seasonal monitoring.",
        remedy: "No treatment needed."
    },

    Apple_scab: {
        name: "Apple - Apple Scab",
        cropFamily: "Apple",
        cause: "Fungal infection (Venturia inaequalis) that spreads in cool, wet spring weather via wind and rain.",
        precautions: "Rake and destroy fallen leaves each autumn to reduce overwintering spores.",
        remedy: "Apply fungicide sprays from bud break through early summer."
    },

    Pepper_healthy: {
        name: "Bell Pepper - Healthy",
        cropFamily: "Pepper",
        cause: "No disease detected.",
        precautions: "Continue regular monitoring and balanced watering.",
        remedy: "No treatment needed."
    },

    Pepper_Bacterial_spot: {
        name: "Bell Pepper - Bacterial Spot",
        cropFamily: "Pepper",
        cause: "Bacterial infection (Xanthomonas species), spreads through splashing water and contaminated seed/tools.",
        precautions: "Use disease-free seed, avoid overhead irrigation, disinfect tools between plants.",
        remedy: "Apply copper-based bactericide; remove severely infected plants to reduce spread."
    },

    Strawberry_healthy: {
        name: "Strawberry - Healthy",
        cropFamily: "Strawberry",
        cause: "No disease detected.",
        precautions: "Maintain regular watering and mulching.",
        remedy: "No treatment needed."
    },

    Strawberry_Leaf_scorch: {
        name: "Strawberry - Leaf Scorch",
        cropFamily: "Strawberry",
        cause: "Fungal infection (Diplocarpon earlianum) favoured by wet foliage and dense planting.",
        precautions: "Improve air circulation, avoid overhead watering, remove old infected leaves after harvest.",
        remedy: "Apply fungicide during the growing season; remove and destroy infected leaves."
    },

    Cherry_healthy: {
        name: "Cherry - Healthy",
        cropFamily: "Cherry",
        cause: "No disease detected.",
        precautions: "Continue standard orchard care.",
        remedy: "No treatment needed."
    },

    Cherry_Powdery_mildew: {
        name: "Cherry - Powdery Mildew",
        cropFamily: "Cherry",
        cause: "Fungal infection that thrives in warm, dry days with cool, humid nights; spreads via airborne spores.",
        precautions: "Prune for good air circulation, avoid excess nitrogen fertilizer.",
        remedy: "Apply sulfur-based or other approved fungicide at first sign of white powdery patches."
    },

    Peach_healthy: {
        name: "Peach - Healthy",
        cropFamily: "Peach",
        cause: "No disease detected.",
        precautions: "Continue standard orchard care and monitoring.",
        remedy: "No treatment needed."
    },

    Peach_Bacterial_spot: {
        name: "Peach - Bacterial Spot",
        cropFamily: "Peach",
        cause: "Bacterial infection (Xanthomonas arboricola), spreads via rain splash and wind, worsened by wet weather.",
        precautions: "Plant resistant varieties, avoid overhead irrigation, prune for airflow.",
        remedy: "Apply copper-based bactericide during dormant season; remove severely infected twigs."
    },

    Soybean_healthy: {
        name: "Soybean - Healthy",
        cropFamily: "Soybean",
        cause: "No disease detected.",
        precautions: "Continue regular field monitoring.",
        remedy: "No treatment needed."
    },

    Squash_Powdery_mildew: {
        name: "Squash - Powdery Mildew",
        cropFamily: "Squash",
        cause: "Fungal infection that thrives in warm, dry conditions with high humidity; spreads via airborne spores.",
        precautions: "Space plants well for airflow, avoid excess nitrogen, water at the base.",
        remedy: "Apply sulfur or potassium bicarbonate fungicide spray at first sign of white patches."
    }
};

export const ALT_CROPS = {

    Tomato: [
        {
            name: "Okra (Bhindi)",
            reason: "Less prone to blight, similar growing season."
        },
        {
            name: "Beans",
            reason: "Improves soil nitrogen, short growth cycle."
        }
    ],

    Potato: [
        {
            name: "Maize (Corn)",
            reason: "Not affected by potato blight fungus, good rotation crop."
        },
        {
            name: "Onion",
            reason: "Different disease profile, breaks the blight cycle in soil."
        }
    ],

    Corn: [
        {
            name: "Soybean",
            reason: "Breaks fungal disease cycle, fixes soil nitrogen."
        },
        {
            name: "Sunflower",
            reason: "Different pest/disease profile, cash crop value."
        }
    ],

    Grape: [
        {
            name: "Guava",
            reason: "Hardier against common vineyard fungal diseases."
        }
    ],

    Apple: [
        {
            name: "Pear",
            reason: "Similar climate needs, lower scab susceptibility in some varieties."
        }
    ],

    Pepper: [
        {
            name: "Onion",
            reason: "Not susceptible to bacterial spot, good companion rotation."
        }
    ],

    Strawberry: [
        {
            name: "Marigold",
            reason: "Breaks disease cycle, also helps repel some pests."
        }
    ],

    Cherry: [
        {
            name: "Plum",
            reason: "Related stone fruit with different mildew susceptibility."
        }
    ],

    Peach: [
        {
            name: "Fig",
            reason: "Lower susceptibility to bacterial spot."
        }
    ],

    Soybean: [
        {
            name: "Maize (Corn)",
            reason: "Common rotation partner, breaks pest/disease cycles."
        }
    ],

    Squash: [
        {
            name: "Beans",
            reason: "Different disease profile, improves soil nitrogen."
        }
    ]
};
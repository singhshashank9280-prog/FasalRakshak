// ============================================================
// FasalRakshak - Farm Profile Service
// ============================================================

const FARM_PROFILE_KEY = "farmProfile";


// ============================================================
// SOIL TYPES
// ============================================================

export const SOIL_TYPES = [
    "Sandy",
    "Clay",
    "Loamy",
    "Silty",
    "Peaty",
    "Chalky"
];


// ============================================================
// SEASONAL CROPS
// ============================================================

export const SEASONAL_CROPS = {

    winter: {

        Sandy: ["Carrot", "Radish", "Groundnut"],

        Clay: ["Wheat", "Mustard", "Peas"],

        Loamy: ["Wheat", "Potato", "Peas"],

        Silty: ["Wheat", "Barley", "Spinach"],

        Peaty: ["Cabbage", "Cauliflower", "Lettuce"],

        Chalky: ["Barley", "Spinach", "Beetroot"]

    },


    summer: {

        Sandy: ["Watermelon", "Muskmelon", "Groundnut"],

        Clay: [
            "Rice (pre-monsoon nursery)",
            "Sugarcane"
        ],

        Loamy: ["Maize", "Cotton", "Sunflower"],

        Silty: ["Maize", "Soybean"],

        Peaty: ["Cucumber", "Bottle Gourd"],

        Chalky: ["Millet", "Sunflower"]

    },


    monsoon: {

        Sandy: ["Groundnut", "Bajra (Pearl Millet)"],

        Clay: ["Rice (Paddy)", "Jute"],

        Loamy: ["Rice", "Maize", "Soybean"],

        Silty: ["Rice", "Sugarcane"],

        Peaty: ["Rice", "Taro"],

        Chalky: ["Bajra", "Sorghum"]

    },


    postMonsoon: {

        Sandy: ["Mustard", "Groundnut"],

        Clay: ["Wheat (early sowing)", "Gram"],

        Loamy: ["Wheat", "Gram", "Mustard"],

        Silty: ["Wheat", "Lentil"],

        Peaty: ["Peas", "Cabbage"],

        Chalky: ["Gram", "Mustard"]

    }

};


// ============================================================
// SEASON
// ============================================================

export function getSeasonKey(month) {

    if (
        month === 11 ||
        month === 0 ||
        month === 1
    ) {

        return "winter";

    }

    if (
        month >= 2 &&
        month <= 4
    ) {

        return "summer";

    }

    if (
        month >= 5 &&
        month <= 8
    ) {

        return "monsoon";

    }

    return "postMonsoon";
}


export function getSeasonLabel(seasonKey) {

    return {

        winter: "Winter",

        summer: "Summer",

        monsoon: "Monsoon",

        postMonsoon: "Post-Monsoon"

    }[seasonKey];

}


// ============================================================
// SAVE FARM PROFILE
// ============================================================

export function saveFarmProfile(profile) {

    const existing =
        JSON.parse(
            localStorage.getItem(
                FARM_PROFILE_KEY
            ) || "{}"
        );


    const merged = {

        ...existing,

        ...profile,

        updatedAt: Date.now()

    };


    localStorage.setItem(
        FARM_PROFILE_KEY,
        JSON.stringify(merged)
    );


    return merged;
}


// ============================================================
// LOAD FARM PROFILE
// ============================================================

export function loadFarmProfile() {

    return JSON.parse(
        localStorage.getItem(
            FARM_PROFILE_KEY
        ) || "null"
    );

}


// ============================================================
// SAVE SOIL
// ============================================================

export function saveSoilType(soilType) {

    return saveFarmProfile({
        soilType
    });

}


// ============================================================
// GET SEASONAL CROPS
// ============================================================

export function getSeasonalCrops(soilType) {

    const seasonKey =
        getSeasonKey(
            new Date().getMonth()
        );


    return (
        SEASONAL_CROPS[seasonKey]?.[soilType] ||
        []
    );

}
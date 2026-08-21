import { saveFarmProfile } from "./farmProfile";


// ============================================================
// DETECT LOCATION
// ============================================================

export function detectFarmLocation(
    onLocation,
    onError
) {

    if (!navigator.geolocation) {

        onError(
            "Your browser does not support location detection."
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "📍 Location detected:",
                latitude,
                longitude
            );


            // Save coordinates

            saveFarmProfile({

                lat: latitude,

                lon: longitude

            });


            // Return coordinates immediately

            onLocation({

                latitude,

                longitude

            });


            // Try reverse geocoding

            try {

                const response =
                    await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );


                if (!response.ok) {

                    throw new Error(
                        "Reverse geocoding failed"
                    );

                }


                const data =
                    await response.json();


                const placeName = [

                    data.locality,

                    data.principalSubdivision

                ]
                    .filter(Boolean)
                    .join(", ");


                if (placeName) {

                    saveFarmProfile({

                        placeName

                    });

                }


                // Fetch weather after location

                await fetchFarmWeather(
                    latitude,
                    longitude
                );


            }
            catch (error) {

                console.warn(
                    "⚠️ Place lookup failed:",
                    error
                );

            }

        },


        (error) => {

            console.error(
                "❌ Geolocation error:",
                error
            );


            let message =
                "Location error.";


            if (error.code === 1) {

                message =
                    "Location permission denied. Please allow location access.";

            }

            else if (error.code === 2) {

                message =
                    "Your device could not determine your location.";

            }

            else if (error.code === 3) {

                message =
                    "Location request timed out. Try again.";

            }


            onError(message);

        },


        {

            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 0

        }

    );

}


// ============================================================
// WEATHER
// ============================================================

export async function fetchFarmWeather(
    lat,
    lon
) {

    const response =
        await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&timezone=auto`
        );


    if (!response.ok) {

        throw new Error(
            "Weather service unavailable."
        );

    }


    const data =
        await response.json();


    const current =
        data.current;


    const weatherLabel =
        describeWeatherCode(
            current.weather_code
        );


    const weather = {

        temp:
            current.temperature_2m,

        humidity:
            current.relative_humidity_2m,

        precipitation:
            current.precipitation,

        label:
            weatherLabel

    };


    saveFarmProfile({

        weather

    });


    return weather;

}


// ============================================================
// WEATHER CODE
// ============================================================

export function describeWeatherCode(code) {

    if (code === 0)
        return "Clear";

    if (code <= 3)
        return "Partly Cloudy";

    if (code <= 49)
        return "Foggy";

    if (code <= 59)
        return "Drizzle";

    if (code <= 69)
        return "Rain";

    if (code <= 79)
        return "Snow";

    if (code <= 99)
        return "Thunderstorm";

    return "Unknown";

}
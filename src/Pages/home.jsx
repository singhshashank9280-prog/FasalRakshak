import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {

    // ================= FARM STATE =================

    const [location, setLocation] = useState("Not set");
    const [locationSub, setLocationSub] = useState("");

    const [weather, setWeather] = useState("Not set");
    const [weatherSub, setWeatherSub] = useState("");

    const [soilType, setSoilType] = useState("");

    const [season, setSeason] = useState("");
    const [cropSuggestions, setCropSuggestions] = useState([]);

    const [locationLoading, setLocationLoading] = useState(false);


    // ================= CROP DATA =================

    const SEASON_CROPS = {
        Winter: {
            Sandy: ["Wheat", "Barley", "Peas", "Carrot"],
            Clay: ["Wheat", "Barley", "Peas", "Mustard"],
            Loamy: ["Wheat", "Peas", "Potato", "Carrot"],
            Silty: ["Wheat", "Peas", "Barley"],
            Peaty: ["Potato", "Carrot", "Peas"],
            Chalky: ["Barley", "Peas", "Mustard"]
        },

        Summer: {
            Sandy: ["Groundnut", "Watermelon", "Cucumber", "Millet"],
            Clay: ["Maize", "Cotton", "Soybean"],
            Loamy: ["Maize", "Groundnut", "Vegetables"],
            Silty: ["Maize", "Rice", "Vegetables"],
            Peaty: ["Vegetables", "Potato"],
            Chalky: ["Millet", "Groundnut"]
        },

        Monsoon: {
            Sandy: ["Groundnut", "Millet", "Maize"],
            Clay: ["Rice", "Cotton", "Soybean"],
            Loamy: ["Rice", "Maize", "Soybean"],
            Silty: ["Rice", "Maize"],
            Peaty: ["Rice", "Vegetables"],
            Chalky: ["Millet", "Maize"]
        },

        "Post-Monsoon": {
            Sandy: ["Wheat", "Mustard", "Peas"],
            Clay: ["Wheat", "Mustard", "Chickpea"],
            Loamy: ["Wheat", "Potato", "Peas"],
            Silty: ["Wheat", "Barley", "Peas"],
            Peaty: ["Potato", "Vegetables"],
            Chalky: ["Barley", "Mustard", "Peas"]
        }
    };


    // ================= GET SEASON =================

    const getCurrentSeason = () => {

        const month = new Date().getMonth() + 1;

        if (month >= 11 || month <= 2) {
            return "Winter";
        }

        if (month >= 3 && month <= 5) {
            return "Summer";
        }

        if (month >= 6 && month <= 9) {
            return "Monsoon";
        }

        return "Post-Monsoon";
    };


    // ================= LOAD FARM PROFILE =================

    useEffect(() => {

        const currentSeason = getCurrentSeason();

        setSeason(currentSeason);


        const savedProfile =
            localStorage.getItem("farmProfile");

        if (savedProfile) {

            try {

                const profile =
                    JSON.parse(savedProfile);

                if (profile.location) {
                    setLocation(profile.location);
                }

                if (profile.locationSub) {
                    setLocationSub(profile.locationSub);
                }

                if (profile.weather) {
                    setWeather(profile.weather);
                }

                if (profile.weatherSub) {
                    setWeatherSub(profile.weatherSub);
                }

                if (profile.soilType) {

                    setSoilType(profile.soilType);

                    updateCropSuggestions(
                        profile.soilType,
                        currentSeason
                    );
                }

            } catch (error) {

                console.error(
                    "Failed to load farm profile:",
                    error
                );

            }

        }

    }, []);


    // ================= SAVE FARM PROFILE =================

    const saveFarmProfile = (updatedData) => {

        const oldProfile =
            JSON.parse(
                localStorage.getItem("farmProfile") || "{}"
            );

        const newProfile = {
            ...oldProfile,
            ...updatedData
        };

        localStorage.setItem(
            "farmProfile",
            JSON.stringify(newProfile)
        );
    };


    // ================= CROP SUGGESTIONS =================

    const updateCropSuggestions = (
        soil,
        currentSeason = season
    ) => {

        if (!soil || !currentSeason) {

            setCropSuggestions([]);

            return;
        }

        const crops =
            SEASON_CROPS[currentSeason]?.[soil] || [];

        setCropSuggestions(crops);
    };


    // ================= SOIL CHANGE =================

    const handleSoilChange = (event) => {

        const value = event.target.value;

        setSoilType(value);

        saveFarmProfile({
            soilType: value
        });

        updateCropSuggestions(
            value,
            season
        );
    };


    // ================= WEATHER =================

    const fetchWeather = async (
        latitude,
        longitude
    ) => {

        try {

            setWeather("Loading...");
            setWeatherSub("");

            const url =
                `https://api.open-meteo.com/v1/forecast` +
                `?latitude=${latitude}` +
                `&longitude=${longitude}` +
                `&current=temperature_2m,relative_humidity_2m,precipitation` +
                `&timezone=auto`;

            const response =
                await fetch(url);

            if (!response.ok) {
                throw new Error(
                    "Weather request failed"
                );
            }

            const data =
                await response.json();

            const current =
                data.current;

            const temperature =
                current.temperature_2m;

            const humidity =
                current.relative_humidity_2m;

            const precipitation =
                current.precipitation;

            setWeather(
                `${temperature}°C`
            );

            setWeatherSub(
                `Humidity: ${humidity}% • Rain: ${precipitation} mm`
            );

            saveFarmProfile({
                weather: `${temperature}°C`,
                weatherSub:
                    `Humidity: ${humidity}% • Rain: ${precipitation} mm`
            });

        } catch (error) {

            console.error(
                "Weather error:",
                error
            );

            setWeather("Unavailable");
            setWeatherSub(
                "Could not fetch weather"
            );

        }
    };


    // ================= LOCATION =================

    const detectFarmLocation = () => {

        //alert system whole file have to be changed
        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported by your browser."
            );

            return;
        }

        setLocationLoading(true);

        setLocation("Detecting...");
        setLocationSub("");

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                try {

                    // Reverse geocoding
                    const response =
                        await fetch(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        );

                    const data =
                        await response.json();

                    const city =
                        data.city ||
                        data.locality ||
                        data.principalSubdivision ||
                        "Unknown location";

                    const state =
                        data.principalSubdivision ||
                        "";

                    setLocation(city);

                    setLocationSub(
                        state
                    );

                    saveFarmProfile({
                        location: city,
                        locationSub: state,
                        latitude,
                        longitude
                    });


                    // Get weather
                    await fetchWeather(
                        latitude,
                        longitude
                    );

                } catch (error) {

                    console.error(
                        "Location error:",
                        error
                    );

                    setLocation(
                        "Location detected"
                    );

                    setLocationSub(
                        `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                    );

                    saveFarmProfile({
                        location:
                            "Location detected",
                        locationSub:
                            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                        latitude,
                        longitude
                    });

                    await fetchWeather(
                        latitude,
                        longitude
                    );

                } finally {

                    setLocationLoading(false);

                }

            },

            (error) => {

                console.error(
                    "Geolocation error:",
                    error
                );

                setLocation(
                    "Location unavailable"
                );

                setLocationSub(
                    "Please allow location access"
                );

                setLocationLoading(false);

            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }

        );
    };


    // ================= THEME =================

    const toggleTheme = () => {

        document.body.classList.toggle("dark");

        const isDark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "cropHealthTheme",
            isDark ? "dark" : "light"
        );
    };


    // Load saved theme
    useEffect(() => {

        const savedTheme =
            localStorage.getItem(
                "cropHealthTheme"
            );

        if (savedTheme === "dark") {

            document.body.classList.add("dark");

        }

    }, []);


    // ================= CONTACT FORM =================

    const handleContactSubmit = (event) => {
        //make this more better





        event.preventDefault();

        alert(
            "Your message has been submitted."
        );

        event.target.reset();
    };


    // ================= JSX =================

    return (
        <>

            {/* ================= NAVBAR ================= */}

            <header>

                <nav>

                    <div className="logo">
                        🌱 FasalRakshak
                    </div>


                    <div className="nav-links">

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/disease">
                            Disease Detection
                        </Link>

                        <Link to="/camera">
                            Image Capture
                        </Link>

                        <Link to="/voice">
                            Voice Assistant
                        </Link>

                        <Link to="/language">
                            Language
                        </Link>

                        <Link to="/history">
                            History
                        </Link>

                        <Link to="/about">
                            About
                        </Link>

                        <button
                            id="themeToggle"
                            onClick={toggleTheme}
                        >
                            🌙 Dark Mode
                        </button>

                    </div>

                </nav>

            </header>


            {/* ================= HERO ================= */}

            <section className="hero">

                <h1>
                    Welcome to FasalRakshak 🌱
                </h1>

                <p>
                    A platform to identify crop diseases,
                    understand crop health and help farmers
                    through digital assistance.
                </p>

                <Link
                    className="btn"
                    to="/disease"
                >
                    Start Detection
                </Link>

            </section>


            {/* ================= FARM CONTEXT ================= */}

            <div className="page-container">

                <h1>
                    🌾 Your Farm Profile
                </h1>

                <p>
                    Detect your location for local weather,
                    choose your soil type, and get seasonal
                    crop suggestions.
                </p>


                <div className="farm-actions">

                    <button
                        onClick={detectFarmLocation}
                        disabled={locationLoading}
                    >

                        {locationLoading
                            ? "📍 Detecting..."
                            : "📍 Detect My Location"
                        }

                    </button>

                </div>


                <div className="farm-context">


                    {/* LOCATION */}

                    <div className="farm-card">

                        <h4>
                            Location
                        </h4>

                        <div className="farm-value">
                            {location}
                        </div>

                        <div className="farm-sub">
                            {locationSub}
                        </div>

                    </div>


                    {/* WEATHER */}

                    <div className="farm-card">

                        <h4>
                            Weather
                        </h4>

                        <div className="farm-value">
                            {weather}
                        </div>

                        <div className="farm-sub">
                            {weatherSub}
                        </div>

                    </div>


                    {/* SOIL */}

                    <div className="farm-card">

                        <h4>
                            Soil Type
                        </h4>

                        <select
                            value={soilType}
                            onChange={handleSoilChange}
                        >

                            <option value="">
                                Select soil type
                            </option>

                            <option value="Sandy">
                                Sandy
                            </option>

                            <option value="Clay">
                                Clay
                            </option>

                            <option value="Loamy">
                                Loamy
                            </option>

                            <option value="Silty">
                                Silty
                            </option>

                            <option value="Peaty">
                                Peaty
                            </option>

                            <option value="Chalky">
                                Chalky
                            </option>

                        </select>

                    </div>

                </div>


                {/* SEASON */}

                <h2
                    style={{
                        textAlign: "center",
                        marginTop: "10px"
                    }}
                >

                    Seasonal Crop Suggestions (
                    {season}
                    )

                </h2>


                {/* CROP SUGGESTIONS */}

                <div className="crop-suggestions">

                    {cropSuggestions.length === 0 ? (

                        <p>
                            Select your soil type to see
                            crop suggestions.
                        </p>

                    ) : (

                        cropSuggestions.map(
                            (crop, index) => (

                                <div
                                    className="card"
                                    key={index}
                                >

                                    <h3>
                                        🌱 {crop}
                                    </h3>

                                </div>

                            )
                        )

                    )}

                </div>

            </div>


            {/* ================= FARMER SUPPORT ================= */}

            <div className="page-container">

                <h1>
                    Farmer Support
                </h1>

                <p>
                    Get information about crops,
                    diseases and prevention methods.
                </p>


                <div className="cards">

                    <div className="card">

                        <h3>
                            Disease Prevention
                        </h3>

                        <p>
                            Learn how to protect crops
                            from diseases using better
                            farming practices.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            Crop Information
                        </h3>

                        <p>
                            Get information about crop
                            health, growth and maintenance.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            Smart Assistance
                        </h3>

                        <p>
                            Use voice and text support
                            for farming related questions.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================= QUICK FEATURES ================= */}

            <div className="page-container">

                <h1>
                    Our Features
                </h1>


                <div className="cards">

                    <div className="card">

                        <h3>
                            📷 Image Detection
                        </h3>

                        <p>
                            Upload crop images and
                            analyze health conditions.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            🎤 Voice Assistant
                        </h3>

                        <p>
                            Ask farming questions
                            using voice.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            🌍 Multiple Languages
                        </h3>

                        <p>
                            Support for Indian
                            regional languages.
                        </p>

                    </div>

                </div>

            </div>


            {/* ================= CONTACT ================= */}

            <form
                id="contactForm"
                onSubmit={handleContactSubmit}
            >

                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                />

                <textarea
                    name="message"
                    placeholder="Your Message"
                    required
                />

                <input
                    type="text"
                    name="_gotcha"
                    style={{
                        display: "none"
                    }}
                />

                <button type="submit">
                    Send Message
                </button>

                <div
                    style={{
                        marginTop: "15px"
                    }}
                />

            </form>


            {/* ================= FOOTER ================= */}

            <footer>

                <h3>
                    🌱 FasalRakshak
                </h3>

                <p>
                    Smart agriculture support platform
                    for better crop health.
                </p>

                <p>
                    © 2026 FasalRakshak.
                    All rights reserved.
                </p>

            </footer>

        </>
    );
}

export default Home;
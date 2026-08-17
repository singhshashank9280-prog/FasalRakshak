import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/home.jsx";
import Disease from "./Pages/Disease.jsx";
import History from "./Pages/history";
import Camera from "./Pages/camera";
import Voice from "./components/Voice";
import Language from "./Pages/Language";
import About from "./Pages/About";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/disease"
                    element={<Disease />}
                />
                <Route
                    path="/history"
                    element={<History />}
                />
                <Route
                    path="/camera"
                    element={<Camera />}
                />
                <Route
                    path="/voice"
                    element={<Voice />}
                />
                <Route
                    path="/language"
                    element={<Language />}
                />
                <Route
                    path="/about"
                    element={<About />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
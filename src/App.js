import './app.css';
import React, { useState } from 'react';
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState("");
  const [temperature, setTemperature] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("Celsius");
  const [bgClass, setBgClass] = useState("default-bg");

  function handleCity(evt) {
    setCity(evt.target.value);
  }

  function convertTemperature(temp) {
    if (unit === "Celsius") {
      return temp - 273.15;
    } else {
      return ((temp - 273.15) * 9) / 5 + 32;
    }
  }

  function getWeather() {
    setLoading(true);
    setError("");
    axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8b9b6b0b71f63f6a9d91483128a016b5`)
      .then((response) => {
        const weatherData = response.data;
        setWeather(weatherData.weather[0].main);
        setDescription(weatherData.weather[0].description);
        const temp = convertTemperature(weatherData.main.temp);
        setTemperature(temp.toFixed(2));

        
        const weatherCondition = weatherData.weather[0].main.toLowerCase();
        if (weatherCondition.includes("cloud")) setBgClass("cloudy-bg");
        else if (weatherCondition.includes("rain")) setBgClass("rainy-bg");
        else if (weatherCondition.includes("clear")) setBgClass("sunny-bg");
        else setBgClass("default-bg");
      })
      .catch(() => {
        setError("City not found. Please try again.");
        setWeather("");
        setDescription("");
        setTemperature("");
      })
      .finally(() => setLoading(false));
  }

  function toggleUnit() {
    setUnit(unit === "Celsius" ? "Fahrenheit" : "Celsius");
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-[30%] ${bgClass}`} id="bg">
      <div className="p-[10%]" id="container">
        <h1 className="font-bold my-[20%] text-2xl sm:text-3xl text-center">Weather App 🌦️</h1>
        <div className="flex flex-col items-center">
          <div className="flex gap-3">
            <h6 className="text-xl font-medium">City:</h6>
            <input
              type="text"
              onChange={handleCity}
              className="border rounded px-2 py-1 focus:outline-none"
            />
          </div>

          <button
            onClick={getWeather}
            className="bg-gray-400 text-black p-1 border rounded-md mt-3 hover:bg-black hover:text-white"
          >
            Submit
          </button>
        </div>

        {loading && <p className="text-center text-blue-600 mt-3">Fetching weather data...</p>}
        {error && <p className="text-center text-red-600 mt-3">{error}</p>}

        <div className="mt-4">
          {weather && (
            <>
              <div className="flex gap-1">
                <h4 className="text-xl font-medium">Weather:</h4>
                <p className="text-center text-xl text-blue-600" id="weather">
                  {weather}
                </p>
              </div>
              <div className="flex gap-1">
                <h4 className="text-xl font-medium">Temperature:</h4>
                <p className="text-center text-xl text-blue-600" id="temperature">
                  {temperature}° {unit}
                </p>
              </div>
              <div className="flex gap-1">
                <h4 className="text-xl font-medium">Description:</h4>
                <p className="text-center text-xl text-blue-600" id="description">
                  {description}
                </p>
              </div>
              <button
                onClick={toggleUnit}
                className="bg-blue-500 text-white px-2 py-1 mt-3 rounded hover:bg-blue-700"
              >
                In {unit === "Celsius" ? "Fahrenheit" : "Celsius"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

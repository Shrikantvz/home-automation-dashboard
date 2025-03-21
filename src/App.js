import React, { useState, useEffect } from "react";
import "./App.css";

const BLYNK_SENSOR_URL = "https://blynk.cloud/external/api/get?token=akZbWSlZvH8NqVi6wfalzDUdv0GHc6l4&pin=V1";
const BLYNK_LED_URL = "https://blynk.cloud/external/api/update?token=akZbWSlZvH8NqVi6wfalzDUdv0GHc6l4&pin=V0";

const App = () => {
  const [distance, setDistance] = useState("Loading...");
  const [bulbOn, setBulbOn] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        let response = await fetch(BLYNK_SENSOR_URL);
        let data = await response.text();
        setDistance(data);
        if (Number(data) < 30) {
          setBulbOn(true);
          await fetch(`${BLYNK_LED_URL}&value=1`);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
        setDistance("Error!");
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 2000);
    return () => clearInterval(interval);
  }, []);

  const toggleLED = async () => {
    try {
      const newState = bulbOn ? 0 : 1;
      await fetch(`${BLYNK_LED_URL}&value=${newState}`);
      setBulbOn(!bulbOn);
    } catch (error) {
      console.error("Error updating LED state:", error);
    }
  };

  if (!showDashboard) {
    return (
      <div className="homepage">
        <h1 className="fade-in">🏠 Shrikant Home Automation</h1>
        <p className="fade-in">Experience the Future of Smart Living</p>
        <button className="start-btn pulse" onClick={() => setShowDashboard(true)}>
          Enter Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <h1 className="bounce">🏡 Smart Home Dashboard</h1>
      <div className="dashboard">
        <div className="sensor-card slide-in">
          <h2>📏 Distance Sensor</h2>
          <p className="distance" style={{ color: distance < 30 ? "red" : "green" }}>
            Distance: <span>{distance} cm</span>
          </p>
        </div>
        <div className="bulb-card slide-in">
          <h2>💡 Bulb Control</h2>
          <div className={`bulb ${bulbOn ? "on glow" : "off"}`} onClick={toggleLED}></div>
          <p className="status fade-in">{bulbOn ? "ON" : "OFF"}</p>
          <button className="push-btn pulse" onClick={toggleLED}>
            🔘 Push Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
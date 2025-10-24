import React from 'react';
import WeatherDashboard from './WeatherDashboard/WeatherDashboard'; // Import the dashboard
import './App.css'; // or your main stylesheet

function App() {
  return (
    <div className="App">
      <WeatherDashboard /> {/* Add the component here */}
    </div>
  );
}

export default App;
import React from 'react';
import { Umbrella, Sun, CloudRain, Cloud, CloudSnow } from 'lucide-react';

const WeatherQuote = ({ condition }) => {
  const getWeatherMessage = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return {
        message: "It's rainy outside. Don't forget to carry an umbrella if you're heading out.",
        icon: <Umbrella size={30} color="#00f" />
      };
    } else if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return {
        message: "The weather is clear and sunny. A perfect day to be outdoors!",
        icon: <Sun size={30} color="#ff0" />
      };
    } else if (lowerCondition.includes('cloud')) {
      return {
        message: "It's a bit cloudy today. You might want to keep an umbrella handy, just in case.",
        icon: <Cloud size={30} color="#ccc" />
      };
    } else if (lowerCondition.includes('snow')) {
      return {
        message: "Snow is falling. Stay warm and drive safely!",
        icon: <CloudSnow size={30} color="#fff" />
      };
    } else {
      return {
        message: "Weather conditions are moderate. Have a great day!",
        icon: <CloudRain size={30} color="#00f" />
      };
    }
  };

  const { message, icon } = getWeatherMessage(condition);

  return (
    <div className="weather-message card p-4 bg-gradient-card text-center text-white">
      <div className="d-flex align-items-center justify-content-center">
        {icon}
        <h5 className="ms-3">{message}</h5>
      </div>
    </div>
  );
};

export default WeatherQuote;

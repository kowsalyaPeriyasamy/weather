import React, { useEffect, useState } from 'react';
import { Cloud, Droplets, Wind, Gauge, Search,CloudRain, CloudSun, MapPin } from 'lucide-react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import WeatherHistory from './components/WeatherHistory';

function App() {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [historyData, setHistoryData] = useState([]);

  const API_KEY = '3d307340a9acbb8cc6ca9c37ba9cbe8c';

  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const encodedCity = encodeURIComponent(city);

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${API_KEY}&units=metric`
      );

      setCurrentWeather({
        temp: Math.round(response.data.main.temp),
        humidity: response.data.main.humidity,
        windSpeed: Math.round(response.data.wind.speed * 3.6),
        pressure: response.data.main.pressure,
        city: response.data.name
      });

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&appid=${API_KEY}&units=metric`
      );

      const processedHistory = forecastResponse.data.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5)
        .map((day) => ({
         
          date: new Date(day.dt * 1000).toLocaleDateString('en-GB'),
          temp: `${Math.round(day.main.temp)}°C`,
          humidity: `${day.main.humidity}%`,
          windSpeed: `${Math.round(day.wind.speed * 3.6)} km/h`,
          pressure: `${day.main.pressure} hPa`
        }));

      setHistoryData(processedHistory);
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('City not found. Please try again.');
      } else {
        setError('Error fetching weather data. Please try again later.');
      }
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setSearchCity(response.data.name);
      await fetchWeatherByCity(response.data.name);
    } catch (err) {
      setError('Error fetching weather data. Please try searching for a city instead.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          setError('Unable to retrieve your location. Please search for a city.');
          setLoading(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please search for a city.');
      setLoading(false);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      await fetchWeatherByCity(searchCity.trim());
    }
  };

  if (loading) {
    return (
      <div className="container bg-gradient-custom d-flex vh-100 justify-content-center align-items-center  text-white">
        <h3>Loading weather data...   {<Cloud size={34} />}</h3>
      </div>
    );
  }

  return (
    <div className="container bg-gradient-custom py-5 text-white">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h1 className="mb-5 mb-md-0"><CloudSun size={34} /> Weather Dashboard</h1>

        <form onSubmit={handleSearch} className="w-15 w-md-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search city..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <button className="btn btn-light" type="submit">
              <Search size={20} />
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {currentWeather && (
        <>
          {currentWeather.city && (
            <h2 className="text-center mb-4"> Current weather in {currentWeather.city}<MapPin size={25} /> </h2>
          )}

          <div className="row g-4 mb-5">
            <div className="col-md-6 col-lg-3">
              <WeatherCard title="Temperature" value={`${currentWeather.temp}°C`} icon={<Cloud size={34} />} />
            </div>
            <div className="col-md-6 col-lg-3">
              <WeatherCard title="Humidity" value={`${currentWeather.humidity}%`} icon={<Droplets size={34} />} />
            </div>
            <div className="col-md-6 col-lg-3">
              <WeatherCard title="Wind Speed" value={`${currentWeather.windSpeed} km/h`} icon={<Wind size={34} />} />
            </div>
            <div className="col-md-6 col-lg-3">
              <WeatherCard title="Pressure" value={`${currentWeather.pressure} hPa`} icon={<Gauge size={34} />} />
            </div>
          </div>

          <WeatherHistory historyData={historyData}  />
        </>
      )}
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { Cloud, Droplets, Wind, Gauge, Search, CloudSun, MapPin } from 'lucide-react';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
import WeatherHistory from './components/WeatherHistory';
import WeatherQuote from './components/WeatherQuote';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [futureData, setFutureData] = useState([]);
  const [showFuture, setShowFuture] = useState(false);
  const API_KEY = 'a2d1db721ef341728a561610250804';

  const fetchCurrentWeather = async (city) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
    const response = await axios.get(url);
    return {
      temp: Math.round(response.data.current.temp_c),
      humidity: response.data.current.humidity,
      windSpeed: response.data.current.wind_kph,
      pressure: response.data.current.pressure_mb,
      condition: response.data.current.condition.text,
      city: response.data.location.name
    };
  };

  const fetchPastWeather = async (city) => {
    const today = new Date();
    const dates = [...Array(5)].map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (i + 1));
      return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    });
  
    const results = await Promise.all(
      dates.map((date) =>
        axios.get(`https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${city}&dt=${date}`)
      )
    );
  
    return results
      .map((res) => {
        const rawDate = res.data.forecast.forecastday[0].date;
        const [year, month, day] = rawDate.split('-');
        const formattedDate = `${day}-${month}-${year}`; // Format: DD-MM-YYYY
        const dayData = res.data.forecast.forecastday[0].day;
        return {
          date: formattedDate,
          temp: `${Math.round(dayData.avgtemp_c)}°C`,
          humidity: `${dayData.avghumidity}%`,
          windSpeed: `${Math.round(dayData.maxwind_kph)} km/h`,
          pressure: `${dayData.avgvis_km} hPa`
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateB - dateA; // Sort in descending order
      });
  };
  
  const fetchFutureForecast = async (city) => {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=6`;
    const res = await axios.get(url);
    return res.data.forecast.forecastday
      .slice(1)
      .map((day) => {
        const [y, m, d] = day.date.split('-');
        const formattedDate = `${d}-${m}-${y}`;
        return {
          date: formattedDate,
          temp: `${Math.round(day.day.avgtemp_c)}°C`,
          humidity: `${day.day.avghumidity}%`,
          windSpeed: `${Math.round(day.day.maxwind_kph)} km/h`,
          pressure: `${day.day.avgvis_km} hPa`
        };
      });
  };

  const fetchAllWeather = async (city) => {
    try {
      setLoading(true);
      setError(null);
      const current = await fetchCurrentWeather(city);
      const past = await fetchPastWeather(city);
      const future = await fetchFutureForecast(city);
      setCurrentWeather(current);
      setHistoryData(past);
      setFutureData(future);
      setShowFuture(false); // Reset on each search
      setLoading(false);
    } catch (err) {
      setError('City not found or API error. Please try again.');
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`;
      const res = await axios.get(url);
      const city = res.data.location.name;
      setSearchCity(city);
      await fetchAllWeather(city);
    } catch (err) {
      setError('Location error. Search manually.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => {
          setError('Location blocked. Use search box.');
          setLoading(false);
        }
      );
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchAllWeather(searchCity.trim());
    }
  };

  if (loading) {
    return (
      <div className="container bg-gradient-custom vh-100 d-flex justify-content-center align-items-center text-white">
        <h3>Loading weather data... <Cloud size={30} /></h3>
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

      {error && <div className="alert alert-danger">{error}</div>}

      {currentWeather && (
        <>
          <h2 className="text-center mb-4">
            Current Weather in {currentWeather.city} <MapPin size={25} />
          </h2>

          <div className="row g-4 mb-5">
            <div className="col-md-6 col-lg-3">
              <WeatherCard title="Temperature" value={`${currentWeather.temp}°C`} icon={<Cloud />} />
            </div>
            <div className="col-md-6 col-lg-3">
              <WeatherCard title="Humidity" value={`${currentWeather.humidity}%`} icon={<Droplets />} />
            </div>
            <div className="col-md-6 col-lg-3">
              <WeatherCard title="Wind Speed" value={`${currentWeather.windSpeed} km/h`} icon={<Wind />} />
            </div>
            <div className="col-md-6 col-lg-3">
              <WeatherCard title="Pressure" value={`${currentWeather.pressure} hPa`} icon={<Gauge />} />
            </div>
          </div>

         {/* Display the weather quote */}
         <WeatherQuote condition={currentWeather.condition} />

          {/* Show WeatherHistory with either past or future */}
          <WeatherHistory historyData={showFuture ? futureData : historyData} isFuture={showFuture} />

            {/* Toggle Button */}
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-light"
                onClick={() => setShowFuture(!showFuture)}
              >
                {showFuture ? 'Show Past 5 Days History' : 'Show Next 5 Days Forecast'}
              </button>
            </div>
        </>
      )}
    </div>
  );
}

export default App;

import React from 'react';

const WeatherHistory = ({ historyData, isFuture }) => {
  return (
    <div className="card text-white bg-gradient-card shadow-lg rounded-4 border-0 mt-5 p-3 animate-fade">
      <div className="card-body">
        <h2 className="card-title mb-4 fs-3 fw-bold ">
          {isFuture ? '🔮 Next 5 Days Weather Forecast' : '📅 Last 5 Days Weather History'}
        </h2>
        <div className="table-responsive">
          <table className="table table-hover table-bordered text-white align-middle mb-0 custom-table">
            <thead className="table-light text-dark">
              <tr>
                <th>Date</th>
                <th>🌡 Temp (°C)</th>
                <th>💧 Humidity (%)</th>
                <th>🌬 Wind (km/h)</th>
                <th>🔽 Pressure (hPa)</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((day, index) => (
                <tr key={index} className="table-row-hover">
                  <td>{day.date}</td>
                  <td>{day.temp}</td>
                  <td>{day.humidity}</td>
                  <td>{day.windSpeed}</td>
                  <td>{day.pressure}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeatherHistory;

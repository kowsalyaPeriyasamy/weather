import React from 'react';

const WeatherCard = ({ title, value, icon }) => {
  return (
    <div className="card text-white bg-opacity-25 bg-gradient-card bg-dark shadow">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center py-2 mb-3">
          <h5 className="card-title">{title}</h5>
          {icon}
        </div>
        <h3 className="card-text fw-bold">{value}</h3>
      </div>
    </div>
  );
};

export default WeatherCard;

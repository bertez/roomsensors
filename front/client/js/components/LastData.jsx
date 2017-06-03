import React from 'react';

export const LastData = ({ last }) => {
    return (
        <div className="last">
            <div className="value temperature">
                {last.temperature.toFixed(2)} <span>ºC</span>
            </div>
            <div className="value humidity">
                {last.humidity.toFixed(2)} <span>%</span>
            </div>
            <div className="value pressure">
                {last.pressure.toFixed(2)} <span>mBar</span>
            </div>
        </div>
    );
};

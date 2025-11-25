import React from "react";

const StatCard = ({ title, value, icon, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${textColor} opacity-80`}>
            {title}
          </p>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
        </div>
        <div className={`text-4xl ${textColor} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const ConvertedLeadsChart = ({ convertedLeads }) => {
  // Example data (you should format your API data accordingly)
  const data = [
    { month: "Jan", converted: 200 },
    { month: "Feb", converted: 150 },
    { month: "Mar", converted: 170 },
    { month: "Apr", converted: 110 },
    { month: "May", converted: 210 },
    { month: "Jun", converted: 300 },
    { month: "July", converted: 150 },
    { month: "Aug", converted: 200 },
    { month: "Sep", converted: 220 },
    { month: "Oct", converted: 130 },
    { month: "Nov", converted: 90 },
    { month: "Dec", converted: 250 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="converted" fill="#2563EB" barSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ConvertedLeadsChart;

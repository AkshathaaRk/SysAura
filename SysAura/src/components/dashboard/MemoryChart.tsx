import React, { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
type MemoryChartProps = {
  data?: number;
  memoryInfo?: any;
};

const MemoryChart: React.FC<MemoryChartProps> = ({ data, memoryInfo }) => {
  // Use provided data or fallback to mock data
  const memoryUsage = data !== undefined ? data : 65;

  // Get memory details if available
  const usedGB = memoryInfo?.used || 0;
  const totalGB = memoryInfo?.total || 0;
  const freeGB = memoryInfo?.free || 0;

  // Create chart data
  const chartData = [{
    name: `Used (${usedGB.toFixed(1)} GB)`,
    value: memoryUsage
  }, {
    name: `Free (${freeGB.toFixed(1)} GB)`,
    value: 100 - memoryUsage
  }];
  const COLORS = ['#6366f1', '#e5e7eb'];
  return <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label={({
        name,
        percent
      }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false}>
          {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={value => [`${value}%`, 'Memory']} contentStyle={{
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        color: '#f9fafb'
      }} />
        <Legend verticalAlign="bottom" height={36} formatter={value => <span className="text-gray-700 dark:text-gray-300">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>;
};
export default MemoryChart;
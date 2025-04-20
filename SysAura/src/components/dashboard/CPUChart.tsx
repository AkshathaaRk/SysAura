import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
type CPUChartProps = {
  data?: number;
  cpuInfo?: any;
};

const CPUChart: React.FC<CPUChartProps> = ({ data, cpuInfo }) => {
  // Use provided data or fallback to mock data
  const currentCpuUsage = data !== undefined ? data : 45;

  // Use history data if available, otherwise generate mock data
  const chartData = cpuInfo?.history ?
    // Map real history data
    cpuInfo.history.map((item: any) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      usage: item.usage
    })) :
    // Generate mock data
    [{
    time: '00:00',
    usage: 30
  }, {
    time: '01:00',
    usage: 28
  }, {
    time: '02:00',
    usage: 25
  }, {
    time: '03:00',
    usage: 32
  }, {
    time: '04:00',
    usage: 45
  }, {
    time: '05:00',
    usage: 62
  }, {
    time: '06:00',
    usage: 75
  }, {
    time: '07:00',
    usage: 82
  }, {
    time: '08:00',
    usage: 70
  }, {
    time: '09:00',
    usage: 55
  }, {
    time: '10:00',
    usage: 45
  }, {
    time: '11:00',
    usage: 50
  }, {
    time: '12:00',
    usage: currentCpuUsage
  }];
  const getLineColor = () => {
    if (currentCpuUsage >= 80) return '#ef4444'; // Red for high usage
    if (currentCpuUsage >= 60) return '#f59e0b'; // Amber for medium usage
    return '#10b981'; // Green for low usage
  };
  return <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{
      top: 5,
      right: 20,
      left: 0,
      bottom: 5
    }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis dataKey="time" tick={{
        fill: '#9ca3af'
      }} axisLine={{
        stroke: '#4b5563'
      }} />
        <YAxis tick={{
        fill: '#9ca3af'
      }} axisLine={{
        stroke: '#4b5563'
      }} domain={[0, 100]} tickFormatter={value => `${value}%`} />
        <Tooltip contentStyle={{
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        color: '#f9fafb'
      }} labelStyle={{
        color: '#f9fafb'
      }} formatter={value => [`${value}%`, 'CPU Usage']} />
        <Line type="monotone" dataKey="usage" stroke={getLineColor()} strokeWidth={2} dot={{
        fill: getLineColor(),
        strokeWidth: 2
      }} activeDot={{
        r: 6
      }} />
      </LineChart>
    </ResponsiveContainer>;
};
export default CPUChart;
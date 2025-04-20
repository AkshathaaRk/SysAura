import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
type DiskDataType = {
  name: string;
  used: number;
  total: number;
};

type DiskChartProps = {
  data?: DiskDataType[];
  diskInfo?: any;
};

const DiskChart: React.FC<DiskChartProps> = ({ data, diskInfo }) => {
  // Use real disk data if available, otherwise use provided data or fallback to mock data
  const diskData = diskInfo?.disks ?
    // Map real disk data
    diskInfo.disks.map((disk: any) => ({
      name: disk.name,
      used: disk.usedPercentage,
      total: 100,
      size: `${disk.size.toFixed(1)} GB`
    })) :
    data || [{
    name: '/ (root)',
    used: 75,
    total: 100
  }, {
    name: '/home',
    used: 50,
    total: 100
  }, {
    name: '/var',
    used: 30,
    total: 100
  }, {
    name: '/tmp',
    used: 15,
    total: 100
  }];
  const getBarColor = (used: number) => {
    if (used >= 80) return '#ef4444'; // Red
    if (used >= 60) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };
  return <ResponsiveContainer width="100%" height="100%">
      <BarChart data={diskData} margin={{
      top: 20,
      right: 30,
      left: 20,
      bottom: 5
    }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis dataKey="name" tick={{
        fill: '#9ca3af'
      }} axisLine={{
        stroke: '#4b5563'
      }} />
        <YAxis tick={{
        fill: '#9ca3af'
      }} axisLine={{
        stroke: '#4b5563'
      }} domain={[0, 100]} tickFormatter={value => `${value}%`} />
        <Tooltip formatter={value => [`${value}%`, 'Usage']} contentStyle={{
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        color: '#f9fafb'
      }} />
        <Bar dataKey="used" name="Used Space" radius={[4, 4, 0, 0]} maxBarSize={50}>
          {diskData.map((entry, index) => <Cell key={`cell-${index}`} fill={getBarColor(entry.used)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>;
};
export default DiskChart;
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
type NetworkChartProps = {
  incoming?: number;
  outgoing?: number;
  networkInfo?: any;
};

const NetworkChart: React.FC<NetworkChartProps> = ({ incoming, outgoing, networkInfo }) => {
  // Use provided data or fallback to mock data
  const currentIncoming = incoming !== undefined ? incoming : 4.0;
  const currentOutgoing = outgoing !== undefined ? outgoing : 2.2;

  // Use real network history if available, otherwise generate mock data
  const chartData = networkInfo?.history ?
    // Map real network history data
    networkInfo.history.map((item: any) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      incoming: item.incoming,
      outgoing: item.outgoing
    })) :
    // Generate mock data
    [{
    time: '00:00',
    incoming: 2.5,
    outgoing: 1.2
  }, {
    time: '01:00',
    incoming: 2.1,
    outgoing: 1.0
  }, {
    time: '02:00',
    incoming: 1.8,
    outgoing: 0.8
  }, {
    time: '03:00',
    incoming: 1.5,
    outgoing: 0.7
  }, {
    time: '04:00',
    incoming: 3.2,
    outgoing: 1.5
  }, {
    time: '05:00',
    incoming: 4.5,
    outgoing: 2.1
  }, {
    time: '06:00',
    incoming: 5.2,
    outgoing: 2.8
  }, {
    time: '07:00',
    incoming: 6.8,
    outgoing: 3.2
  }, {
    time: '08:00',
    incoming: 5.5,
    outgoing: 2.5
  }, {
    time: '09:00',
    incoming: 4.2,
    outgoing: 2.0
  }, {
    time: '10:00',
    incoming: 3.8,
    outgoing: 1.8
  }, {
    time: '11:00',
    incoming: 4.0,
    outgoing: 2.2
  }, {
    time: '12:00',
    incoming: currentIncoming,
    outgoing: currentOutgoing
  }];
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
      }} tickFormatter={value => `${value} MB/s`} />
        <Tooltip contentStyle={{
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        color: '#f9fafb'
      }} formatter={value => [`${value} MB/s`, '']} />
        <Legend formatter={value => <span className="text-gray-700 dark:text-gray-300">{value}</span>} />
        <Line type="monotone" dataKey="incoming" name="Incoming" stroke="#3b82f6" strokeWidth={2} dot={{
        fill: '#3b82f6',
        strokeWidth: 2
      }} activeDot={{
        r: 6
      }} />
        <Line type="monotone" dataKey="outgoing" name="Outgoing" stroke="#10b981" strokeWidth={2} dot={{
        fill: '#10b981',
        strokeWidth: 2
      }} activeDot={{
        r: 6
      }} />
      </LineChart>
    </ResponsiveContainer>;
};
export default NetworkChart;
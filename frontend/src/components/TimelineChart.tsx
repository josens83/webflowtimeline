import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendData } from '../types';
import { motion } from 'framer-motion';

interface TimelineChartProps {
  trends: TrendData[];
}

const COUNTRIES = {
  korea: { label: '한국', color: '#3b82f6' },
  usa: { label: '미국', color: '#ef4444' },
  japan: { label: '일본', color: '#8b5cf6' },
  china: { label: '중국', color: '#f59e0b' }
};

export default function TimelineChart({ trends }: TimelineChartProps) {
  // Group trends by decade
  const decadeGroups: { [key: string]: TrendData[] } = {};
  trends.forEach(trend => {
    if (!decadeGroups[trend.decade]) {
      decadeGroups[trend.decade] = [];
    }
    decadeGroups[trend.decade].push(trend);
  });

  // Prepare data for chart
  const chartData = Object.entries(decadeGroups).map(([decade, trends]) => {
    const data: any = { decade };

    trends.forEach(trend => {
      const country = COUNTRIES[trend.country];
      if (country) {
        data[country.label] = trend.websites.length;
      }
    });

    return data;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h3 className="text-2xl font-bold mb-6">시대별 웹사이트 수 추이</h3>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="decade"
            tick={{ fill: 'currentColor' }}
            label={{ value: '시대', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            tick={{ fill: 'currentColor' }}
            label={{ value: '웹사이트 수', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />
          <Legend />

          {Object.entries(COUNTRIES).map(([key, country]) => (
            <Line
              key={key}
              type="monotone"
              dataKey={country.label}
              stroke={country.color}
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(COUNTRIES).map(([key, country]) => {
          const totalWebsites = trends
            .filter(t => t.country === key)
            .reduce((sum, t) => sum + t.websites.length, 0);

          return (
            <div key={key} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold" style={{ color: country.color }}>
                {totalWebsites}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {country.label} 전체
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

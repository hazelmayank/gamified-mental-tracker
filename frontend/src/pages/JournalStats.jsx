import React, { useEffect, useState } from "react";
import api from "../axios";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";

import "./JournalStats.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";

const moodColors = {
  Happy: "#FFD700",
  Sad: "#00BFFF",
  Anxious: "#FF7F50",
  Angry: "#FF4C4C",
  Calm: "#8FBC8F",
  Motivated: "#FF8C00",
};

const habitColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#a4de6c",
  "#d0ed57"
];

export default function JournalStats() {
  const [moodTrends, setMoodTrends] = useState([]);
  const [habitTrends, setHabitTrends] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, calendarRes] = await Promise.all([
          api.get("/entries/stats"),
          api.get("/entries/calendar"),
        ]);

        // Convert mood and habit trend objects to arrays
        const moodObj = statsRes.data.moodTrends || {};
        const moodArr = Object.entries(moodObj).map(([name, value]) => ({
          name,
          value,
        }));

        const habitObj = statsRes.data.habitTrends || {};
        const habitArr = Object.entries(habitObj).map(([name, count]) => ({
          name,
          count,
        }));

        setMoodTrends(moodArr);
        setHabitTrends(habitArr);
        setHeatmapData(calendarRes.data.heatmap || []);
      } catch (err) {
        alert("Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="journal-stats-page">Loading...</div>;

  return (
    <div className="journal-stats-page">
      <h2 className="trend-title">📊 Your Journal Insights</h2>

      {/* Mood Chart */}
      <div className="chart-section">
        <h3>🧠 Mood Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={moodTrends}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {moodTrends.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={moodColors[entry.name] || "#ccc"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Habit Chart */}
      <div className="chart-section">
        <h3>💪 Habit Frequency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={habitTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d">
              {habitTrends.map((_, index) => (
                <Cell
                  key={index}
                  fill={habitColors[index % habitColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div className="trend-section">
        <h3 className="trend-subtitle">🔥 Your Activity Streak</h3>
        <CalendarHeatmap
          startDate={subDays(new Date(), 180)}
          endDate={new Date()}
          values={heatmapData}
          classForValue={(value) => {
            if (!value) return "color-empty";
            return `color-gitlab-${Math.min(value.count || value.value, 4)}`;
          }}
          tooltipDataAttrs={(value) =>
            value.date ? { "data-tip": `${value.date}` } : {}
          }
          showWeekdayLabels
        />
      </div>
    </div>
  );
}

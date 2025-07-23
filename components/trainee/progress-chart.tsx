"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface ProgressData {
  week: number
  technical: number
  behavioral: number
  overall: number
}

interface ProgressChartProps {
  data: ProgressData[]
}

export function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis 
            dataKey="week" 
            className="text-gray-600"
            tickFormatter={(value) => `Week ${value}`}
          />
          <YAxis 
            className="text-gray-600"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            formatter={(value, name) => {
              if (name === "overall") {
                return [`${value}%`, "Overall Progress"]
              }
              return [`${value}/10`, name === "technical" ? "Technical Skills" : "Behavioral Rating"]
            }}
            labelFormatter={(value) => `Week ${value}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="overall" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Overall Progress"
          />
          <Line 
            type="monotone" 
            dataKey="technical" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
            name="Technical Skills"
          />
          <Line 
            type="monotone" 
            dataKey="behavioral" 
            stroke="#f59e0b" 
            strokeWidth={2}
            dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
            name="Behavioral Rating"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
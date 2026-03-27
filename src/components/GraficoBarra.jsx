"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const formatCLP = (value) => `$${Number(value).toLocaleString("es-CL")}`;

export default function GraficoBarra({ data, xKey, yKey, horizontal = false }) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={horizontal ? Math.max(200, data.length * 60) : 300}>
        <BarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{
            top: 5,
            right: 30,
            left: horizontal ? 40 : 20,
            bottom: 5,
          }}
        >
          {horizontal ? (
            <>
              <YAxis
                dataKey={xKey}
                type="category"
                tickLine={false}
                axisLine={false}
                className="text-sm text-gray-600"
                width={130}
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                className="text-sm text-gray-600"
                tickFormatter={formatCLP}
              />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} tickLine={false} axisLine={false} className="text-sm text-gray-600" />
              <YAxis tickLine={false} axisLine={false} className="text-sm text-gray-600" tickFormatter={formatCLP} />
            </>
          )}
          <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} formatter={(value) => [formatCLP(value), '']} />
          <Bar dataKey={yKey} fill="#4F46E5" stroke="#3730A3" strokeWidth={1} cursor="pointer" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
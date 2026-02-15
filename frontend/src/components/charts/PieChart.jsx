// frontend/src/components/charts/PieChart.jsx
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <p style={{ margin: 0, fontWeight: '600', color: payload[0].payload.fill }}>
                    {payload[0].name}
                </p>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {payload[0].value} músicos ({payload[0].percent ? (payload[0].percent * 100).toFixed(0) : 0}%)
                </p>
            </div>
        );
    }
    return null;
};

const PieChart = ({ data, dataKey = "value", nameKey = "name" }) => {
    const COLORS = ['#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#1abc9c', '#95a5a6'];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <RechartsPieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey={dataKey}
                        nameKey={nameKey}
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>}
                    />
                </RechartsPieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChart;

// frontend/src/components/charts/LineChart.jsx
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label, unit, color }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                padding: '10px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-primary)' }}>{label}</p>
                <p style={{ margin: 0, color: color || '#D4AF37' }}>
                    {payload[0].value} {unit}
                </p>
            </div>
        );
    }
    return null;
};

const LineChart = ({
    data,
    dataKey = "total",
    xAxisKey = "data",
    color = "#D4AF37",
    unit = "downloads"
}) => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <RechartsLineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                    <XAxis
                        dataKey={xAxisKey}
                        stroke="var(--text-secondary)"
                        fontSize={12}
                        tickMargin={10}
                        tickFormatter={(value) => {
                            // Formata data YYYY-MM-DD para DD/MM
                            if (value && value.includes('-')) {
                                const parts = value.split('-');
                                return `${parts[2]}/${parts[1]}`;
                            }
                            return value;
                        }}
                    />
                    <YAxis stroke="var(--text-secondary)" fontSize={12} />
                    <Tooltip content={<CustomTooltip unit={unit} color={color} />} />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={3}
                        dot={{ r: 4, fill: color, strokeWidth: 2, stroke: 'var(--bg-primary)' }}
                        activeDot={{ r: 6 }}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChart;

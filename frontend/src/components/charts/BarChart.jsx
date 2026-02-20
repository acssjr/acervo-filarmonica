// frontend/src/components/charts/BarChart.jsx
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
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
                <p style={{ margin: 0, color: payload[0].payload.fill || '#3498db' }}>
                    {payload[0].value} {payload[0].dataKey === 'porcentagem_media' ? '%' : ''}
                </p>
            </div>
        );
    }
    return null;
};

const BarChart = ({ data, dataKey = "total", xAxisKey = "name", colors = [] }) => {
    // Cores padrão se não fornecidas
    const defaultColors = ['#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71'];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <RechartsBarChart data={data} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} opacity={0.5} />
                    <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} hide />
                    <YAxis
                        type="category"
                        dataKey={xAxisKey}
                        stroke="var(--text-secondary)"
                        fontSize={12}
                        width={100}
                        tick={{ fill: 'var(--text-primary)' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-secondary)', opacity: 0.4 }} />
                    <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length] || defaultColors[index % defaultColors.length]} />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChart;

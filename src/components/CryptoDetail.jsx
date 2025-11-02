import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function CryptoDetail({ coin }) {
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!coin) return;
    let mounted = true;
    const loadChart = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=14&interval=daily`);
        if (!res.ok) throw new Error('Chart fetch failed');
        const payload = await res.json();
        const labels = payload.prices.map(p => new Date(p[0]).toLocaleDateString());
        const data = payload.prices.map(p => p[1]);
        if (mounted) setChart({ labels, data });
      } catch (e) {
        if (mounted) setErr(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadChart();
    return () => mounted = false;
  }, [coin]);

  if (!coin) {
    return <div className="card small">Pilih koin dari tabel untuk melihat detail.</div>;
  }

  return (
    <div className="card">
      <div className="detail-header">
        <div>
          <h3>{coin.name}</h3>
          <div className="small">Rank #{coin.market_cap_rank}</div>
        </div>
        <div className="price-strong">${coin.current_price.toLocaleString()}</div>
      </div>

      <div style={{ marginTop: 8 }}>
        {loading && <div className="small">Loading chart...</div>}
        {err && <div className="small">Error: {err}</div>}
        {chart && (
          <Line
            data={{
              labels: chart.labels,
              datasets: [{
                label: `${coin.symbol.toUpperCase()} price (USD)`,
                data: chart.data,
                tension: 0.25,
                fill: false
              }]
            }}
            options={{ responsive: true, plugins: { legend: { display: true } } }}
            height={200}
          />
        )}
      </div>
    </div>
  );
}

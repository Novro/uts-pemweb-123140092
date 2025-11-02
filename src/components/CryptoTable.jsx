import React from 'react';

// format numbers (K, M, B)
const fmt = (n) => {
  if (n === null || n === undefined) return '-';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toFixed(2);
};

export default function CryptoTable({ data, onSelect }) {
  return (
    <div className="card">
      <h3>Top Cryptocurrencies</h3>
      <table className="crypto-table" aria-label="crypto-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (USD)</th>
            <th>Market Cap</th>
            <th>24h</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr><td colSpan="4" className="small">No data — coba refresh atau ubah filter.</td></tr>
          )}
          {data.map(c => (
            <tr key={c.id} onClick={() => onSelect(c)} role="button" tabIndex="0">
              <td className="name-cell">
                <img src={c.image} alt={`${c.name} logo`} width="28" height="28" />
                <div>
                  <div className="strong">{c.name}</div>
                  <div className="small">{c.symbol.toUpperCase()}</div>
                </div>
              </td>
              <td>${c.current_price.toLocaleString()}</td>
              <td>${fmt(c.market_cap)}</td>
              <td className={c.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                {c.price_change_percentage_24h != null ? c.price_change_percentage_24h.toFixed(2) + '%' : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

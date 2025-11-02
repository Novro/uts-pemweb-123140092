import React from 'react';

export default function Header({ onRefresh, loading, lastUpdated }) {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">CG</div>
        <div>
          <div className="title">Aufa Crypto Tracker</div>
          <div className="subtitle">Realtime prices with CoinGecko</div>
        </div>
      </div>
      <div className="header-controls">
        <div className="small">{lastUpdated ? `Updated: ${lastUpdated}` : 'Not updated'}</div>
        <button onClick={onRefresh} disabled={loading} aria-label="Refresh">
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
    </header>
  );
}

import React from 'react';

/*
  Filter form contains >=5 inputs:
  - text search (text)
  - min price (number)
  - max price (number)
  - order (select)
  - onlyPositive (checkbox)
  Uses HTML5 attributes for validation where applicable.
*/
export default function FilterForm({ filters, setFilters, onApply }) {
  const update = (k, v) => setFilters(prev => ({ ...prev, [k]: v }));

  return (
    <form className="card form" onSubmit={(e) => { e.preventDefault(); onApply(); }}>
      <h3>Filter & Search</h3>
      <div className="filter-row">
        <input
          type="text"
          placeholder="Search name or symbol"
          value={filters.q}
          onChange={(e) => update('q', e.target.value)}
          aria-label="search"
        />

        <input
          type="number"
          placeholder="Min price (USD)"
          value={filters.min}
          onChange={(e) => update('min', e.target.value === '' ? '' : Number(e.target.value))}
          min="0"
          aria-label="min-price"
        />

        <input
          type="number"
          placeholder="Max price (USD)"
          value={filters.max}
          onChange={(e) => update('max', e.target.value === '' ? '' : Number(e.target.value))}
          min="0"
          aria-label="max-price"
        />

        <select value={filters.order} onChange={(e) => update('order', e.target.value)} aria-label="order">
          <option value="market_cap_desc">Top Market Cap</option>
          <option value="market_cap_asc">Small Cap</option>
          <option value="volume_desc">Volume</option>
        </select>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.onlyPositive}
            onChange={(e) => update('onlyPositive', e.target.checked)}
            aria-label="only-positive"
          />
          24h &gt; 0
        </label>
      </div>

      <div className="form-actions">
        <button type="submit">Apply</button>
        <button type="button" className="secondary" onClick={() => setFilters({ q: '', min: '', max: '', order: 'market_cap_desc', onlyPositive: false })}>
          Reset
        </button>
      </div>

      <div className="small">Gunakan filter untuk memperkecil daftar koin berdasarkan range harga.</div>
    </form>
  );
}
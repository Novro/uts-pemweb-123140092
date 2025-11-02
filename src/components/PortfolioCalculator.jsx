import React, { useState } from 'react';

export default function PortfolioCalculator({ selected }) {
  const [amount, setAmount] = useState('');
  const total = selected && amount ? (selected.current_price * Number(amount)) : 0;

  return (
    <div className="card portfolio">
      <h3>Portfolio Calculator</h3>
      <div className="small">Pilih koin dari tabel, masukkan jumlah koin untuk melihat total nilai (USD).</div>

      <label className="small">Selected</label>
      <select disabled className="full-width">
        <option>{selected ? `${selected.name} (${selected.symbol.toUpperCase()})` : 'No coin selected'}</option>
      </select>

      <label className="small">Amount</label>
      <input
        type="number"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Jumlah koin (misal: 0.5)"
      />

      <div className="result">
        <div className="small">Total Value</div>
        <div className="price-strong">${total ? total.toLocaleString() : '0.00'}</div>
      </div>
    </div>
  );
}

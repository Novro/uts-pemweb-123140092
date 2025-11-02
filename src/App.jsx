import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import FilterForm from './components/FilterForm';
import CryptoTable from './components/CryptoTable';
import CryptoDetail from './components/CryptoDetail';
import PortfolioCalculator from './components/PortfolioCalculator';

/*
  Main App:
  - fetch coins (CoinGecko /coins/markets)
  - client-side filtering (reduce API calls)
  - select coin shows detail & chart
*/
export default function App() {
  const [coins, setCoins] = useState([]);
  const [rawCoins, setRawCoins] = useState([]); // keep original fetched list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: '',
    min: '',
    max: '',
    order: 'market_cap_desc',
    onlyPositive: false
  });
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCoins = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const qs = `vs_currency=usd&order=${filters.order}&per_page=50&page=1&sparkline=false`;
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?${qs}`, { signal });
      if (!res.ok) throw new Error('Failed to fetch coins');
      const data = await res.json();
      const transformed = data.map(d => ({
        id: d.id,
        symbol: d.symbol,
        name: d.name,
        image: d.image,
        current_price: d.current_price,
        market_cap: d.market_cap,
        price_change_percentage_24h: d.price_change_percentage_24h,
        market_cap_rank: d.market_cap_rank
      }));
      setRawCoins(transformed);
      setCoins(transformed);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.order]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchCoins(ctrl.signal);
    return () => ctrl.abort();
  }, [fetchCoins]);

  // apply client-side filters
  const applyFilters = () => {
    const { q, min, max, onlyPositive } = filters;
    const out = rawCoins.filter(c => {
      if (q && !`${c.name} ${c.symbol}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (min !== '' && c.current_price < Number(min)) return false;
      if (max !== '' && c.current_price > Number(max)) return false;
      if (onlyPositive && (c.price_change_percentage_24h === null || c.price_change_percentage_24h <= 0)) return false;
      return true;
    });
    setCoins(out);
  };

  const handleRefresh = async () => {
    const ctrl = new AbortController();
    await fetchCoins(ctrl.signal);
  };

  return (
    <div className="app-root">
      <Header onRefresh={handleRefresh} loading={loading} lastUpdated={lastUpdated} />
      <main className="container">
        <div className="grid">
          <section>
            <FilterForm filters={filters} setFilters={setFilters} onApply={applyFilters} />
            <div style={{ height: 12 }} />
            <CryptoTable data={coins} onSelect={(c) => setSelectedCoin(c)} />
            {error && <div className="card error">Error: {error}</div>}
            <div className="card small">
              <strong>Instructions:</strong>
              <ol>
                <li>Click a row to see details and chart.</li>
                <li>Use filter form, then Apply.</li>
                <li>Use Portfolio on the right to calculate value.</li>
              </ol>
            </div>
          </section>

          <aside>
            <CryptoDetail coin={selectedCoin} />
            <PortfolioCalculator selected={selectedCoin} />
          </aside>
        </div>
      </main>

      <footer className="footer">
        Built for CPMK0501/CPMK0502 — NIM akhir: 2
      </footer>
    </div>
  );
}

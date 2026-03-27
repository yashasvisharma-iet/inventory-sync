import React, { useEffect, useMemo, useState } from 'react';

function BillingInventory() {
  const backendBaseUrl = useMemo(
    () => (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').replace(/\/$/, ''),
    []
  );

  const [state, setState] = useState({ loading: true, error: null, products: [] });

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(`${backendBaseUrl}/billing/products`);
        if (!response.ok) {
          throw new Error(`Billing products fetch failed (${response.status})`);
        }

        const payload = await response.json();
        if (!cancelled) {
          setState({ loading: false, error: null, products: payload.products || [] });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ loading: false, error: error.message, products: [] });
        }
      }
    }

    loadProducts();
    const pollId = setInterval(loadProducts, 30000);

    return () => {
      cancelled = true;
      clearInterval(pollId);
    };
  }, [backendBaseUrl]);

  const sectionClass = 'mx-auto my-8 w-[92%] max-w-6xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm';

  if (state.loading) {
    return <section className={sectionClass}>Loading billing inventory...</section>;
  }

  if (state.error) {
    return <section className={`${sectionClass} border-red-200 bg-red-50 text-red-700`}>Unable to load billing inventory: {state.error}</section>;
  }

  return (
    <section className={sectionClass}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Billing Sheet Inventory (live)</h2>
        <a
          href={`${backendBaseUrl}/billing/template`}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
        >
          Download CSV template
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-600">
              <th className="py-2 pr-3">SKU</th>
              <th className="py-2 pr-3">Item</th>
              <th className="py-2 pr-3">Size</th>
              <th className="py-2 pr-3">Color</th>
              <th className="py-2 pr-3">Stock</th>
              <th className="py-2 pr-3">Price</th>
              <th className="py-2 pr-3">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {state.products.map((product) => (
              <tr key={product.ItemCode} className="border-b border-slate-100 text-slate-800">
                <td className="py-2 pr-3 font-medium">{product.ItemCode}</td>
                <td className="py-2 pr-3">{product.ItemName}</td>
                <td className="py-2 pr-3">{product.Size}</td>
                <td className="py-2 pr-3">{product.Color}</td>
                <td className="py-2 pr-3">{product.StockQty}</td>
                <td className="py-2 pr-3">₹{product.Price}</td>
                <td className="py-2 pr-3">{new Date(product.LastUpdated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default BillingInventory;

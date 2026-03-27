'use strict';

const REQUIRED_HEADERS = [
  'ItemCode',
  'ItemName',
  'Size',
  'Color',
  'StockQty',
  'Price',
  'LastUpdated'
];

function parseCsv(csvText = '') {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    throw new Error('CSV is empty.');
  }

  const headers = parseCsvLine(lines[0]);
  validateHeaders(headers);

  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, i) => [header, values[i] ?? '']));

    return {
      ItemCode: String(row.ItemCode || '').trim(),
      ItemName: String(row.ItemName || '').trim(),
      Size: String(row.Size || '').trim(),
      Color: String(row.Color || '').trim(),
      StockQty: Number(row.StockQty || 0),
      Price: Number(row.Price || 0),
      LastUpdated: normalizeIsoDate(row.LastUpdated)
    };
  }).filter((row) => row.ItemCode);
}

function toCsv(products = []) {
  const headerLine = REQUIRED_HEADERS.join(',');
  const rows = products.map((product) => REQUIRED_HEADERS.map((header) => escapeCsvValue(product[header])).join(','));
  return [headerLine, ...rows].join('\n');
}

function validateHeaders(headers) {
  for (const expected of REQUIRED_HEADERS) {
    if (!headers.includes(expected)) {
      throw new Error(`CSV is missing required column: ${expected}`);
    }
  }
}

function normalizeIsoDate(value) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) {
    return new Date().toISOString();
  }
  return new Date(timestamp).toISOString();
}

function parseCsvLine(line = '') {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

function escapeCsvValue(value) {
  const safe = value == null ? '' : String(value);
  if (!safe.includes(',') && !safe.includes('"') && !safe.includes('\n')) {
    return safe;
  }

  return `"${safe.replace(/"/g, '""')}"`;
}

module.exports = {
  REQUIRED_HEADERS,
  parseCsv,
  toCsv
};

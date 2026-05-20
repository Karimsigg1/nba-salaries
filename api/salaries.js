// Vercel serverless function — proxies BallDontLie so the API key
// stays server-side and CORS is never an issue for the browser.
export default async function handler(req, res) {
  // Allow the browser to call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const season = parseInt(req.query.season) || 2026;

  // Validate season range
  if (season < 2026 || season > 2029) {
    return res.status(400).json({ error: 'Season must be 2026–2029' });
  }

  const API_KEY = process.env.BALLDONTLIE_API_KEY;
  const BASE = 'https://api.balldontlie.io/nba/v1';

  try {
    let allContracts = [];
    let cursor = null;

    // Paginate through all contracts for this season
    while (true) {
      const url = `${BASE}/contracts?season=${season}&per_page=100` +
        (cursor ? `&cursor=${cursor}` : '');

      const apiRes = await fetch(url, {
        headers: { Authorization: API_KEY }
      });

      if (!apiRes.ok) {
        const text = await apiRes.text();
        return res.status(apiRes.status).json({
          error: `BallDontLie API error: ${apiRes.status}`,
          detail: text
        });
      }

      const json = await apiRes.json();
      allContracts = allContracts.concat(json.data || []);

      if (!json.meta?.next_cursor) break;
      cursor = json.meta.next_cursor;
    }

    return res.status(200).json({ data: allContracts, season });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

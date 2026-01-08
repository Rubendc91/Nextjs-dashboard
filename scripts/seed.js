// Seed helper: calls the app's /seed route.
// Usage: `node -r dotenv/config ./scripts/seed.js`

(async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = process.env.SEED_HOST || `http://localhost:${port}`;
    const url = `${host.replace(/\/$/, '')}/seed`;

    console.log(`Calling seed endpoint: ${url}`);
    const res = await fetch(url, { method: 'GET' });

    if (!res.ok) {
      const text = await res.text().catch(() => null);
      console.error('Seed endpoint returned error:', res.status, text || await res.text());
      process.exit(1);
    }

    const json = await res.json().catch(() => null);
    console.log('Seed result:', json || 'No JSON response');
    process.exit(0);
  } catch (err) {
    console.error('Failed to call seed endpoint. Is your dev server running?');
    console.error('Start it with: pnpm dev');
    console.error('Then re-run: pnpm run seed');
    console.error('Detailed error:', err);
    process.exit(1);
  }
})();

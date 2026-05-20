export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams?limit=32');
    const data = await response.json();
    const teams = data.sports[0].leagues[0].teams.map(t => ({
      team: t.team.displayName,
      abbreviation: t.team.abbreviation,
      logo: t.team.logos?.[0]?.href || '',
      color: t.team.color || '1a1f2e',
      players: []
    }));
    res.status(200).json({ teams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams?limit=32');
    const data = await response.json();
    const teams = await Promise.all(
      data.sports[0].leagues[0].teams.map(async (t) => {
        const team = t.team;
        const rosterRes = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${team.id}/roster`);
        const rosterData = await rosterRes.json();
        const athletes = rosterData.athletes || [];
        const players = athletes.flatMap(g => g.items || []).map(p => ({
          name: p.displayName,
          position: p.position?.abbreviation || 'N/A',
          jersey: p.jersey || '-',
        }));
        return { team: team.displayName, abbreviation: team.abbreviation, logo: team.logos?.[0]?.href || '', players };
      })
    );
    res.status(200).json({ teams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

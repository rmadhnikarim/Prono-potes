exports.handler = async function (event, context) {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Clé API manquante. Vérifie la variable FOOTBALL_API_KEY dans Netlify." }),
    };
  }

  const params = event.queryStringParameters || {};
  const competition = params.competition || "FL1";
  const matchday = params.matchday;
  const stage = params.stage;

  let url = `https://api.football-data.org/v4/competitions/${competition}/matches`;
  const queryParts = [];
  if (matchday) queryParts.push(`matchday=${matchday}`);
  if (stage) queryParts.push(`stage=${stage}`);
  if (queryParts.length) url += `?${queryParts.join('&')}`;

  try {
    const response = await fetch(url, {
      headers: { "X-Auth-Token": API_KEY },
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Erreur API football-data.org", details: errText }),
      };
    }

    const data = await response.json();

    const matchs = (data.matches || []).map((m) => ({
      id: m.id,
      journee: m.matchday,
      stage: m.stage,
      dom: m.homeTeam.shortName || m.homeTeam.name,
      ext: m.awayTeam.shortName || m.awayTeam.name,
      heure: m.utcDate,
      statut: m.status,
      scoreDom: m.score.fullTime.home,
      scoreExt: m.score.fullTime.away,
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ matchs }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur", details: e.message }),
    };
  }
};

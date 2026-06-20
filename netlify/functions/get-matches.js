// Fonction Netlify qui va chercher les matchs de Ligue 1 sur football-data.org
// et les renvoie dans un format simple pour l'appli.

exports.handler = async function (event, context) {
  const API_KEY = process.env.FOOTBALL_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Clé API manquante. Vérifie la variable FOOTBALL_API_KEY dans Netlify." }),
    };
  }

  // Compétition demandée en query string, par défaut Ligue 1 (FL1)
  const competition = (event.queryStringParameters && event.queryStringParameters.competition) || "FL1";
  const matchday = event.queryStringParameters && event.queryStringParameters.matchday;

  let url = `https://api.football-data.org/v4/competitions/${competition}/matches`;
  if (matchday) {
    url += `?matchday=${matchday}`;
  }

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

    // On simplifie la réponse pour l'appli
    const matchs = (data.matches || []).map((m) => ({
      id: m.id,
      journee: m.matchday,
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

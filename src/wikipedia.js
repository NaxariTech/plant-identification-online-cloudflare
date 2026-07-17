const USER_AGENT = "PlantIdentificationOnline/2.0 (https://plant-identification-online.workers.dev)";

const HISTORY_KEYWORDS = [
  "first described",
  "history",
  "historically",
  "ancient",
  "native to",
  "native throughout",
  "originated in",
  "indigenous to",
  "endemic to",
  "found in",
  "distributed in",
  "grew in",
  "the indigenous range",
  "antiquity",
  "grows natively",
  "habitat",
  "china",
  "us",
  "america",
  "india",
  "pakistan",
  "rare",
];

const BENEFITS_KEYWORDS = [
  "medicinal",
  "medicine",
  "used for",
  "used in",
  "used as",
  "edible",
  "food",
  "fruit",
  "oil",
  "tea",
  "herbal",
  "treatment",
  "ornamental",
  "timber",
  "wood",
  "essential oil",
  "health benefits",
];

function extractSentences(text, keywords) {
  const sentences = text.split(".");
  const results = [];

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();

    for (const keyword of keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        const cleanSentence = `${sentence.trim()}.`;

        if (cleanSentence !== "." && !results.includes(cleanSentence)) {
          results.push(cleanSentence);
        }

        break;
      }
    }
  }

  return results;
}

export async function getWikipediaSummary(plantName) {
  try {
    const encodedName = encodeURIComponent(plantName.replace(/ /g, "_"));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedName}`;

    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });

    if (response.ok) {
      const data = await response.json();
      return data.extract || "No description available.";
    }

    return "No Wikipedia information available.";
  } catch {
    return "Unable to retrieve plant information.";
  }
}

async function getWikipediaExtract(plantName) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("prop", "extracts");
  url.searchParams.set("explaintext", "1");
  url.searchParams.set("format", "json");
  url.searchParams.set("titles", plantName);

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    return "";
  }

  const data = await response.json();
  const pages = data.query?.pages;

  if (!pages) {
    return "";
  }

  const page = Object.values(pages)[0];
  return page.extract || "";
}

export async function getHistory(plantName) {
  try {
    const text = await getWikipediaExtract(plantName);

    if (!text) {
      return "Information will be added in a future update.";
    }

    const results = extractSentences(text, HISTORY_KEYWORDS);

    if (results.length > 0) {
      return `\n\n• ${results.join("\n\n• ")}`;
    }

    return "Information will be added in a future update.";
  } catch {
    return "Information will be added in a future update.";
  }
}

export async function getBenefits(plantName) {
  try {
    const text = await getWikipediaExtract(plantName);

    if (!text) {
      return "Information will be added in a future update.";
    }

    const results = extractSentences(text, BENEFITS_KEYWORDS);

    if (results.length > 0) {
      return `\n\n• ${results.join("\n\n• ")}`;
    }

    return "Information will be added in a future update.";
  } catch {
    return "Information will be added in a future update.";
  }
}

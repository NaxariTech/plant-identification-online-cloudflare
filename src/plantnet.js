import { getBenefits, getHistory, getWikipediaSummary } from "./wikipedia.js";

export async function identifyPlant(imageFile, apiKey) {
  const plantnetUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`;

  const formData = new FormData();
  formData.append("images", imageFile, imageFile.name || "plant.jpg");
  formData.append("organs", "auto");

  const response = await fetch(plantnetUrl, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.results?.length) {
    return {
      found: false,
      commonName: "Plant Not Found",
      scientificName: "",
      familyName: "",
      confidence: 0,
      wikiSummary: "",
      history: "",
      benefits: "",
    };
  }

  const best = result.results[0];
  const confidence = Math.round(best.score * 10000) / 100;
  const scientificName = best.species.scientificNameWithoutAuthor;
  const familyName = best.species.family.scientificNameWithoutAuthor;
  const commonNames = best.species.commonNames || [];
  const commonName =
    commonNames.length > 0 ? commonNames[0] : "No common name found";

  const lookupName =
    commonName !== "No common name found" ? commonName : scientificName;

  const [wikiSummary, history, benefits] = await Promise.all([
    getWikipediaSummary(lookupName),
    getHistory(lookupName),
    getBenefits(lookupName),
  ]);

  return {
    found: true,
    commonName,
    scientificName,
    familyName,
    confidence,
    wikiSummary,
    history,
    benefits,
  };
}

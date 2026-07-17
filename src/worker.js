import { identifyPlant } from "./plantnet.js";

const PAGE_ROUTES = {
  "/about": "/about.html",
  "/contact": "/contact.html",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

async function serveStaticAsset(request, env, assetPath) {
  const assetUrl = new URL(assetPath, request.url);
  return env.ASSETS.fetch(new Request(assetUrl, request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/identify" && request.method === "POST") {
      try {
        const apiKey = env.PLANTNET_API_KEY;

        if (!apiKey) {
          return jsonResponse(
            { error: "Plant identification service is not configured." },
            500,
          );
        }

        const formData = await request.formData();
        const image = formData.get("plantImage");

        if (!image || typeof image === "string") {
          return jsonResponse({ error: "Please upload a plant image." }, 400);
        }

        const result = await identifyPlant(image, apiKey);
        return jsonResponse(result);
      } catch (error) {
        console.error("Identification failed:", error);
        return jsonResponse(
          { error: "Unable to identify the plant. Please try again." },
          500,
        );
      }
    }

    if (url.pathname === "/api/identify" && request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, 405);
    }

    if (PAGE_ROUTES[url.pathname]) {
      return serveStaticAsset(request, env, PAGE_ROUTES[url.pathname]);
    }

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return serveStaticAsset(request, env, "/index.html");
    }

    return env.ASSETS.fetch(request);
  },
};

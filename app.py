from flask import Flask, render_template, request
import os
import requests
app = Flask(__name__)

UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

API_KEY = "2b10RmSbz4eqs50XMgTz7kDfO"

def get_wikipedia_summary(plant_name):

    try:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{plant_name}"

        response = requests.get(
            url,
            headers={
                "User-Agent": "PlantIdentificationOnline/1.0"
            }
        )

        if response.status_code == 200:
            data = response.json()
            return data.get("extract", "No description available.")

        return "No Wikipedia information available."

    except Exception:
        return "Unable to retrieve plant information."
    
def get_history(plant_name):

    try:

        url = (
            "https://en.wikipedia.org/w/api.php"
            "?action=query"
            "&prop=extracts"
            "&explaintext=1"
            "&format=json"
            f"&titles={plant_name}"
        )

        response = requests.get(
            url,
            headers={
                "User-Agent": "PlantIdentificationOnline/1.0"
            }
        )

        if response.status_code == 200:

            data = response.json()

            pages = data["query"]["pages"]

            page = next(iter(pages.values()))

            text = page.get("extract", "")

            sentences = text.split(".")

            keywords = [
                "first described",
                "history",
                "historically",
                "ancient"
                #Region
                "native to",
                "native throughout",
                "originated in",
                "indigenous to",
                "endemic to",
                "found in",
                "distributed in"
                "grew in",
                "The indigenous range",
                "Antiquity",
                "grows natively",
                "habitat",
                "china",
                "US"
                "America"
                "India"
                "Pakistan"
                "rare"
            ]

            results = []

            for sentence in sentences:
                for keyword in keywords:
                    if keyword.lower() in sentence.lower():

                        clean_sentence = sentence.strip() + "."

                        if clean_sentence not in results:
                            results.append(clean_sentence)

                        break

            if results:
                return "\n\n• " + "\n\n• ".join(results)

            return "Information will be added in a future update."
        
    except Exception:
        return "Information will be added in a future update."

def get_benefits(plant_name):

    try:

        url = (
            "https://en.wikipedia.org/w/api.php"
            "?action=query"
            "&prop=extracts"
            "&explaintext=1"
            "&format=json"
            f"&titles={plant_name}"
        )

        response = requests.get(
            url,
            headers={
                "User-Agent": "PlantIdentificationOnline/1.0"
            }
        )

        if response.status_code == 200:

            data = response.json()

            pages = data["query"]["pages"]

            page = next(iter(pages.values()))

            text = page.get("extract", "")

            sentences = text.split(".")

            keywords = [
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
                "essential oil"
                "health benifits"
            ]

            results = []

            for sentence in sentences:

                for keyword in keywords:

                    if keyword.lower() in sentence.lower():

                        clean_sentence = sentence.strip() + "."

                        if clean_sentence not in results:
                            results.append(clean_sentence)

                        break

            if results:
                return "\n\n• " + "\n\n• ".join(results)

        return "Information will be added in a future update."

    except Exception:
        return "Information will be added in a future update."
    
@app.route("/", methods=["GET", "POST"])
def home():

    image_name = None
    common_name = None
    scientific_name = None
    family_name = None
    confidence = None
    wiki_summary = None
    history = None
    benefits = None

    if request.method == "POST":

        image = request.files.get("plantImage")

        if image and image.filename != "":

            image_path = os.path.join(app.config["UPLOAD_FOLDER"], image.filename)

            image.save(image_path)

            image_name = image.filename

            url = f"https://my-api.plantnet.org/v2/identify/all?api-key={API_KEY}"

            files = [
                (
                    "images",
                    (image.filename, open(image_path, "rb"))
                )
            ]

            data = {
                "organs": ["auto"]
            }

            response = requests.post(
                url,
                files=files,
                data=data
            )

            result = response.json()

            if response.status_code == 200 and len(result["results"]) > 0:

                best = result["results"][0]

                confidence = round(best["score"] * 100, 2)

                scientific_name = best["species"]["scientificNameWithoutAuthor"]

                family_name = best["species"]["family"]["scientificNameWithoutAuthor"]

                common_names = best["species"]["commonNames"]

                if len(common_names) > 0:
                    common_name = common_names[0]
                else:
                    common_name = "No common name found"

                # Get Wikipedia summary
                if common_name != "No common name found":
                    wiki_summary = get_wikipedia_summary(common_name)
                else:
                    wiki_summary = get_wikipedia_summary(scientific_name)

                 # History
                if common_name != "No common name found":
                    history = get_history(common_name)
                else:
                    history = get_history(scientific_name)

                 # Benefits
                if common_name != "No common name found":
                    benefits = get_benefits(common_name)
                else:
                    benefits = get_benefits(scientific_name)

            else:
                common_name = "Plant Not Found"
                scientific_name = ""
                family_name = ""
                confidence = 0
                wiki_summary = ""
                history = ""
                benefits = ""
                
                care_tips = "keep the plant in suitable sunlight, water it regularly, and use  well-drained soil."
                
    return render_template(
        "index.html",
        image_name=image_name,
        common_name=common_name,
        scientific_name=scientific_name,
        family_name=family_name,
        confidence=confidence,
        wiki_summary=wiki_summary,
        history=history,
        benefits=benefits,
    )

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

if __name__ == "__main__":
    app.run(debug=True)
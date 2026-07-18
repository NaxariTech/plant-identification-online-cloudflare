let currentImageUrl = null;

function showLoading() {
  document.getElementById("loading").style.display = "block";
  document.getElementById("results").style.display = "none";
  document.getElementById("errorMessage").style.display = "none";

  let progress = 0;
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  progressBar.style.width = "0%";
  progressText.innerHTML = "0%";

  if (window.loadingInterval) {
    clearInterval(window.loadingInterval);
  }

  window.loadingInterval = setInterval(function () {
    progress = Math.min(progress + 5, 95);
    progressBar.style.width = progress + "%";
    progressText.innerHTML = progress + "%";
  }, 150);
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";

  if (window.loadingInterval) {
    clearInterval(window.loadingInterval);
    window.loadingInterval = null;
  }

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  progressBar.style.width = "100%";
  progressText.innerHTML = "100%";
}

function showError(message) {
  const errorEl = document.getElementById("errorMessage");
  errorEl.textContent = message;
  errorEl.style.display = "block";
  document.getElementById("results").style.display = "none";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderNotFound() {
  return `
    <div class="result">
      <h2 style="color:#d32f2f;">❌ Plant Not Found</h2>
      <p>Please upload a clear image of a plant.</p>
    </div>
  `;
}

function renderSuccess(data, imageUrl) {
  return `
    <hr>
    <h2>Plant Identification Result</h2>

    <div class="plant-result">
      <div class="plant-info result-info">
        <p><strong>Common Name:</strong> ${escapeHtml(data.commonName)}</p>
        <p><strong>Scientific Name:</strong> ${escapeHtml(data.scientificName)}</p>
        <p><strong>Family:</strong> ${escapeHtml(data.familyName)}</p>
        <p><strong>Confidence:</strong> ${data.confidence}%</p>
      </div>

      <div class="plant-image">
        <img src="${imageUrl}" class="image-uploaded plant-image" alt="Uploaded Plant">
      </div>
    </div>

    <div class="progress">
      <div class="progress-bar" style="width:${data.confidence}%;">
        ${data.confidence}%
      </div>
    </div>

    <button id="shareBtn" type="button" onclick="shareResult()">
      🔗 Share Result
    </button>

    <div class="learn-more">
      <button type="button" class="learn-more-btn" onclick="toggleLearnMore()">
        🌿 Learn More About This Plant
        <span id="arrow">▼</span>
      </button>

      <div id="plant-details" class="plant-details">
        <div class="info-card">
          <h3>📖 Description</h3>
          <p>${escapeHtml(data.wikiSummary)}</p>
        </div>

        <div class="info-card">
          <h3>📜 History &amp; Region</h3>
          <p style="white-space: pre-line;">${escapeHtml(data.history)}</p>
        </div>

        <div class="info-card">
          <h3>❤️ Benefits &amp; Uses</h3>
          <p style="white-space: pre-line;">${escapeHtml(data.benefits)}</p>
        </div>
      </div>
    </div>
  `;
}

function displayResults(data, imageUrl) {
  const resultsEl = document.getElementById("results");
  const contentEl = document.getElementById("resultContent");

  if (!data.found || data.commonName === "Plant Not Found") {
    contentEl.innerHTML = renderNotFound();
  } else {
    contentEl.innerHTML = renderSuccess(data, imageUrl);
  }

  resultsEl.style.display = "block";
  resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function identifyPlant(event) {
  event.preventDefault();

  const fileInput = document.getElementById("plantImage");
  const submitBtn = document.getElementById("submitBtn");
  const file = fileInput.files[0];

  if (!file) {
    showError("Please select a plant image first.");
    return;
  }

  if (currentImageUrl) {
    URL.revokeObjectURL(currentImageUrl);
  }

  currentImageUrl = URL.createObjectURL(file);

  showLoading();
  submitBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append("plantImage", file);

    const response = await fetch("/api/identify", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Identification failed.");
    }

    displayResults(data, currentImageUrl);
  } catch (error) {
    showError(error.message || "Something went wrong. Please try again.");
  } finally {
    hideLoading();
    submitBtn.disabled = false;
  }
}

function toggleLearnMore() {
  const details = document.getElementById("plant-details");
  const arrow = document.getElementById("arrow");

  if (!details || !arrow) {
    return;
  }

  details.classList.toggle("show");
  arrow.innerHTML = details.classList.contains("show") ? "▲" : "▼";
}

function shareResult() {
  const resultInfo = document.querySelector(".plant-info");

  if (!resultInfo) {
    return;
  }

  const shareText = `🌿 Plant Identification Result

${resultInfo.innerText}

Identified using Plant Identification Online`;

  if (navigator.share) {
    navigator.share({
      title: "Plant Identification Result",
      text: shareText,
    });
  } else {
    navigator.clipboard.writeText(shareText);
    alert("✅ Result copied to clipboard!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("identifyForm");

  if (form) {
    form.addEventListener("submit", identifyPlant);
  }

  const btnCamera = document.getElementById("btnCamera");
  const btnGallery = document.getElementById("btnGallery");
  const plantImage = document.getElementById("plantImage");
  const fileSelectedName = document.getElementById("fileSelectedName");
  const fileNameSpan = document.getElementById("fileNameSpan");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const imagePreview = document.getElementById("imagePreview");

  if (btnCamera && plantImage) {
    btnCamera.addEventListener("click", function () {
      plantImage.setAttribute("capture", "environment");
      plantImage.click();
    });
  }

  if (btnGallery && plantImage) {
    btnGallery.addEventListener("click", function () {
      plantImage.removeAttribute("capture");
      plantImage.click();
    });
  }

  if (plantImage) {
    plantImage.addEventListener("change", function () {
      if (plantImage.files && plantImage.files[0]) {
        const file = plantImage.files[0];
        
        // Show file name
        if (fileNameSpan) {
          fileNameSpan.textContent = file.name;
        }
        if (fileSelectedName) {
          fileSelectedName.style.display = "inline-block";
        }

        // Show preview
        if (imagePreview && imagePreviewContainer) {
          const reader = new FileReader();
          reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = "block";
          };
          reader.readAsDataURL(file);
        }
      } else {
        if (fileSelectedName) {
          fileSelectedName.style.display = "none";
        }
        if (imagePreviewContainer) {
          imagePreviewContainer.style.display = "none";
        }
      }
    });
  }
});


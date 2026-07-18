function showLoading() {

    document.getElementById("loading").style.display = "block";

    let progress = 0;

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    progressBar.style.width = "0%";
    progressText.innerHTML = "0%";

    const interval = setInterval(function () {

        progress += 5;

        progressBar.style.width = progress + "%";
        progressText.innerHTML = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);
        }

    }, 150);

}

function toggleLearnMore() {

    const details = document.getElementById("plant-details");
    const arrow = document.getElementById("arrow");

    details.classList.toggle("show");

    if (details.classList.contains("show")) {
        arrow.innerHTML = "▲";
    } else {
        arrow.innerHTML = "▼";
    }
}

function shareResult() {

    const result = document.querySelector(".plant-info").innerText;

    const shareText =
`🌿 Plant Identification Result

${result}

Identified using Plant Identification Online`;

    if (navigator.share) {

        navigator.share({
            title: "Plant Identification Result",
            text: shareText
        });

    } else {

navigator.clipboard.writeText(shareText);
        alert("✅ Result copied to clipboard!");

    }
}

document.addEventListener("DOMContentLoaded", function () {
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

function validateForm() {
    const fileInput = document.getElementById("plantImage");
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert("Please select or take a photo of a plant first.");
        return false;
    }
    showLoading();
    return true;
}

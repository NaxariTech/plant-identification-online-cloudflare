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
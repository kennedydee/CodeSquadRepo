// ================================
// Dark Mode
// ================================

document.addEventListener("DOMContentLoaded", () => {

    // Show the page
    document.body.classList.remove("is-loading");

    const darkModeButton = document.getElementById("dark-mode-toggle");

    if (!darkModeButton) {
        return;
    }

    // Check saved dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeButton.textContent = "🌙 Too dark?";
    } else {
        darkModeButton.textContent = "☀️ Too bright?";
    }

    // Toggle dark mode
    darkModeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeButton.textContent = "🌙 Too dark?";
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeButton.textContent = "☀️ Too bright?";
        }
    });
});

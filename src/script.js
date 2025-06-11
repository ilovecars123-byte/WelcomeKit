/* ============================================= */
/* 1. SCRIPT INITIALIZATION & DOM SETUP          */
/* ============================================= */

// Waits for the HTML document to be fully loaded before running the script.
// The 'async' keyword allows the use of 'await' for fetching data.
document.addEventListener("DOMContentLoaded", async () => {
  // --- Cache DOM Elements ---
  // Store references to frequently used HTML elements for better performance.
  const container = document.getElementById("cards-container");
  const currentYearEl = document.getElementById("current-year");
  const winBtn = document.getElementById("windows-btn");
  const linuxBtn = document.getElementById("linux-btn");

  // --- Set Dynamic Content ---
  // Automatically update the year in the footer.
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  /* ============================================= */
  /* 2. DATA HANDLING                            */
  /* ============================================= */

  // Initialize an empty object to hold the data loaded from the JSON file.
  let data = {};

  // Asynchronously loads the card data from an external JSON file.
  async function loadCardData() {
    try {
      // Fetch the JSON file from the server.
      const response = await fetch("./src/cards-data.json");
      // Check if the request was successful.
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parse the JSON response and store it in the 'data' variable.
      data = await response.json();
    } catch (error) {
      // Log the error to the console for debugging.
      console.error("Could not load card data:", error);
      // Display a user-friendly error message in the main container.
      container.innerHTML = `<p style="color: red; text-align: center;">Error loading content. Please check the cards-data.json file and try again.</p>`;
    }
  }

  /* ============================================= */
  /* 3. UI RENDERING & LOGIC                       */
  /* ============================================= */

  // Renders the cards for the selected operating system (os).
  function renderCards(os) {
    // Clear any existing content from the container.
    container.innerHTML = "";

    // Get the array of sections for the specified OS.
    const sections = data[os];
    // If no sections exist, do nothing.
    if (!sections) return;

    // Loop through each section and create a card for it.
    sections.forEach((section) => {
      const card = document.createElement("div");
      card.className = "card";

      // Create the HTML for the list of links within the section.
      const linksHtml = section.links
        .map(
          (link) => `
            <li>
              <a href="${link.url}" 
                 class="link-item" 
                 ${
                   link.type !== "download"
                     ? 'target="_blank" rel="noopener noreferrer"'
                     : ""
                 }>
                <span class="link-text">${link.name}</span>
                <span class="link-icon ${
                  link.type === "external" ? "external-icon" : "download-icon"
                }"></span>
              </a>
            </li>
          `
        )
        .join("");

      // Assemble the full HTML for the card.
      card.innerHTML = `
        <h2 class="card-title">${section.title}</h2>
        <ul class="card-list">${linksHtml}</ul>
      `;
      // Add the newly created card to the main container.
      container.appendChild(card);
    });
  }

  // Handles the logic for switching between OS views and triggering animations.
  function selectOS(os) {
    // Prevent re-triggering the animation if the clicked tab is already active.
    if (
      (os === "windows" && winBtn.classList.contains("selected")) ||
      (os === "linux" && linuxBtn.classList.contains("selected"))
    ) {
      return;
    }

    // Update the visual state of the buttons.
    winBtn.classList.toggle("selected", os === "windows");
    linuxBtn.classList.toggle("selected", os === "linux");

    // --- Animation Orchestration ---
    // 1. Trigger the fade-out animation.
    container.classList.add("fade-out");

    // 2. Wait for the fade-out to finish before changing content.
    // The '{ once: true }' option automatically removes the event listener after it runs.
    container.addEventListener(
      "animationend",
      () => {
        // 3. Render the new cards while the container is invisible.
        renderCards(os);

        // 4. Trigger the fade-in animation for the new content.
        container.classList.remove("fade-out");
        container.classList.add("fade-in");

        // 5. Clean up the 'fade-in' class after it finishes to be ready for the next click.
        container.addEventListener(
          "animationend",
          () => {
            container.classList.remove("fade-in");
          },
          { once: true }
        );
      },
      { once: true }
    );
  }

  /* ============================================= */
  /* 4. APPLICATION STARTUP                        */
  /* ============================================= */

  // First, load the data from the JSON file.
  await loadCardData();

  // After data is loaded, attach the click event listeners to the buttons.
  winBtn.addEventListener("click", () => selectOS("windows"));
  linuxBtn.addEventListener("click", () => selectOS("linux"));

  // Set the initial state of the application by default.
  winBtn.classList.add("selected");
  renderCards("windows"); // Render the 'windows' cards on page load.
});

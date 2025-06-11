/* ============================================= */
/* 1. INTERNATIONALIZATION & GLOBAL STATE        */
/* ============================================= */
// This section manages the translation system and the application's global state.

// Variable that stores the currently active language ('pt' or 'en').
let currentLanguage = "pt";

// Object that acts as a dictionary, containing all UI texts.
// Each key (e.g., pageTitle) has a value for each supported language.
const translations = {
  en: {
    pageTitle: "CRUD JSON Generator - OSTEC",
    mainTitle: "CRUD JSON Generator",
    newSectionTitle: "➕ New Section",
    osLabel: "Operating System:",
    sectionTitleLabel: "Section Title:",
    sectionTitlePlaceholder: "Ex: 📞 Essentials",
    addSectionBtn: "Add Section",
    outputTitle: "📄 JSON Output / Actions",
    exportJsonBtn: "Export JSON",
    importJsonBtn: "Import JSON",
    editBtn: "Edit",
    deleteBtn: "Delete",
    saveBtn: "Save",
    cancelBtn: "Cancel",
    addLinkBtn: "➕ Add Link",
    newSectionTitlePrompt: "New Section Title:",
    newLinkNamePrompt: "Link Name (Ex: Slack):",
    newLinkUrlPrompt: "Link URL (Ex: https://slack.com):",
    newLinkTypePrompt: "Link Type (external or download):",
    errorTitleEmpty: "Section title cannot be empty.",
    errorInvalidType: "Invalid type. Use 'external' or 'download'.",
    errorNameUrlRequired: "Name and URL are required.",
    errorJsonStructure:
      "Error: The JSON file does not appear to have the correct structure.",
    errorReadingJson: (message) => `Error reading JSON file: ${message}`,
    confirmDeleteSection: (title) =>
      `Are you sure you want to delete the section "${title}"?`,
    confirmDeleteLink: (name) =>
      `Are you sure you want to delete the link "${name}"?`,
    importSuccess: "JSON imported successfully!",
  },
  pt: {
    pageTitle: "Gerador CRUD de JSON - OSTEC",
    mainTitle: "Gerador CRUD de JSON",
    newSectionTitle: "➕ Nova Seção",
    osLabel: "Sistema Operacional:",
    sectionTitleLabel: "Título da Seção:",
    sectionTitlePlaceholder: "Ex: 📞 Essentials",
    addSectionBtn: "Adicionar Seção",
    outputTitle: "📄 Saída JSON / Ações",
    exportJsonBtn: "Exportar JSON",
    importJsonBtn: "Importar JSON",
    editBtn: "Editar",
    deleteBtn: "Apagar",
    saveBtn: "Salvar",
    cancelBtn: "Cancelar",
    addLinkBtn: "➕ Adicionar Link",
    newSectionTitlePrompt: "Novo Título da Seção:",
    newLinkNamePrompt: "Nome do Link (Ex: Slack):",
    newLinkUrlPrompt: "URL do Link (Ex: https://slack.com):",
    newLinkTypePrompt: "Tipo do Link (external ou download):",
    errorTitleEmpty: "O título da seção não pode estar vazio.",
    errorInvalidType: "Tipo inválido. Use 'external' ou 'download'.",
    errorNameUrlRequired: "Nome e URL são obrigatórios.",
    errorJsonStructure:
      "Erro: O arquivo JSON não parece ter a estrutura correta.",
    errorReadingJson: (message) => `Erro ao ler o arquivo JSON: ${message}`,
    confirmDeleteSection: (title) =>
      `Tem certeza de que deseja apagar a seção "${title}"?`,
    confirmDeleteLink: (name) =>
      `Tem certeza de que deseja apagar o link "${name}"?`,
    importSuccess: "JSON importado com sucesso!",
  },
};

// Helper function to retrieve a translated text by its key.
// Supports dynamic texts (functions that receive arguments).
function getText(key, ...args) {
  const text = translations[currentLanguage][key];
  return typeof text === "function" ? text(...args) : text;
}

// Main function that sets the UI language.
function setLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang; // Updates the lang attribute of the <html> tag

  // Iterates through all elements with static text and updates their content.
  document.querySelectorAll("[data-lang-key]").forEach((el) => {
    const key = el.getAttribute("data-lang-key");
    el.textContent = getText(key);
  });

  // Iterates and updates the placeholders of the inputs.
  document.querySelectorAll("[data-lang-key-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-lang-key-placeholder");
    el.placeholder = getText(key);
  });

  // Updates the text of the language switcher button itself.
  const langBtn = document.getElementById("lang-switcher-btn");
  langBtn.textContent =
    lang === "pt" ? "Switch to English" : "Mudar para Português";

  render(); // Re-renders the list of cards to apply translations to dynamic buttons.
}

/* ============================================= */
/* 2. CRUD LOGIC (CREATE, READ, UPDATE, DELETE)  */
/* ============================================= */
// This section contains the functions that manipulate the data (sections and links).

// Main object that stores all application data.
let data = { windows: [], linux: [] };

// CREATE: Adds a new section.
function addSection() {
  const os = document.getElementById("os-select").value;
  const titleInput = document.getElementById("section-title-input");
  const title = titleInput.value.trim();
  if (!title) return alert(getText("errorTitleEmpty"));
  data[os].push({ title, links: [] });
  titleInput.value = "";
  render(); // Re-renders the UI to show the new section.
}

// CREATE: Adds a new link to an existing section.
function addLink(os, sectionIndex) {
  const name = prompt(getText("newLinkNamePrompt"));
  if (name === null || name.trim() === "") return; // Cancels if the prompt is empty or dismissed.
  const url = prompt(getText("newLinkUrlPrompt"));
  if (url === null || url.trim() === "") return;
  const type = prompt(getText("newLinkTypePrompt"), "external");
  if (type === null || !["external", "download"].includes(type.trim())) {
    return alert(getText("errorInvalidType"));
  }
  data[os][sectionIndex].links.push({
    name: name.trim(),
    url: url.trim(),
    type: type.trim(),
  });
  render(); // Re-renders the UI to show the new link.
}

// UPDATE (UI): Displays the edit form for a section.
function showEditSectionForm(os, sectionIndex) {
  const section = data[os][sectionIndex];
  const sectionElement = document.getElementById(
    `section-${os}-${sectionIndex}`
  );
  // Replaces the card's content with the edit form.
  sectionElement.innerHTML = `
    <div class="inline-edit-form">
      <label>${getText("newSectionTitlePrompt")}</label>
      <input type="text" id="edit-title-${os}-${sectionIndex}" value="${
    section.title
  }">
      <div class="action-buttons">
        <button onclick="updateSection('${os}', ${sectionIndex})">${getText(
    "saveBtn"
  )}</button>
        <button class="delete-btn" onclick="render()">${getText(
          "cancelBtn"
        )}</button>
      </div>
    </div>`;
}

// UPDATE (Data): Updates the section data after editing.
function updateSection(os, sectionIndex) {
  const newTitle = document
    .getElementById(`edit-title-${os}-${sectionIndex}`)
    .value.trim();
  if (!newTitle) return alert(getText("errorTitleEmpty"));
  data[os][sectionIndex].title = newTitle;
  render();
}

// UPDATE (UI): Displays the edit form for a link.
function showEditLinkForm(os, sectionIndex, linkIndex) {
  const link = data[os][sectionIndex].links[linkIndex];
  const linkElement = document.getElementById(
    `link-${os}-${sectionIndex}-${linkIndex}`
  );
  linkElement.innerHTML = `
    <div class="inline-edit-form">
      <input type="text" id="edit-link-name-${linkIndex}" value="${
    link.name
  }" placeholder="Nome">
      <input type="url" id="edit-link-url-${linkIndex}" value="${
    link.url
  }" placeholder="URL">
      <select id="edit-link-type-${linkIndex}">
        <option value="external" ${
          link.type === "external" ? "selected" : ""
        }>External</option>
        <option value="download" ${
          link.type === "download" ? "selected" : ""
        }>Download</option>
      </select>
      <div class="action-buttons">
        <button onclick="updateLink('${os}', ${sectionIndex}, ${linkIndex})">${getText(
    "saveBtn"
  )}</button>
        <button class="delete-btn" onclick="render()">${getText(
          "cancelBtn"
        )}</button>
      </div>
    </div>`;
}

// UPDATE (Data): Updates the link data after editing.
function updateLink(os, sectionIndex, linkIndex) {
  const newName = document
    .getElementById(`edit-link-name-${linkIndex}`)
    .value.trim();
  const newUrl = document
    .getElementById(`edit-link-url-${linkIndex}`)
    .value.trim();
  const newType = document.getElementById(`edit-link-type-${linkIndex}`).value;
  if (!newName || !newUrl) return alert(getText("errorNameUrlRequired"));
  data[os][sectionIndex].links[linkIndex] = {
    name: newName,
    url: newUrl,
    type: newType,
  };
  render();
}

// DELETE: Deletes a section.
function deleteSection(os, sectionIndex) {
  // Asks for confirmation before deleting.
  if (confirm(getText("confirmDeleteSection", data[os][sectionIndex].title))) {
    data[os].splice(sectionIndex, 1); // Removes the item from the array.
    render();
  }
}

// DELETE: Deletes a link.
function deleteLink(os, sectionIndex, linkIndex) {
  if (
    confirm(
      getText("confirmDeleteLink", data[os][sectionIndex].links[linkIndex].name)
    )
  ) {
    data[os][sectionIndex].links.splice(linkIndex, 1); // Removes the item from the array.
    render();
  }
}

/* ============================================= */
/* 3. UI RENDERING & DATA HANDLING               */
/* ============================================= */
// This section contains the functions responsible for drawing the interface and for importing/exporting JSON.

// READ: Main function that draws the entire UI from the 'data' object.
function render() {
  const windowsContainer = document.getElementById("windows-sections");
  const linuxContainer = document.getElementById("linux-sections");
  windowsContainer.innerHTML = "";
  linuxContainer.innerHTML = "";

  // Iterates over each operating system ('windows', 'linux').
  for (const os in data) {
    const container = os === "windows" ? windowsContainer : linuxContainer;
    // Iterates over each section within the operating system.
    data[os].forEach((section, sectionIndex) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "section-card";
      sectionEl.id = `section-${os}-${sectionIndex}`;

      // Creates the HTML for the list of links.
      const linksHtml = section.links
        .map(
          (link, linkIndex) => `
        <li class="link-item" id="link-${os}-${sectionIndex}-${linkIndex}">
          <div class="link-info">
            <span class="link-name">${link.name}</span> - 
            <a href="${link.url}" target="_blank">${link.url}</a>
            <span class="link-type">(${link.type})</span>
          </div>
          <div class="action-buttons">
            <button onclick="showEditLinkForm('${os}', ${sectionIndex}, ${linkIndex})">✏️</button>
            <button class="delete-btn" onclick="deleteLink('${os}', ${sectionIndex}, ${linkIndex})">🗑️</button>
          </div>
        </li>`
        )
        .join("");

      // Assembles the complete HTML for the section card.
      sectionEl.innerHTML = `
        <div class="section-header">
          <h3>${section.title}</h3>
          <div class="action-buttons">
            <button onclick="showEditSectionForm('${os}', ${sectionIndex})">✏️ ${getText(
        "editBtn"
      )}</button>
            <button class="delete-btn" onclick="deleteSection('${os}', ${sectionIndex})">🗑️ ${getText(
        "deleteBtn"
      )}</button>
          </div>
        </div>
        <ul class="link-list">${linksHtml}</ul>
        <button class="add-link-btn" onclick="addLink('${os}', ${sectionIndex})">${getText(
        "addLinkBtn"
      )}</button>`;
      container.appendChild(sectionEl);
    });
  }
  updateJsonOutput(); // Updates the text area with the JSON.
}

// Updates the text area with the formatted JSON.
function updateJsonOutput() {
  document.getElementById("json-output").textContent = JSON.stringify(
    data,
    null,
    2
  );
}

// Exports the 'data' object to a .json file.
function exportJSON() {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cards-data.json";
  document.body.appendChild(a);
  a.click(); // Simulates a click on the link to start the download.
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Imports data from a user-selected .json file.
function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      // Simple validation to ensure the JSON structure is as expected.
      if (importedData && importedData.windows && importedData.linux) {
        data = importedData;
        render();
        alert(getText("importSuccess"));
      } else {
        alert(getText("errorJsonStructure"));
      }
    } catch (error) {
      alert(getText("errorReadingJson", error.message));
    }
  };
  reader.readAsText(file);
}

/* ============================================= */
/* 4. APPLICATION INITIALIZATION                 */
/* ============================================= */
// This block of code runs as soon as the page finishes loading.

document.addEventListener("DOMContentLoaded", () => {
  // Adds the click listener to the language switcher button.
  const langBtn = document.getElementById("lang-switcher-btn");
  langBtn.addEventListener("click", () => {
    const newLang = currentLanguage === "pt" ? "en" : "pt";
    setLanguage(newLang);
  });

  // Sets the initial application language to Portuguese.
  setLanguage("pt");
});

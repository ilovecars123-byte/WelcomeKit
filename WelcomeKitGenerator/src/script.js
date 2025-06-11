/* ============================================= */
/* 1. INTERNATIONALIZATION & GLOBAL STATE        */
/* ============================================= */
let currentLanguage = "pt";

// Adicionadas novas chaves para os formulários dinâmicos
const translations = {
  en: {
    pageTitle: "Welcome Kit Generator",
    mainTitle: "Welcome Kit Generator",
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
    addLinkBtn: "➕ Add New Link",
    newSectionTitlePrompt: "New Section Title:",
    newLinkNameLabel: "Link Name:",
    newLinkNamePlaceholder: "Ex: Slack",
    newLinkUrlLabel: "Link URL:",
    newLinkUrlPlaceholder: "https://slack.com",
    newLinkTypeLabel: "Link Type:",
    errorTitleEmpty: "Section title cannot be empty.",
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
    pageTitle: "Gerador de Welcome Kit",
    mainTitle: "Gerador de Welcome Kit",
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
    addLinkBtn: "➕ Adicionar Novo Link",
    newSectionTitlePrompt: "Novo Título da Seção:",
    newLinkNameLabel: "Nome do Link:",
    newLinkNamePlaceholder: "Ex: Slack",
    newLinkUrlLabel: "URL do Link:",
    newLinkUrlPlaceholder: "https://slack.com",
    newLinkTypeLabel: "Tipo do Link:",
    errorTitleEmpty: "O título da seção não pode estar vazio.",
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

function getText(key, ...args) {
  const text = translations[currentLanguage][key];
  return typeof text === "function" ? text(...args) : text;
}

function setLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-lang-key]").forEach((el) => {
    const key = el.getAttribute("data-lang-key");
    if (key) el.textContent = getText(key);
  });
  document.querySelectorAll("[data-lang-key-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-lang-key-placeholder");
    if (key) el.placeholder = getText(key);
  });
  const langBtn = document.getElementById("lang-switcher-btn");
  langBtn.textContent =
    lang === "pt" ? "Switch to English" : "Mudar para Português";
  render();
}

// SVG Icons
const icons = {
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  delete: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`,
};

/* ============================================= */
/* 2. CRUD LOGIC (CREATE, READ, UPDATE, DELETE)  */
/* ============================================= */
let data = { windows: [], linux: [] };

function addSection() {
  const os = document.getElementById("os-select").value;
  const titleInput = document.getElementById("section-title-input");
  const title = titleInput.value.trim();
  if (!title) {
    alert(getText("errorTitleEmpty"));
    return;
  }
  data[os].push({ title, links: [] });
  titleInput.value = "";
  render();
}

function showAddLinkForm(os, sectionIndex) {
  const sectionCard = document.getElementById(`section-${os}-${sectionIndex}`);
  if (sectionCard.querySelector(".add-link-form")) return;

  const form = document.createElement("div");
  form.className = "add-link-form";
  form.innerHTML = `
        <div>
            <label>${getText("newLinkNameLabel")}</label>
            <input type="text" id="new-link-name-${sectionIndex}" placeholder="${getText(
    "newLinkNamePlaceholder"
  )}">
        </div>
        <div>
            <label>${getText("newLinkUrlLabel")}</label>
            <input type="url" id="new-link-url-${sectionIndex}" placeholder="${getText(
    "newLinkUrlPlaceholder"
  )}">
        </div>
        <div>
            <label>${getText("newLinkTypeLabel")}</label>
            <select id="new-link-type-${sectionIndex}">
                <option value="external">External</option>
                <option value="download">Download</option>
            </select>
        </div>
        <div class="action-buttons">
            <button onclick="commitAddLink('${os}', ${sectionIndex})">${getText(
    "saveBtn"
  )}</button>
            <button class="cancel-btn" onclick="render()">${getText(
              "cancelBtn"
            )}</button>
        </div>
    `;
  sectionCard.appendChild(form);
}

function commitAddLink(os, sectionIndex) {
  const name = document
    .getElementById(`new-link-name-${sectionIndex}`)
    .value.trim();
  const url = document
    .getElementById(`new-link-url-${sectionIndex}`)
    .value.trim();
  const type = document.getElementById(`new-link-type-${sectionIndex}`).value;

  if (!name || !url) {
    alert(getText("errorNameUrlRequired"));
    return;
  }

  data[os][sectionIndex].links.push({ name, url, type });
  render();
}

function showEditSectionForm(os, sectionIndex) {
  const section = data[os][sectionIndex];
  const sectionElement = document.getElementById(
    `section-${os}-${sectionIndex}`
  );
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
        <button class="cancel-btn" onclick="render()">${getText(
          "cancelBtn"
        )}</button>
      </div>
    </div>`;
}

function updateSection(os, sectionIndex) {
  const newTitle = document
    .getElementById(`edit-title-${os}-${sectionIndex}`)
    .value.trim();
  if (!newTitle) return alert(getText("errorTitleEmpty"));
  data[os][sectionIndex].title = newTitle;
  render();
}

function showEditLinkForm(os, sectionIndex, linkIndex) {
  const link = data[os][sectionIndex].links[linkIndex];
  const linkElement = document.getElementById(
    `link-${os}-${sectionIndex}-${linkIndex}`
  );
  linkElement.innerHTML = `
    <div class="inline-edit-form">
      <input type="text" id="edit-link-name-${linkIndex}" value="${
    link.name
  }" placeholder="${getText("newLinkNamePlaceholder")}">
      <input type="url" id="edit-link-url-${linkIndex}" value="${
    link.url
  }" placeholder="${getText("newLinkUrlPlaceholder")}">
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
        <button class="cancel-btn" onclick="render()">${getText(
          "cancelBtn"
        )}</button>
      </div>
    </div>`;
}

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

function deleteSection(os, sectionIndex) {
  if (confirm(getText("confirmDeleteSection", data[os][sectionIndex].title))) {
    data[os].splice(sectionIndex, 1);
    render();
  }
}

function deleteLink(os, sectionIndex, linkIndex) {
  if (
    confirm(
      getText("confirmDeleteLink", data[os][sectionIndex].links[linkIndex].name)
    )
  ) {
    data[os][sectionIndex].links.splice(linkIndex, 1);
    render();
  }
}

/* ============================================= */
/* 3. UI RENDERING & DATA HANDLING               */
/* ============================================= */
function render() {
  const containers = {
    windows: document.getElementById("windows-sections"),
    linux: document.getElementById("linux-sections"),
  };

  Object.values(containers).forEach((c) => (c.innerHTML = ""));

  for (const os in data) {
    const container = containers[os];
    if (!container) continue;

    data[os].forEach((section, sectionIndex) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "section-card";
      sectionEl.id = `section-${os}-${sectionIndex}`;

      const linksHtml = section.links
        .map(
          (link, linkIndex) => `
        <li class="link-item" id="link-${os}-${sectionIndex}-${linkIndex}">
          <div class="link-info">
            <span class="link-name">${link.name}</span> - 
            <a href="${link.url}" target="_blank">${link.url}</a>
            <span class="link-type">${link.type}</span>
          </div>
          <div class="action-buttons">
            <button onclick="showEditLinkForm('${os}', ${sectionIndex}, ${linkIndex})">${icons.edit}</button>
            <button class="delete-btn" onclick="deleteLink('${os}', ${sectionIndex}, ${linkIndex})">${icons.delete}</button>
          </div>
        </li>`
        )
        .join("");

      sectionEl.innerHTML = `
        <div class="section-header">
          <h3>${section.title}</h3>
          <div class="action-buttons">
            <button onclick="showEditSectionForm('${os}', ${sectionIndex})">${
        icons.edit
      } ${getText("editBtn")}</button>
            <button class="delete-btn" onclick="deleteSection('${os}', ${sectionIndex})">${
        icons.delete
      } ${getText("deleteBtn")}</button>
          </div>
        </div>
        <ul class="link-list">${linksHtml}</ul>
        <button class="add-link-btn" onclick="showAddLinkForm('${os}', ${sectionIndex})">${getText(
        "addLinkBtn"
      )}</button>`;
      container.appendChild(sectionEl);
    });
  }
  updateJsonOutput();
}

function updateJsonOutput() {
  document.getElementById("json-output").textContent = JSON.stringify(
    data,
    null,
    2
  );
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "welcome-kit-data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (importedData && (importedData.windows || importedData.linux)) {
        data = { windows: [], linux: [], ...importedData };
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
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-switcher-btn");
  langBtn.addEventListener("click", () => {
    const newLang = currentLanguage === "pt" ? "en" : "pt";
    setLanguage(newLang);
  });
  setLanguage("pt");
});

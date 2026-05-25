const STORAGE_KEY = "alerta25_ocorrencias_v5";
const SESSION_KEY = "alerta25_logged";
const STATUS_OPTIONS = ["Registrada", "Em análise", "Resolvida"];
const TYPE_OPTIONS = ["Assalto", "Furto", "Atividade suspeita", "Iluminação precária", "Outro"];

const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const logoutButton = document.getElementById("logoutButton");
const occurrenceForm = document.getElementById("occurrenceForm");
const occurrenceList = document.getElementById("occurrenceList");
const emptyState = document.getElementById("emptyState");
const emptyClearButton = document.getElementById("emptyClearButton");
const searchInput = document.getElementById("searchInput");
const periodFilter = document.getElementById("periodFilter");
const typeFilter = document.getElementById("typeFilter");
const statusFilter = document.getElementById("statusFilter");
const successMessage = document.getElementById("successMessage");
const resultsCounter = document.getElementById("resultsCounter");
const clearFiltersButton = document.getElementById("clearFiltersButton");
const resetDataButton = document.getElementById("resetDataButton");
const exportButton = document.getElementById("exportButton");
const detailModal = document.getElementById("detailModal");
const modalTitle = document.getElementById("modalTitle");
const modalContent = document.getElementById("modalContent");
const closeModalButton = document.getElementById("closeModalButton");
const typeChart = document.getElementById("typeChart");
const riskLevel = document.getElementById("riskLevel");
const riskDescription = document.getElementById("riskDescription");
const dateInput = document.getElementById("date");
const recentActivity = document.getElementById("recentActivity");
const lastUpdated = document.getElementById("lastUpdated");
const presentationButton = document.getElementById("presentationButton");
const toast = document.getElementById("toast");
const regionAnalysis = document.getElementById("regionAnalysis");
const reportToday = document.getElementById("reportToday");
const reportInsight = document.getElementById("reportInsight");
const mapFallback = document.getElementById("mapFallback");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const sidebar = document.querySelector(".sidebar");
const navList = document.querySelector(".nav-list");

const metricElements = {
  total: document.getElementById("totalOccurrences"),
  today: document.getElementById("todayOccurrences"),
  todayHero: document.getElementById("todayMetricHero"),
  projectValue: document.getElementById("projectMetricValue"),
  mostCommon: document.getElementById("mostCommonType"),
  last: document.getElementById("lastOccurrence")
};

let occurrences = loadOccurrences();
let toastTimeout;
let map;
let markerLayer;
let heatLayer;

const mapCenter = [-22.7916, -43.3023];
const referencePoints = [
  { label: "Rua Professor José de Souza Herdy", coords: [-22.7916, -43.3023] },
  { label: "Comércio local", coords: [-22.7921, -43.3009] },
  { label: "Instituição de ensino", coords: [-22.7906, -43.3035] },
  { label: "Academia", coords: [-22.7927, -43.3031] }
];

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getRelativeDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function createInitialOccurrences() {
  return [
    {
      id: 1,
      title: "Atividade suspeita próxima à academia",
      type: "Atividade suspeita",
      priority: "Média",
      description: "Moradores relataram movimentação incomum no fim da tarde, com permanência prolongada na calçada.",
      location: "Rua José Herdy, Bairro 25 de Agosto - próximo à academia",
      lat: -22.7927,
      lng: -43.3031,
      date: getTodayISO(),
      time: "18:20",
      status: "Registrada"
    },
    {
      id: 2,
      title: "Iluminação precária em trecho da Rua José Herdy",
      type: "Iluminação precária",
      priority: "Baixa",
      description: "Poste com baixa iluminação deixando o trecho menos visível para pedestres e comerciantes.",
      location: "Rua José Herdy, Bairro 25 de Agosto",
      lat: -22.7916,
      lng: -43.3023,
      date: getTodayISO(),
      time: "19:10",
      status: "Em análise"
    },
    {
      id: 3,
      title: "Furto próximo ao comércio local",
      type: "Furto",
      priority: "Média",
      description: "Registro simulado de furto de pertence próximo a uma loja com grande circulação de pessoas.",
      location: "Avenida 25 de Agosto - próximo ao comércio local",
      lat: -22.7921,
      lng: -43.3009,
      date: getRelativeDate(1),
      time: "12:45",
      status: "Resolvida"
    },
    {
      id: 4,
      title: "Assalto nas imediações da instituição de ensino",
      type: "Assalto",
      priority: "Alta",
      description: "Ocorrência simulada para demonstrar acompanhamento de segurança no horário de saída dos estudantes.",
      location: "Rua José Herdy - próximo à instituição de ensino",
      lat: -22.7906,
      lng: -43.3035,
      date: getRelativeDate(2),
      time: "21:30",
      status: "Em análise"
    },
    {
      id: 5,
      title: "Tentativa de furto em bicicleta",
      type: "Furto",
      priority: "Média",
      description: "Relato comunitário de tentativa de remoção de bicicleta presa em suporte público.",
      location: "Bairro 25 de Agosto - área de comércio local",
      lat: -22.7922,
      lng: -43.3014,
      date: getRelativeDate(3),
      time: "16:05",
      status: "Registrada"
    },
    {
      id: 6,
      title: "Barulho e aglomeração em ponto sem iluminação",
      type: "Outro",
      priority: "Baixa",
      description: "Registro simulado de incômodo urbano em local com baixa visibilidade durante a noite.",
      location: "Rua José Herdy, Duque de Caxias - RJ",
      lat: -22.7911,
      lng: -43.3028,
      date: getRelativeDate(4),
      time: "22:15",
      status: "Resolvida"
    }
  ];
}

function normalizeOccurrence(occurrence) {
  const coords = getCoordinatesForLocation(occurrence.location);
  return {
    ...occurrence,
    priority: occurrence.priority || "Média",
    lat: occurrence.lat || coords.lat,
    lng: occurrence.lng || coords.lng
  };
}

function getCoordinatesForLocation(location) {
  const text = location.toLowerCase();

  if (text.includes("academia")) {
    return { lat: -22.7927, lng: -43.3031 };
  }

  if (text.includes("comércio") || text.includes("comercio")) {
    return { lat: -22.7921, lng: -43.3009 };
  }

  if (text.includes("ensino") || text.includes("instituição") || text.includes("instituicao")) {
    return { lat: -22.7906, lng: -43.3035 };
  }

  return { lat: -22.7916, lng: -43.3023 };
}

function loadOccurrences() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    return JSON.parse(storedData).map(normalizeOccurrence);
  }

  const initialData = createInitialOccurrences();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
}

function saveOccurrences() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(occurrences));
}

function showToast(message, type = "success") {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toast.classList.add("hidden");
  }, 3200);
}

function showDashboard() {
  closeMobileMenu();
  loginScreen.classList.add("hidden");
  dashboardScreen.classList.remove("hidden");
  renderDashboard();
}

function showLogin() {
  dashboardScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

function calculateTodayTotal() {
  const today = getTodayISO();
  return occurrences.filter((occurrence) => occurrence.date === today).length;
}

function calculateMostCommonType() {
  if (occurrences.length === 0) {
    return "-";
  }

  const counts = occurrences.reduce((accumulator, occurrence) => {
    accumulator[occurrence.type] = (accumulator[occurrence.type] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function getSortedOccurrences(list) {
  return [...list].sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));
}

function getLastOccurrence() {
  if (occurrences.length === 0) {
    return "-";
  }

  return getSortedOccurrences(occurrences)[0].title;
}

function updateSummaryCards() {
  const todayTotal = calculateTodayTotal();

  metricElements.total.textContent = occurrences.length;
  metricElements.today.textContent = todayTotal;
  metricElements.todayHero.textContent = todayTotal;
  metricElements.projectValue.textContent = todayTotal;
  metricElements.mostCommon.textContent = calculateMostCommonType();
  metricElements.last.textContent = getLastOccurrence();
}

function updateLastUpdated() {
  const now = new Date();
  lastUpdated.textContent = `Última atualização: ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

function updateRiskIndicator() {
  const todayTotal = calculateTodayTotal();
  let level = "Baixo";
  let description = "0 a 2 registros hoje. Situação monitorada com baixa concentração de ocorrências.";
  let className = "risk-panel risk-low";

  if (todayTotal >= 6) {
    level = "Alto";
    description = "6 ou mais registros hoje. Atenção elevada para acompanhamento comunitário.";
    className = "risk-panel risk-high";
  } else if (todayTotal >= 3) {
    level = "Moderado";
    description = "3 a 5 registros hoje. Há concentração relevante de ocorrências no período.";
    className = "risk-panel risk-medium";
  }

  riskLevel.textContent = level;
  riskDescription.textContent = description;
  riskLevel.closest(".risk-panel").className = className;
}

function getPredominantPeriod() {
  const buckets = {
    manhã: 0,
    tarde: 0,
    noite: 0
  };

  occurrences.forEach((occurrence) => {
    const hour = Number(occurrence.time.split(":")[0]);
    if (hour < 12) {
      buckets.manhã += 1;
    } else if (hour < 18) {
      buckets.tarde += 1;
    } else {
      buckets.noite += 1;
    }
  });

  return Object.entries(buckets).sort((a, b) => b[1] - a[1])[0][0];
}

function renderRegionAnalysis() {
  const todayTotal = calculateTodayTotal();
  const commonType = calculateMostCommonType();
  const period = getPredominantPeriod();
  const risk = riskLevel.textContent;
  const topLocation = "Rua Professor José de Souza Herdy";

  regionAnalysis.innerHTML = `
    <article>
      <span>Maior concentração</span>
      <strong>${topLocation}</strong>
    </article>
    <article>
      <span>Tipo predominante</span>
      <strong>${escapeHTML(commonType)}</strong>
    </article>
    <article>
      <span>Horário crítico</span>
      <strong>Período da ${period}</strong>
    </article>
    <article>
      <span>Nível de atenção</span>
      <strong>${escapeHTML(risk)} (${todayTotal} registros hoje)</strong>
    </article>
  `;

  reportToday.textContent = `${todayTotal} ocorrência${todayTotal === 1 ? "" : "s"} hoje`;
  reportInsight.textContent = `Tipo mais comum: ${commonType}. Horário crítico: ${period}. Risco atual: ${risk}.`;
}

function renderRecentActivity() {
  const recentItems = getSortedOccurrences(occurrences).slice(0, 3);

  recentActivity.innerHTML = recentItems
    .map((occurrence) => `
      <article class="timeline-item">
        <div class="timeline-dot ${getStatusClass(occurrence.status)}"></div>
        <div>
          <strong>${escapeHTML(occurrence.title)}</strong>
          <span>${formatDate(occurrence.date)} às ${escapeHTML(occurrence.time)} · ${escapeHTML(occurrence.status)}</span>
        </div>
      </article>
    `)
    .join("");
}

function renderTypeChart() {
  const counts = TYPE_OPTIONS.map((type) => ({
    type,
    total: occurrences.filter((occurrence) => occurrence.type === type).length
  }));
  const max = Math.max(...counts.map((item) => item.total), 1);

  typeChart.innerHTML = counts
    .map((item) => {
      const width = Math.max((item.total / max) * 100, item.total ? 8 : 2);
      return `
        <div class="chart-row">
          <div class="chart-label">
            <span>${escapeHTML(item.type)}</span>
            <strong>${item.total}</strong>
          </div>
          <div class="chart-track">
            <span style="width: ${width}%"></span>
          </div>
        </div>
      `;
    })
    .join("");
}

function initializeMap() {
  if (!window.L) {
    mapFallback.classList.remove("hidden");
    return;
  }

  if (map) {
    return;
  }

  map = L.map("realMap", {
    scrollWheelZoom: false
  }).setView(mapCenter, 16);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
  heatLayer = L.layerGroup().addTo(map);

  referencePoints.forEach((point) => {
    L.circleMarker(point.coords, {
      radius: 7,
      color: "#ffffff",
      weight: 2,
      fillColor: "#16a34a",
      fillOpacity: 1
    }).bindPopup(point.label).addTo(map);
  });
}

function renderMapLayers() {
  initializeMap();

  if (!map || !markerLayer || !heatLayer) {
    return;
  }

  markerLayer.clearLayers();
  heatLayer.clearLayers();

  const filteredOccurrences = getFilteredOccurrences();

  filteredOccurrences.forEach((occurrence) => {
    const intensity = occurrence.priority === "Alta" ? 82 : occurrence.priority === "Média" ? 60 : 42;
    const color = occurrence.priority === "Alta" ? "#dc2626" : occurrence.priority === "Média" ? "#f59e0b" : "#1d4ed8";

    L.circle([occurrence.lat, occurrence.lng], {
      radius: intensity,
      color,
      fillColor: color,
      fillOpacity: 0.16,
      weight: 1
    }).addTo(heatLayer);

    L.circleMarker([occurrence.lat, occurrence.lng], {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: color,
      fillOpacity: 0.95
    })
      .bindPopup(`<strong>${escapeHTML(occurrence.title)}</strong><br>${escapeHTML(occurrence.type)} · ${escapeHTML(occurrence.status)}`)
      .addTo(markerLayer);
  });
}

function getStatusClass(status) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function escapeHTML(value) {
  const temporaryElement = document.createElement("div");
  temporaryElement.textContent = value;
  return temporaryElement.innerHTML;
}

function getFilteredOccurrences() {
  const selectedType = typeFilter.value;
  const selectedStatus = statusFilter.value;
  const selectedPeriod = periodFilter.value;
  const searchTerm = searchInput.value.trim().toLowerCase();

  return occurrences.filter((occurrence) => {
    const text = `${occurrence.title} ${occurrence.description} ${occurrence.location}`.toLowerCase();
    const matchesSearch = !searchTerm || text.includes(searchTerm);
    const matchesType = selectedType === "Todos" || occurrence.type === selectedType;
    const matchesStatus = selectedStatus === "Todos" || occurrence.status === selectedStatus;
    const matchesPeriod = selectedPeriod === "Todos" || isWithinPeriod(occurrence.date, selectedPeriod);
    return matchesSearch && matchesType && matchesStatus && matchesPeriod;
  });
}

function isWithinPeriod(date, period) {
  if (period === "Hoje") {
    return date === getTodayISO();
  }

  const days = Number(period);
  const currentDate = new Date(`${getTodayISO()}T00:00`);
  const occurrenceDate = new Date(`${date}T00:00`);
  const differenceInDays = (currentDate - occurrenceDate) / 86400000;
  return differenceInDays >= 0 && differenceInDays < days;
}

function updateResultsCounter(filteredTotal) {
  resultsCounter.textContent = `Exibindo ${filteredTotal} de ${occurrences.length} ocorrências.`;
}

function renderStatusOptions(currentStatus) {
  return STATUS_OPTIONS.map((status) => {
    const selected = status === currentStatus ? "selected" : "";
    return `<option ${selected}>${status}</option>`;
  }).join("");
}

function renderOccurrenceList() {
  const filteredOccurrences = getSortedOccurrences(getFilteredOccurrences());
  occurrenceList.innerHTML = "";
  emptyState.classList.toggle("hidden", filteredOccurrences.length > 0);
  updateResultsCounter(filteredOccurrences.length);

  filteredOccurrences.forEach((occurrence) => {
    const card = document.createElement("article");
    card.className = "occurrence-card";
    card.innerHTML = `
      <div>
        <h4>${escapeHTML(occurrence.title)}</h4>
        <p>${escapeHTML(occurrence.description)}</p>
        <div class="occurrence-meta">
          <span class="tag type-tag">${escapeHTML(occurrence.type)}</span>
          <span class="tag priority ${getStatusClass(occurrence.priority)}">Prioridade ${escapeHTML(occurrence.priority)}</span>
          <span class="tag status ${getStatusClass(occurrence.status)}">${escapeHTML(occurrence.status)}</span>
          <span class="tag location-tag">${escapeHTML(occurrence.location)}</span>
        </div>
      </div>
      <div class="occurrence-side">
        <div class="occurrence-date">${formatDate(occurrence.date)}<br>${escapeHTML(occurrence.time)}</div>
        <label class="inline-control">
          Status
          <select data-status-id="${occurrence.id}">
            ${renderStatusOptions(occurrence.status)}
          </select>
        </label>
        <button type="button" class="details-button" data-occurrence-id="${occurrence.id}">Ver detalhes</button>
      </div>
    `;
    occurrenceList.appendChild(card);
  });

  renderMapLayers();
}

function renderDashboard() {
  updateSummaryCards();
  updateRiskIndicator();
  renderRegionAnalysis();
  renderRecentActivity();
  renderTypeChart();
  renderOccurrenceList();
  updateLastUpdated();
}

function setDefaultFormDateTime() {
  const now = new Date();
  dateInput.max = getTodayISO();
  dateInput.value = getTodayISO();
  document.getElementById("time").value = now.toTimeString().slice(0, 5);
}

function openOccurrenceDetails(id) {
  const occurrence = occurrences.find((item) => String(item.id) === String(id));
  if (!occurrence) {
    return;
  }

  modalTitle.textContent = occurrence.title;
  modalContent.innerHTML = `
    <div class="detail-grid">
      <div>
        <span>Tipo</span>
        <strong>${escapeHTML(occurrence.type)}</strong>
      </div>
      <div>
        <span>Prioridade</span>
        <strong>${escapeHTML(occurrence.priority)}</strong>
      </div>
      <div>
        <span>Status</span>
        <strong>${escapeHTML(occurrence.status)}</strong>
      </div>
      <div>
        <span>Data e hora</span>
        <strong>${formatDate(occurrence.date)} às ${escapeHTML(occurrence.time)}</strong>
      </div>
      <div class="wide-detail">
        <span>Localização</span>
        <strong>${escapeHTML(occurrence.location)}</strong>
      </div>
    </div>
    <div class="detail-description">
      <span>Descrição</span>
      <p>${escapeHTML(occurrence.description)}</p>
    </div>
  `;
  detailModal.classList.remove("hidden");
}

function closeOccurrenceDetails() {
  detailModal.classList.add("hidden");
}

function clearFilters() {
  searchInput.value = "";
  periodFilter.value = "Todos";
  typeFilter.value = "Todos";
  statusFilter.value = "Todos";
  renderOccurrenceList();
}

function exportOccurrences() {
  const confirmed = window.confirm("Deseja exportar os dados simulados em JSON?");
  if (!confirmed) {
    return;
  }

  const data = {
    projeto: "Alerta 25",
    geradoEm: new Date().toISOString(),
    total: occurrences.length,
    ocorrencias: getSortedOccurrences(occurrences)
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `alerta-25-ocorrencias-${getTodayISO()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Dados exportados em JSON.");
}

function resetData() {
  const confirmed = window.confirm("Deseja restaurar os dados simulados iniciais? Registros cadastrados nesta sessão serão substituídos.");
  if (!confirmed) {
    return;
  }

  occurrences = createInitialOccurrences();
  saveOccurrences();
  clearFilters();
  renderDashboard();
  showToast("Dados simulados restaurados.");
}

function updateOccurrenceStatus(id, status) {
  occurrences = occurrences.map((occurrence) => {
    if (String(occurrence.id) !== String(id)) {
      return occurrence;
    }
    return { ...occurrence, status };
  });
  saveOccurrences();
  renderDashboard();
  showToast("Status atualizado.");
}

function togglePresentationMode() {
  document.body.classList.toggle("presentation-mode");
  const isActive = document.body.classList.contains("presentation-mode");
  presentationButton.textContent = isActive ? "Sair da apresentação" : "Modo apresentação";
  showToast(isActive ? "Modo apresentação ativado." : "Modo apresentação desativado.");
}

function toggleMobileMenu() {
  const isOpen = sidebar.classList.toggle("mobile-open");
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
  mobileMenuButton.setAttribute("aria-label", isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
}

function closeMobileMenu() {
  sidebar.classList.remove("mobile-open");
  mobileMenuButton.setAttribute("aria-expanded", "false");
  mobileMenuButton.setAttribute("aria-label", "Abrir menu de navegação");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "123456") {
    sessionStorage.setItem(SESSION_KEY, "true");
    loginError.textContent = "";
    setDefaultFormDateTime();
    showDashboard();
    return;
  }

  loginError.textContent = "Usuário ou senha incorretos. Use admin / 123456.";
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem(SESSION_KEY);
  loginForm.reset();
  showLogin();
});

occurrenceForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(occurrenceForm);
  const selectedDate = formData.get("date");

  if (selectedDate > getTodayISO()) {
    successMessage.textContent = "A data da ocorrência não pode ser futura.";
    successMessage.classList.add("error-message");
    showToast("A data da ocorrência não pode ser futura.", "error");
    return;
  }

  const newOccurrence = {
    id: Date.now(),
    title: formData.get("title").trim(),
    type: formData.get("type"),
    priority: formData.get("priority"),
    description: formData.get("description").trim(),
    location: formData.get("location").trim(),
    ...getCoordinatesForLocation(formData.get("location").trim()),
    date: selectedDate,
    time: formData.get("time"),
    status: "Registrada"
  };

  occurrences.unshift(newOccurrence);
  saveOccurrences();
  renderDashboard();
  occurrenceForm.reset();
  setDefaultFormDateTime();

  successMessage.classList.remove("error-message");
  successMessage.textContent = "Ocorrência cadastrada com sucesso.";
  showToast("Ocorrência cadastrada com sucesso.");
  window.setTimeout(() => {
    successMessage.textContent = "";
  }, 3500);
});

occurrenceList.addEventListener("click", (event) => {
  const detailsButton = event.target.closest("[data-occurrence-id]");
  if (detailsButton) {
    openOccurrenceDetails(detailsButton.dataset.occurrenceId);
  }
});

occurrenceList.addEventListener("change", (event) => {
  const statusSelect = event.target.closest("[data-status-id]");
  if (statusSelect) {
    updateOccurrenceStatus(statusSelect.dataset.statusId, statusSelect.value);
  }
});

searchInput.addEventListener("input", renderOccurrenceList);
periodFilter.addEventListener("change", renderOccurrenceList);
typeFilter.addEventListener("change", renderOccurrenceList);
statusFilter.addEventListener("change", renderOccurrenceList);
clearFiltersButton.addEventListener("click", clearFilters);
emptyClearButton.addEventListener("click", clearFilters);
resetDataButton.addEventListener("click", resetData);
exportButton.addEventListener("click", exportOccurrences);
presentationButton.addEventListener("click", togglePresentationMode);
mobileMenuButton.addEventListener("click", toggleMobileMenu);
navList.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMobileMenu();
  }
});
closeModalButton.addEventListener("click", closeOccurrenceDetails);
detailModal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-modal")) {
    closeOccurrenceDetails();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeOccurrenceDetails();
  }
});

setDefaultFormDateTime();

if (sessionStorage.getItem(SESSION_KEY) === "true") {
  showDashboard();
}

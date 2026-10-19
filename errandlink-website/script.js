const profileForm = document.getElementById("profileForm");
const formMessage = document.getElementById("formMessage");
const browseFile = document.getElementById("browseFile");
const fileLabel = document.getElementById("fileLabel");
const serviceSearch = document.getElementById("serviceSearch");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const serviceCards = [...document.querySelectorAll(".service-card")];
const noServices = document.getElementById("noServices");
const requestModal = document.getElementById("requestModal");
const selectedService = document.getElementById("selectedService");
let activeFilter = "all";

document.getElementById("year").textContent = new Date().getFullYear();

browseFile.addEventListener("change", () => {
  const file = browseFile.files[0];
  fileLabel.textContent = file ? file.name : "Choose a photo or product reference";
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!profileForm.reportValidity()) return;

  // Demo only: never save or transmit national ID details from this prototype.
  const username = document.getElementById("username").value.trim();
  formMessage.textContent = `Welcome, ${username}! Your demo profile is ready. Explore services below to plan an errand.`;
  document.getElementById("services").scrollIntoView({ behavior: "smooth" });
});

function filterServices() {
  const term = serviceSearch.value.trim().toLowerCase();
  let visible = 0;
  serviceCards.forEach((card) => {
    const categoryMatches = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchMatches = `${card.dataset.name} ${card.innerText}`.toLowerCase().includes(term);
    const show = categoryMatches && searchMatches;
    card.hidden = !show;
    if (show) visible++;
  });
  noServices.hidden = visible !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    filterServices();
  });
});
serviceSearch.addEventListener("input", filterServices);

function openRequest(serviceName = "") {
  selectedService.value = serviceName;
  if (typeof requestModal.showModal === "function") requestModal.showModal();
  else requestModal.setAttribute("open", "");
}

document.querySelectorAll(".choose-service").forEach((button) => {
  button.addEventListener("click", () => openRequest(button.dataset.service));
});
document.getElementById("openRequest").addEventListener("click", (event) => {
  event.preventDefault();
  openRequest("");
});

document.getElementById("requestForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const requestForm = event.currentTarget;
  if (!requestForm.reportValidity()) return;
  const service = selectedService.value.trim();
  const meeting = document.getElementById("meetingType").value;
  const location = document.getElementById("location").value.trim();
  const date = new Date(document.getElementById("schedule").value);
  const formattedDate = Number.isNaN(date.getTime()) ? "time to be agreed" : date.toLocaleString();
  document.getElementById("requestMessage").textContent =
    `Preview ready: ${service}. Meeting: ${meeting}. Area: ${location}. Preferred time: ${formattedDate}. This request has not been sent to a real runner or seller.`;
});

// Prevent selecting a date in the past in the request form.
const scheduleInput = document.getElementById("schedule");
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
scheduleInput.min = now.toISOString().slice(0, 16);

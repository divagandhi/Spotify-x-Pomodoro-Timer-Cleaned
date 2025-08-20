import { setupEventListeners } from "./events.js";
import { loadSettings } from "./settings.js";

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  setupEventListeners();
});
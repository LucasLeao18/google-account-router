const STORAGE_KEY = "googleAccountRouterSettings";
const LANGUAGE_KEY = "googleAccountRouterLanguage";

const DEFAULT_SETTINGS = {
  classroom: { enabled: false, accountIndex: 0 },
  gmail: { enabled: false, accountIndex: 0 },
  google: { enabled: false, accountIndex: 0 }
};

const SERVICES = ["gmail", "classroom", "google"];
const DEFAULT_LANGUAGE = "pt";

const TRANSLATIONS = {
  pt: {
    account: "Conta",
    accountNote: "Conta 0 = conta padrão do Google neste navegador.",
    developer: "Desenvolvedor",
    enableClassroom: "Ativar Classroom",
    enableGmail: "Ativar Gmail",
    enableGoogle: "Ativar Google",
    language: "Idioma",
    save: "Salvar configurações",
    saved: "Configurações salvas",
    saving: "Salvando..."
  },
  en: {
    account: "Account",
    accountNote: "Account 0 = the default Google account in this browser.",
    developer: "Developer",
    enableClassroom: "Enable Classroom",
    enableGmail: "Enable Gmail",
    enableGoogle: "Enable Google",
    language: "Language",
    save: "Save settings",
    saved: "Settings saved",
    saving: "Saving..."
  }
};

const form = document.querySelector("#settings-form");
const saveButton = document.querySelector("#save-button");
const statusEl = document.querySelector("#save-status");
const languageButtons = document.querySelectorAll("[data-language]");
let currentLanguage = DEFAULT_LANGUAGE;

function normalizeAccountIndex(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function normalizeSettings(settings = {}) {
  return Object.fromEntries(
    Object.entries(DEFAULT_SETTINGS).map(([service, defaults]) => {
      const value = settings[service] || {};

      return [
        service,
        {
          enabled: Boolean(value.enabled ?? defaults.enabled),
          accountIndex: normalizeAccountIndex(value.accountIndex ?? defaults.accountIndex)
        }
      ];
    })
  );
}

function normalizeLanguage(language) {
  return language === "en" ? "en" : DEFAULT_LANGUAGE;
}

function t(key) {
  return TRANSLATIONS[currentLanguage][key] || TRANSLATIONS[DEFAULT_LANGUAGE][key] || key;
}

function storageGet() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SETTINGS }, (result) => {
      resolve(normalizeSettings(result[STORAGE_KEY]));
    });
  });
}

function storageGetLanguage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [LANGUAGE_KEY]: DEFAULT_LANGUAGE }, (result) => {
      resolve(normalizeLanguage(result[LANGUAGE_KEY]));
    });
  });
}

function storageSet(settings) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: settings }, resolve);
  });
}

function storageSetLanguage(language) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [LANGUAGE_KEY]: normalizeLanguage(language) }, resolve);
  });
}

function applyLanguage(language) {
  currentLanguage = normalizeLanguage(language);
  document.documentElement.lang = currentLanguage === "pt" ? "pt-BR" : "en";
  document.querySelector(".language-switch").setAttribute("aria-label", t("language"));

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
  });
}

function getFormSettings() {
  return normalizeSettings(
    Object.fromEntries(
      SERVICES.map((service) => {
        const enabledInput = form.querySelector(`[data-service="${service}"][data-field="enabled"]`);
        const accountInput = form.querySelector(`[data-service="${service}"][data-field="accountIndex"]`);

        return [
          service,
          {
            enabled: enabledInput.checked,
            accountIndex: normalizeAccountIndex(accountInput.value)
          }
        ];
      })
    )
  );
}

function render(settings) {
  Object.entries(normalizeSettings(settings)).forEach(([service, value]) => {
    const enabledInput = form.querySelector(`[data-service="${service}"][data-field="enabled"]`);
    const accountInput = form.querySelector(`[data-service="${service}"][data-field="accountIndex"]`);

    enabledInput.checked = value.enabled;
    accountInput.value = value.accountIndex;
  });
}

function showStatus(message) {
  statusEl.textContent = message;

  window.clearTimeout(showStatus.timer);
  showStatus.timer = window.setTimeout(() => {
    statusEl.textContent = "";
  }, 2400);
}

form.addEventListener("input", (event) => {
  if (event.target.dataset.field === "accountIndex") {
    event.target.value = normalizeAccountIndex(event.target.value);
  }
});

languageButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    applyLanguage(button.dataset.language);
    await storageSetLanguage(currentLanguage);
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  saveButton.disabled = true;
  statusEl.textContent = t("saving");

  await storageSet(getFormSettings());

  saveButton.disabled = false;
  showStatus(t("saved"));
});

Promise.all([storageGet(), storageGetLanguage()]).then(([settings, language]) => {
  applyLanguage(language);
  render(settings);
});

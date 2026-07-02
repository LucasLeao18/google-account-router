const STORAGE_KEY = "googleAccountRouterSettings";

const DEFAULT_SETTINGS = {
  classroom: { enabled: false, accountIndex: 0 },
  gmail: { enabled: false, accountIndex: 0 },
  google: { enabled: false, accountIndex: 0 }
};

const SERVICES = {
  gmail: {
    preview: (index) => `https://mail.google.com/mail/u/${index}/`
  },
  classroom: {
    preview: (index) => `https://classroom.google.com/u/${index}/`
  },
  google: {
    preview: (index) => `https://www.google.com/u/${index}/`
  }
};

const form = document.querySelector("#settings-form");
const saveButton = document.querySelector("#save-button");
const statusEl = document.querySelector("#save-status");

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

function storageGet() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SETTINGS }, (result) => {
      resolve(normalizeSettings(result[STORAGE_KEY]));
    });
  });
}

function storageSet(settings) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [STORAGE_KEY]: settings }, resolve);
  });
}

function updatePreview(service) {
  const accountInput = form.querySelector(`[data-service="${service}"][data-field="accountIndex"]`);
  const preview = document.querySelector(`#${service}-preview`);
  const index = normalizeAccountIndex(accountInput.value);

  accountInput.value = index;
  preview.textContent = SERVICES[service].preview(index);
}

function getFormSettings() {
  return normalizeSettings(
    Object.fromEntries(
      Object.keys(SERVICES).map((service) => {
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
    updatePreview(service);
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
  const service = event.target.dataset.service;

  if (service && SERVICES[service]) {
    updatePreview(service);
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  saveButton.disabled = true;
  statusEl.textContent = "Salvando...";

  await storageSet(getFormSettings());

  saveButton.disabled = false;
  showStatus("Configurações salvas");
});

storageGet().then(render);

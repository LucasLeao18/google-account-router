const assert = require("node:assert/strict");
const { getRedirectUrl, normalizeSettings } = require("../background.js");

const settings = normalizeSettings({
  classroom: { enabled: true, accountIndex: 3 },
  gmail: { enabled: true, accountIndex: 2 },
  google: { enabled: true, accountIndex: 1 }
});

assert.equal(
  getRedirectUrl("https://classroom.google.com/", settings),
  "https://classroom.google.com/u/3/"
);

assert.equal(
  getRedirectUrl("https://classroom.google.com/u/0/c/abc?hl=pt-BR#work", settings),
  "https://classroom.google.com/u/3/c/abc?hl=pt-BR#work"
);

assert.equal(
  getRedirectUrl("https://mail.google.com/", settings),
  "https://mail.google.com/mail/u/2/"
);

assert.equal(
  getRedirectUrl("https://mail.google.com/mail/u/0/#inbox", settings),
  "https://mail.google.com/mail/u/2/#inbox"
);

assert.equal(
  getRedirectUrl("https://www.google.com/search?q=chrome+mv3", settings),
  "https://www.google.com/u/1/search?q=chrome+mv3"
);

assert.equal(
  getRedirectUrl("https://www.google.com/url?q=https%3A%2F%2Fexample.com", settings),
  null
);

assert.equal(
  getRedirectUrl("https://accounts.google.com/", settings),
  null
);

assert.equal(
  getRedirectUrl("https://mail.google.com/mail/u/2/#inbox", settings),
  null
);

console.log("redirect tests passed");

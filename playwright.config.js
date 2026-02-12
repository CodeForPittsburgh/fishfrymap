const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests/parity",
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: true,
    timeout: 120000
  }
});

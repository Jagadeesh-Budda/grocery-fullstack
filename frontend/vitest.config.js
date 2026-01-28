import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,      // 👈 THIS fixes `expect is not defined`
    environment: "jsdom",
    setupFiles: "./src/setupTests.js"
  }
});

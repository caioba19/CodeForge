import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api/wandbox → https://wandbox.org/api (resolve CORS no dev)
      "/api/wandbox": {
        target:      "https://wandbox.org",
        changeOrigin: true,
        rewrite:     path => path.replace(/^\/api\/wandbox/, "/api"),
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // this needs to be 127.0.0.1 (instead of localhost) for the spotify api to respect me 🤪
    host: "127.0.0.1",
    port: 3000,
  },
});

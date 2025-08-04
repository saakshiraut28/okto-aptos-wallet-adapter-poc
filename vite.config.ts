import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./inpage.js",
      formats: ["es"],
      fileName: () => "inpage.js"
    },
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: "inpage.js"
      }
    }
  }
});

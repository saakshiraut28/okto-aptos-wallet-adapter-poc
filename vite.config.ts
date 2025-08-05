import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        inpage: "./inpage.ts",
        "test-dapp": "./test-dapp.ts"
      },
      output: {
        entryFileNames: "[name].js",
        format: "es",
        // Prevent chunking for inpage script - extension needs single file
        manualChunks: (id) => {
          if (id.includes('inpage.ts')) {
            return 'inpage';
          }
          // Allow chunking for test-dapp-official since it's loaded by web page
          return undefined;
        }
      }
    },
    outDir: "dist"
  }
});

#!/usr/bin/env node
import chokidar from "chokidar";
import { resolve } from "path";
import { extractClasses } from "./functions/extractClass.js";
import { generatePlugins } from "./functions/generatePlugins.js";
import { generateImports } from "./functions/generateImports.js";

const runBuild = async () => {
    console.log("🏗️ Building ds-css...");
    try {
        await extractClasses({ srcDir: "components" });
        await generatePlugins({
            type: "component",
            srcDir: "src/components",
            distDir: "components",
        });
        await generateImports("imports.js");
        console.log("✅ Build finished");
    } catch (err) {
        console.error("❌ Build failed:", err);
    }
};

if (process.argv.includes("--watch")) {
    console.log("👀 Watching for changes...");


    const watcher = chokidar.watch(["src"], {
        ignored: /(^|[\/\\])\../, // Ignore hidden files
        persistent: true,
        ignoreInitial: true,
    });

    watcher.on("all", async (event, filePath) => {
        if (filePath.endsWith(".css") || filePath.endsWith(".ts")) {
            console.log(`🔄 ${event}: ${filePath}`);
            await runBuild();
        }
    });

    // build initial
    await runBuild();
} else {
    await runBuild();
}

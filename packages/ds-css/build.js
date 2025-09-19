#!/usr/bin/env node
import chokidar from "chokidar";
import { resolve } from "path";
import { extractClasses } from "./functions/extractClass.js";
import { generatePlugins } from "./functions/generatePlugins.js";
import { generateImports } from "./functions/generateImports.js";
import { packCss } from "./functions/packCss.js";
import { generateRawStyles } from "./functions/generateRawStyles.js";
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
        await generateRawStyles({
            srcDir: "../src/components",
            distDir: "../components",
            responsive: true,
            exclude: [
                "calendar",
                "countdown",
                "loading",
                "filter",
                "mask",
                "mockup",
                "skeleton",
                "swap",
                "validator",
            ],
            layer: "utilities",
        })
        await packCss({
            outputFile: "acme.responsive.css",
            exclude: {
                colors: ["properties-extended", "responsive-extended", "states-extended"],
                components: [],
                utilities: [],
            },
        })
        await packCss({
            outputFile: "acme.css",
            light: true,
            exclude: {
                colors: ["properties-extended", "responsive-extended", "states-extended"],
                components: [],
                utilities: [],
            },
        })
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

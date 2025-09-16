import { extractClasses } from "./functions/extractClass.js"
import { generatePlugins } from "./functions/generatePlugins.js"
import { generateImports } from "./functions/generateImports.js"
const build = async () => {
    console.log("Building ds-css...");
    await extractClasses({ srcDir: "components" });
    await generatePlugins({ type: "component", srcDir: "src/components", distDir: "components" });
    await generateImports("imports.js");
}
build();
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import stylelint from "stylelint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsonPath = resolve(__dirname, "dist/acme-allowed-vars.json");
const vars = JSON.parse(readFileSync(jsonPath, "utf8"));

const {
    createPlugin,
    utils: { report, ruleMessages, validateOptions }
} = stylelint;

// Définition de la règle
/** @type {import('stylelint').Rule} */
const noUnknownCssVars = () => {
    return (root, result) => {
        root.walkDecls((decl) => {
            const regex = /var\((--[a-zA-Z0-9-_]+)\)/g;
            let match;
            while ((match = regex.exec(decl.value))) {
                if (!vars.includes(match[1])) {
                    result.warn(`Unknown CSS variable ${match[1]}`, {
                        node: decl,
                        rule: noUnknownCssVars.ruleName,
                    });
                }
            }
        });
    };
};


const ruleName = "acme/no-unknown-css-vars";

const messages = ruleMessages(ruleName, {
    rejected: (name) => `Unknown CSS variable ${name}`,
});


noUnknownCssVars.ruleName = ruleName;
noUnknownCssVars.messages = messages;

export default createPlugin(ruleName, noUnknownCssVars);
const { readFileSync } = require("fs");
const { resolve, dirname } = require("path");
const { createPlugin, utils } = require("stylelint");
const vars = JSON.parse(readFileSync(resolve(__dirname, "dist/acme-css-theme.json"), "utf8"));

const ruleName = "acme/no-unknown-css-vars";
const messages = utils.ruleMessages(ruleName, {
    rejected: (name) => `Unknown CSS variable ${name}`,
});

const noUnknownCssVars = () => (root, result) => {
    root.walkDecls((decl) => {
        const regex = /var\((--[a-zA-Z0-9-_]+)\)/g;
        let match;
        while ((match = regex.exec(decl.value))) {
            if (!vars.includes(match[1])) {
                result.warn(messages.rejected(match[1]), { node: decl, rule: ruleName });
            }
        }
    });
};

noUnknownCssVars.ruleName = ruleName;
noUnknownCssVars.messages = messages;

module.exports = createPlugin(ruleName, noUnknownCssVars);

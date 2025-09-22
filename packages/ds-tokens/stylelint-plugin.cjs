const { readFileSync } = require("fs");
const { resolve } = require("path");
const { createPlugin, utils } = require("stylelint");

const vars = JSON.parse(
    readFileSync(resolve(__dirname, "dist/acme-allowed-vars.json"), "utf8")
);

const ruleName = "acme/no-unknown-css-vars";
const messages = utils.ruleMessages(ruleName, {
    rejected: (name) => `Unknown CSS variable ${name}`,
});

const noUnknownCssVars = (primaryOption = {}, _secondaryOptions, context) => {
    const allowedExtra = Array.isArray(primaryOption?.allowedExtraVars)
        ? primaryOption.allowedExtraVars
        : [];

    const allowedVars = [...vars, ...allowedExtra];

    return (root, result) => {
        root.walkDecls((decl) => {
            const regex = /var\((--[a-zA-Z0-9-_]+)\)/g;
            let match;
            while ((match = regex.exec(decl.value))) {
                if (!allowedVars.includes(match[1])) {
                    utils.report({
                        message: messages.rejected(match[1]),
                        node: decl,
                        result,
                        ruleName,
                    });
                }
            }
        });
    };
};

noUnknownCssVars.ruleName = ruleName;
noUnknownCssVars.messages = messages;

module.exports = createPlugin(ruleName, noUnknownCssVars);

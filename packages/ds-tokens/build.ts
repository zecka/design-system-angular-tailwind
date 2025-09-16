
import StyleDictionary, { TransformedToken } from "style-dictionary";
import { logBrokenReferenceLevels, logVerbosityLevels, transformTypes } from "style-dictionary/enums";
import { variableGroups } from "./variable-groups";

const cssFileNames = variableGroups.map(group => group.items.map(item => `${group.cssPrefix}${item.value}.css`)).flat();
cssFileNames.unshift('base.css');

const baseSources = variableGroups.map(g => `tokens/token_${g.id}_${g.items[0].value}.json`)



StyleDictionary.registerTransform({
    type: transformTypes.value,
    name: "value/px-for-number",
    filter: (token, options) => {
        const isPx = [
            'font-size',
            'number-spacing',
            'number-screen',
            'number-width',
            'number-radius',
            'number-blur'
        ].some(s => token.name.includes(s));

        return isPx
    },
    transform: (token) => {
        return `${token.value}px`;
    },
});

const build = async () => {
    const resultPromises = variableGroups.map(group => {
        return group.items.map(item => {
            const filename = `token_${group.id}_${item.value}.json`;

            const sd = new StyleDictionary({
                log: {
                    // verbosity: logVerbosityLevels.verbose,
                    errors: { brokenReferences: logBrokenReferenceLevels.console },
                },
                source: [
                    // toujours les fondations de base
                    "tokens/token_foundations_default.json",
                    ...baseSources,
                    // le fichier spécifique
                    `tokens/${filename}`,
                ],
                platforms: {
                    css: {
                        transformGroup: "css",
                        transforms: ["value/px-for-number"],
                        buildPath: "build/css/",
                        files: [
                            {
                                destination: `${group.cssPrefix}${item.value}.css`, // 👈 fichier correct
                                format: "css/variables",
                                options: {
                                    selector: `.${group.cssPrefix}${item.value}`,
                                    outputReferences: true,
                                    outputReferenceFallbacks: true,
                                },
                                filter: (token) =>
                                    token.filePath.includes(`token_${group.id}_${item.value}.json`)
                            },
                        ],
                    },
                },
            });
            return sd.buildAllPlatforms();
        })
    });
    await Promise.all(resultPromises.flat());
    const sd = new StyleDictionary({
        source: [
            "tokens/token_*",
        ],
        platforms: {
            css: {
                transformGroup: "css",
                transforms: ["value/px-for-number"],
                buildPath: "build/css/",
                files: [
                    {
                        destination: "base.css",
                        format: "css/variables",
                        options: {
                            selector: ":root",
                            outputReferences: true,
                            outputReferenceFallbacks: true
                        },
                        filter: (token) =>
                            token.filePath.includes("token_foundations_default.json")
                    },
                ],
            }
        }
    });
    await sd.buildAllPlatforms();

    // generate index.css
    const indexContent = cssFileNames.map(fileName => `@import './${fileName}';`);
    indexContent.unshift(`/**\n * Do not edit directly, this file was auto-generated.\n */\n`);
    await import('fs').then(fs => {
        fs.writeFileSync('build/css/index.css', indexContent.join('\n'));
    });
}

build();
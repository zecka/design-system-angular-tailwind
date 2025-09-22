
import StyleDictionary, { File, PlatformConfig } from "style-dictionary";
import { logBrokenReferenceLevels, logVerbosityLevels } from "style-dictionary/enums";
import './style-dictionary.extends';
import { variableGroups } from "./variable-groups.js";
import path from "path";
import { fileURLToPath } from "url";

const cssFileNames = variableGroups.map(group => group.items.map(item => `${group.cssPrefix}${item.value}.css`)).flat();
cssFileNames.unshift('base.css');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseSources = variableGroups.map(g => `src/tokens/token_${g.id}_${g.items[0].value}.json`)

const distPath = path.resolve(__dirname, '../dist');

const cssBuildFiles = (opts: { filesName: string, selector: string, filter: File['filter'] }): File[] => {
    return [
        {
            destination: `${opts.filesName}.css`,
            format: "css/variables",
            options: {
                selector: opts.selector,
                outputReferences: true,
                outputReferenceFallbacks: false,
            },
            filter: opts.filter
        },
        {
            destination: `${opts.filesName}.js`,
            format: "javascript/dictionnary-object-const",
            options: {},
            filter: opts.filter
        },
        {
            destination: `${opts.filesName}.d.ts`,
            format: "typescript/dictionnary-object-const-def",
            options: {},
            filter: opts.filter
        },
        {
            destination: `${opts.filesName}.types.ts`,
            format: "typescript/declarations",
            filter: opts.filter,
        },
        {
            destination: `${opts.filesName}.json`,
            format: "json/css-variables-list",
            filter: opts.filter,
        }
    ]

}
const build = async () => {
    const resultPromises = variableGroups.map(group => {
        return group.items.map(item => {
            const filename = `token_${group.id}_${item.value}.json`;

            const variableGroup = new StyleDictionary({
                log: {
                    // verbosity: logVerbosityLevels.verbose,
                    errors: { brokenReferences: logBrokenReferenceLevels.console },
                },
                source: [
                    "src/tokens/token_foundations_default.json",
                    ...baseSources,
                    `src/tokens/${filename}`,
                ],
                platforms: {
                    css: {
                        transformGroup: "css",
                        transforms: ["value/px-for-number"],
                        buildPath: distPath,
                        files: [
                            ...cssBuildFiles({
                                filesName: `${group.cssPrefix}${item.value}`,
                                selector: `.${group.cssPrefix}${item.value}`,
                                filter: (token) =>
                                    token.filePath.includes(`token_${group.id}_${item.value}.json`)
                            })
                        ],
                    },
                },
            });
            return variableGroup.buildAllPlatforms();
        })
    });

    await Promise.all(resultPromises.flat());

    const foundationDefault = new StyleDictionary({
        source: [
            "src/tokens/token_*",
        ],
        platforms: {
            css: {
                transformGroup: "css",
                transforms: ["value/px-for-number"],
                buildPath: distPath,
                files: [
                    ...cssBuildFiles({
                        filesName: `base`,
                        selector: `:root`,
                        filter: (token) =>
                            token.filePath.includes("token_foundations_default.json")
                    }),
                ],
            },
        }
    });
    const tsDeclaration = new StyleDictionary({
        log: {
            verbosity: logVerbosityLevels.silent,
            errors: { brokenReferences: logBrokenReferenceLevels.console },
        },
        source: [
            "src/tokens/token_*",
        ],
        platforms: {
            ts: {
                transformGroup: "css",
                buildPath: distPath,
                files: [
                    ...cssBuildFiles({
                        filesName: `acme-allowed-vars`,
                        selector: `@theme`,
                        filter: () => true
                    }),
                ]
            }
        }
    });
    await Promise.all([
        foundationDefault.buildAllPlatforms(),
        tsDeclaration.buildAllPlatforms()
    ]);

    const indexContent = cssFileNames.map(fileName => `@import './${fileName}';`);
    indexContent.unshift(`/**\n * Do not edit directly, this file was auto-generated.\n */\n`);
    await import('fs').then(fs => {
        fs.writeFileSync(path.resolve(distPath, './index.css'), indexContent.join('\n'));
    });

}

build();
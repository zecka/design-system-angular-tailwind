
const version = ""
import { plugin } from "./functions/plugin.js"
import { pluginOptionsHandler } from "./functions/pluginOptionsHandler.js"
import { components } from "./imports.js"
import variables from "@acme/ds-tokens/acme-allowed-vars";

export default plugin.withOptions(
    (options) => {
        return ({ addBase, addComponents, addUtilities }) => {
            const {
                include,
                exclude,
                prefix = "",
            } = pluginOptionsHandler(options, addBase, {}, version)

            const shouldIncludeItem = (name) => {
                if (include && exclude) {
                    return include.includes(name) && !exclude.includes(name)
                }
                if (include) {
                    return include.includes(name)
                }
                if (exclude) {
                    return !exclude.includes(name)
                }
                return true
            }

            Object.entries(components).forEach(([name, item]) => {
                if (!shouldIncludeItem(name)) return
                item({ addComponents, prefix })
            })

        }
    },
    () => ({
        theme: variables,
    }),
)


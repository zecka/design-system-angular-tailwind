import fs from "fs/promises"
import path from "path"
import { getFileNames } from "./getFileNames.js"
import { cleanCss } from "./cleanCss.js"

const directoryMap = {
    // "./base": false,
    "./components": false,
    // "./utilities": false,
    // "./colors": "utilities",
}


export const packCss = async ({
    outputFile,
    light = false,
    exclude = {
        colors: [],
        components: [],
        utilities: [],
    },
}) => {
    const allExcludeFiles = [
        ...(exclude.colors?.map((file) => `${file}.css`) || []),
        ...(exclude.components?.map((file) => `${file}.css`) || []),
        ...(exclude.utilities?.map((file) => `${file}.css`) || []),
    ]
    const [otherCSS] = await Promise.all([
        readAllCSSDirectories(allExcludeFiles, light),
    ])

    await writeContentToFile(outputFile, otherCSS.join("\n"))
}
const readAllCSSDirectories = async (excludeFiles = [], light = false) => {
    const directories = Object.keys(directoryMap)

    const allContents = await Promise.all(
        directories.map((dir) => readDirectoryContent(dir, directoryMap[dir], excludeFiles, light)),
    )
    return allContents.flat()
}
const readDirectoryContent = async (directory, layerName, excludeFiles = [], light = false) => {
    const files = await getFileNames(directory, ".css", false)
    let filteredFiles = filterExcludedFiles(files, excludeFiles).filter(file => light ? file.endsWith(".light") : !file.endsWith(".light"))
    const contents = await Promise.all(
        filteredFiles.map(async (file) => {
            const content = await readFileContent(`${directory}/${file}.css`)
            return wrapInLayer(content, layerName)
        }),
    )

    return contents
}
const readFileContent = async (filePath) => {
    return await fs.readFile(filePath, "utf8")
}
const wrapInLayer = (content, layerName) => {
    return layerName ? `@layer ${layerName}{\n${content}\n}` : content
}

const filterExcludedFiles = (files, excludeFiles) => {
    return files.filter((file) => !excludeFiles.includes(`${file}.css`))
}
const writeContentToFile = async (file, content) => {
    const cleanedContent = cleanCss(content)
    await fs.writeFile(file, cleanedContent)
}
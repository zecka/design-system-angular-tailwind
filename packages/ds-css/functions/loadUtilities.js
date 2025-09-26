import fs from 'fs'
export const loadUtilities = () => {
    const utilitiesDir = fs.readdirSync('./src/utilities')
    let utilitiesContent = ''
    for (const file of utilitiesDir) {
        if (file.endsWith('.css')) {
            const content = fs.readFileSync(`./src/utilities/${file}`, 'utf-8')
            utilitiesContent += `\n${content}\n`
        }
    }
    return utilitiesContent
}

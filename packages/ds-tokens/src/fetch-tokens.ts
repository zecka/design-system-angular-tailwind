import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const fetchCollection = async (url: string) => {
    const urlObject = new URL(url);
    const params = urlObject.searchParams;
    const collectionName = params.get('collection_name');
    if (collectionName === 'states') {
        console.log(`Skipping states collection`);
        return;
    }
    const modeName = params.get('mode_name');
    const fileName = `token_${collectionName}_${modeName}.json`;
    console.log(`Fetching ${fileName}...`);
    const res = await fetch(url);
    const json = await res.json();
    fs.writeFileSync(`./tokens/${fileName}`, JSON.stringify(json, null, 2));
    console.log(`Saved ${fileName}`);
    return;
}
const fetchTokens = async () => {
    if (!process.env.ZERO_HEIGHT_TOKENS_URL) {
        console.error('ZERO_HEIGHT_TOKENS_URL is not defined in .env file');
        return;
    }
    const results = await fetch(process.env.ZERO_HEIGHT_TOKENS_URL);
    const all = await results.text();
    const urls = all.split('\n');

    // Make dir if not exists
    if (!fs.existsSync('./tokens')) {
        fs.mkdirSync('./tokens');
    }
    const promises: Promise<void>[] = [];
    for (const url of urls) {
        promises.push(fetchCollection(url));
    }
    await Promise.all(promises);
}
fetchTokens()
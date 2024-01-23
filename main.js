const { igusername,
    password,
    generateDevice,
    login, fetchLatestPosts } = require("./igClient.js")
const {
    readDataJSON,
    wait } = require("./util.js")
const { targetChatId,
    startClient } = require("./waClient.js")
const { MessageMedia } = require("whatsapp-web.js")


const intervalSeconds = 120;
let lastPost = {};
sites = {
    'figureconsign': 2, 'consigngaming': 2, 'chemicy.consignment': 3, 'gametech_com': 2, 'thelazytitip': 3, 'gamertown.id': 0
}
sitesId = { 'figureconsign': 45077315629, 'consigngaming': 9912532974, 'chemicy.consignment': 18374626902, 'gametech_com': 32565424389, 'thelazytitip': 36062233574, 'gamertown.id': 27995301463 }

if (!Object.values(lastPost).includes("figureconsign")) {
    lastPost = readDataJSON("lastPost.json");
}

async function Run(waClient, igClient, chatId = `6281227986003@c.us`) {
    for (const account in sites) {
        const target = sites[account];
        const targetId = sitesId[account] != undefined ? sitesId[account] : 0;
        const data = await fetchLatestPosts(igClient, account, target, targetId);

        if (data?.postId && (!lastPost[account] || lastPost[account] !== data.postId)) {
            lastPost[account] = data.postId;
            for (let i = 0; i <= data.images.length - 1; i++) {
                if (data.images.length == i) {
                    await waClient.sendMessage(chatId, data.text);
                } else {
                    await waClient.sendMessage(chatId, await MessageMedia.fromUrl(data.images[i]), { unsafeMime: true, filename: `${i}.jpg` });
                }
            }
            console.log(`Send data from ig: ${account}`)
            await wait(1000);
        }
        console.log(data);
        await wait(20 * 1000);
    }
    syncWriteFile(`lastPost.json`, lastPost);
    console.log(lastPost);
}

async function main() {
    const igClient = await login(igusername, password, generateDevice);
    const waClient = await startClient();
    setInterval(Run, 10 * 60 * 1000, waClient, igClient);
}

main()
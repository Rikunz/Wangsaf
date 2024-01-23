const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const { IgApiClient } = require('instagram-private-api');
const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');


function syncWriteFile(filename, data) {
  writeFileSync(join(__dirname, filename), JSON.stringify(data, null, 4), {
    flag: 'w',
  });
}

function readDataJSON(json) {
  return JSON.parse(readFileSync(join(__dirname, json), 'utf-8'));
}

function wait(ms) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
};


async function login() {
  await ig.account.login("seithaaaaaa", "Thor1414");
  console.log("Logged in intagram!");
}

async function fetchLatestPosts(username, targetPost, targetUserId = 0) {
  try {
    if (targetUserId == 0) {
      const targetUser = await ig.user.searchExact(username);
      targetUserId = targetUser.pk;
      sitesId[targetUser] = userId
      console.log(targetUserId);
    }
    const latestPosts = await ig.feed.user(targetUserId);
    const posts = await latestPosts.items();

    if (!posts[targetPost]) {
      console.log(`No post found for ${username}`);
      return null;
    }

    const resultArray = [];
    let text = '';

    if (posts[targetPost].carousel_media) {
      for (let one of posts[targetPost].carousel_media) {
        if (one.image_versions2) {
          for (let two of one.image_versions2.candidates) {
            resultArray.push(two.url);
          }
        }
      }
    } else if (posts[targetPost].image_versions2) {
      for (let two of posts[targetPost].image_versions2.candidates) {
        resultArray.push(two.url);
      }
    }

    if (posts[targetPost].caption && posts[targetPost].caption.text) {
      text = posts[targetPost].caption.text;
    }

    return {
      postId: posts[targetPost].id,
      userId: targetUserId,
      username: username,
      text: text,
      images: resultArray
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}


async function Run(client) {
  for (const account in sites) {
    const target = sites[account];
    const targetId = sitesId[account] != undefined ? sitesId[account] : 0;
    const data = await fetchLatestPosts(account, target, targetId);

    if (data?.postId && (!lastPost[account] || lastPost[account] !== data.postId)) {
      lastPost[account] = data.postId;
      for (let i = 0; i <= data.images.length; i++) {
        if (data.images.length == i) {
          await client.sendMessage(groupId, data.text);
        } else {
          await client.sendMessage(groupId, await MessageMedia.fromUrl(data.images[i]), { unsafeMime: true, filename: `${i}.jpg` });
        }
      }
      await wait(1000);
    }
    console.log(data);
    await wait(20 * 1000);
  }
  syncWriteFile(`lastPost.json`, lastPost);
  console.log(lastPost);
}
const sites = {
  'figureconsign': 0, 'consigngaming': 0, 'chemicy.consignment': 3, 'gametech_com': 2, 'thelazytitip': 0, 'gamertown.id': 0
}
const sitesId = {
  'figureconsign': 45077315629, 'consigngaming': 9912532974, 'chemicy.consignment': 18374626902, 'gametech_com': 32565424389, 'thelazytitip': 36062233574, 'gamertown.id': 27995301463
}

const ig = new IgApiClient();
ig.state.generateDevice("seith");


const intervalSeconds = 120;
let lastPost = {};
const groupId = '120363182478430233@g.us'

if (!Object.values(lastPost).includes("figureconsign")) {
  lastPost = readDataJSON("lastPost.json");
}
console.log(lastPost);


async function main() {
  await login();
  const client = new Client({
    authStrategy: new LocalAuth()
  });
  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('Client is ready!');
  });

  await client.initialize();
  while (true) {
    await Run(client);
    await wait(intervalSeconds * 1000);
  }
}

main()
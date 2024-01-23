const { IgApiClient } = require('instagram-private-api');
require("dotenv").config()

const igusername = process.env.igusername
const password = process.env.password
const sites = process.env.sites
const sitesId = process.env.sitesId
const generateDevice = process.env.device

async function login(username, password, generateDevice) {
    const ig = new IgApiClient();
    ig.state.generateDevice(generateDevice);
    await ig.account.login(username, password);
    console.log("Logged in!");
    return ig
}

async function fetchLatestPosts(ig, username, targetPost, targetUserId = 0) {
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

module.exports = {
    igusername,
    password,
    sitesId,
    sites,
    generateDevice,
    login,
    fetchLatestPosts
}
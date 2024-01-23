const { IgApiClient } = require('instagram-private-api');

const ig = new IgApiClient();
ig.state.generateDevice("seith");

async function login() {
    await ig.account.login("seithaaaaaa", "Thor1414");
    console.log("Logged in intagram!");
}
  
async function main(){
    await login();
    const targetUser = await ig.user.searchExact("consigngaming");
    targetUserId = targetUser.pk;
    const latestPosts = await ig.feed.user(targetUserId);
    console.log(latestPosts)
}

main()
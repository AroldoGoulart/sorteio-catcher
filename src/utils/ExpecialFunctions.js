const CustomFunctions = require("./CustomFunctions")
const FileManager = require("./FileManager")

const config = require("../config.json")

const url_list = require("../scraped/posts_url.json")
const wordsBase = require("../data/worlds.json")
const emojisBase = require("../data/emojis.json")

const { 
    base_url, 
    querys: {
      post_description
    },
    selectors: { 
      username_field, 
      password_field, 
      login_button, 
      not_now_button, 
      not_trust_in_this_device,
      search_input
    }
} = config;

// Logar, realizar scrap da hashToScrap e salvar como outputName
async function LoginAndScrap(page, hashToScrap, outputName) {
    const { Login, RefuseAllNotifications, Search, ScrollDownPage, GetLinkPosts } = CustomFunctions;
  
    await Login(page)
    await RefuseAllNotifications(page)
    await Search(page, hashToScrap)
    await ScrollDownPage(page);
  
    const dataPosts = await GetLinkPosts(page)
  
    await FileManager.SaveFile(dataPosts, outputName)
}
  
// Extrair dados dos posts
async function ScrapPostsDescriptionsAndSave(page, outputName) {
    const { GetPostsDescriptions } = CustomFunctions;

    const descriptions = await GetPostsDescriptions(page, url_list);

    await FileManager.SaveFile(descriptions, outputName)
}

async function TypeLikeHuman(page, id) {
    let randomMensage = Math.floor(Math.random() * 3)
    await page.waitForTimeout(2000)
    let mensagem = ""

    function getFirstWord(wordsArray) {
        let mensagemArray = wordsArray.split(",");
        mensagemArray = mensagemArray[0];

        return mensagemArray
    }

    if(randomMensage <= 0) {
        mensagem = emojisBase[id]
        await page.keyboard.type(mensagem)
    }
    else if(randomMensage == 1) {
        mensagem = wordsBase[(Math.floor(Math.random() * wordsBase.length))]
        mensagem = getFirstWord(mensagem)

        for(let i=0; i < mensagem.length; i++) {
        await page.keyboard.type(mensagem[i])
        await page.waitForTimeout(630)
        }
    }
    else {
        mensagem = wordsBase[(Math.floor(Math.random() * wordsBase.length))]
        mensagem = getFirstWord(mensagem)

        for(let i=0; i < mensagem.length; i++) {
        await page.keyboard.type(mensagem[i])
        await page.waitForTimeout(982)
        }
        await page.keyboard.type(` ${emojisBase[id]}`)
    }
}

// Comentar em um post (por url)
async function CommentInPost(page, url_link, timesToComment, needFriends, stopIn = 0) {  
    const { base_url, selectors: { post_comment } } = config
    const link_post = `${base_url+url_link}`

    const { Login } = CustomFunctions; 
    let returnedStopEmojiId = stopIn

    console.log(`
        Link: ${link_post}
        value: ${url_link}
        repeat: ${timesToComment}
        needFriends: ${needFriends}
    `)
        
    if(!needFriends) {
        await Login(page)
        await page.goto(link_post, { timeout: 60000 })
        let repetionTimes = stopIn + timesToComment

        for(let i = stopIn; i <= repetionTimes; i++) {
            // Escolhe uma mensagem aleatoria entre as do database
            let mensagem = emojisBase[i] 

            await page.click(post_comment)
            await TypeLikeHuman(page, i)

            // Esperar de 1 a 3 segundos até apertar para enviar comentario
            let sleepTimeToEnter = 1000 * (Math.floor(Math.random() * 3) + 1)
            await page.waitForTimeout(sleepTimeToEnter)
            await page.keyboard.press('Enter')

            console.log(`Comment number ${i} ${mensagem}`)
            
            // Levar de 1 até 10 segundos
            let sleepTime = 1000 * (Math.floor(Math.random() * 10) + 1)
            console.log("I will sleep for ", sleepTime, " seg")

            returnedStopEmojiId++
            await page.waitForTimeout(sleepTime)
        }
    }
    return returnedStopEmojiId 
}

module.exports = {
    LoginAndScrap,
    ScrapPostsDescriptionsAndSave,
    TypeLikeHuman,
    CommentInPost
};
  
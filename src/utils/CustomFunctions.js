const config = require("../config.json")

const { 
    base_url, 
    password, 
    username, 
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
  }} = config;

// Realiza o login
async function Login(page) {
    console.log("Logging..")
    
    await page.goto(base_url, { timeout: 60000 })
    await page.waitForTimeout(3000)

    await page.click(username_field)
    await page.keyboard.type(process.env['USER_TEST'])
  
    await page.click(password_field)
    await page.keyboard.type(process.env['PASS_TEST'])
  
    await page.click(login_button)
    console.log("Logged!")

    await page.waitForNavigation()
}

// Desce a pagina
async function ScrollDownPage(page) {
  console.log("Start scroll..")
  await page.evaluate(async () => {
    async function sleep() {
      console.log("Sleeping.. (waiting for page loading)")
      await new Promise(r => setTimeout(r, 2000));
      console.log("I awake sir! (page loaded)")
    }

    function scroll(){
        let totalHeight = document.body.scrollHeight;
        let distance = 150;
        let scrolledHeight = 0;

        while(scrolledHeight <= totalHeight) {
            window.scrollBy(0, distance);
            scrolledHeight += distance;
        }
    }   

    for(let i=0; i <= 3; i++){
        scroll()
        await sleep()
    }
  })
  console.log("Scroll is done!")
}

// Recusa pop-us do navegador
async function RefuseAllNotifications(page) {
    console.log("Refusing..")
    await page.click(not_trust_in_this_device)

    await page.waitForNavigation()
    await page.click(not_now_button)
    console.log("Refused!")
}

// Pesquisa por textForSearch
async function Search(page, textForSearch) {
    console.log(`Searching for ${textForSearch}..`)
    await page.click(search_input)
    await page.keyboard.type(textForSearch)
  
    await page.waitForTimeout(3000)
  
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000)
  
    await page.keyboard.press("Enter");
  
    await page.waitForTimeout(10000)
    console.log(`Searched!`)
}

// vai até a pagina principal
async function GoToMainPage(page) {
    console.log(`Going to main page..`)

    await page.goto(base_url, { timeout: 60000 })
    await page.waitForTimeout(3000)

    console.log(`You are in main page now!`)
}

// Coleta os links de todos os posts pesquisados na pagina
async function GetLinkPosts(page) {
    let response = await page.evaluate(() => {
      // executar JS DOM no console do navegador
      const nodeList = document.querySelectorAll("article a");
    
      const listArray = [...nodeList]
      let cleanedArray = []
      
      // tratar array para retornar apenas dados desejados
      // base uri e link do post
      listArray.forEach(({ attributes }) => {
        const href = attributes[0];
        const { baseURI, value } = href;
        cleanedArray.push({ baseURI, value })
      })
      return cleanedArray
    })
  
    return response
}

async function GetPostsDescriptions(page, urls_array){
  let descriptionPost = [];
  const data = urls_array;
  console.log("Number of posts", data.length)

  for(let i=0; i < data.length; i++){ 
    try {
      let dataValue = data[i].value
      let pageTogo = `${base_url+dataValue}`

      await page.goto(pageTogo)
      await page.waitForTimeout(5000)

      let response = await page.evaluate(() => {
        let param = "#react-root > section > main > div > div.ltEKP > article > div.eo2As > div.EtaWk > ul > div > li > div > div > div.C4VMK > span"
        let htmlPost = document.querySelectorAll(param)
        
        htmlPost1 = [...htmlPost]
        htmlPost1 = htmlPost1[0].outerText

        return htmlPost1
      })

      descriptionPost.push({ 
        key: i, 
        html_description: response ,
        url_full: pageTogo,  
        url_param: dataValue,
        error: null
      })
      console.log(`Dump the post ${i} !`)
    }
    catch(e) {
      descriptionPost.push({ 
        key: i, 
        hasError: true,
        error: e
      })
      console.log(`Error in ${i}`)
    }
  }

  return descriptionPost
}

module.exports = {
    Login,
    ScrollDownPage,
    GoToMainPage,
    Search,
    RefuseAllNotifications,
    GetLinkPosts,
    GetPostsDescriptions
};
  
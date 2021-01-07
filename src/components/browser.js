const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

const config = require("../config.json") 
let cache = require ("../scraped/cache_browser.json")

const CustomFunctions = require("../utils/CustomFunctions")
const ExpecialFunctions = require("../utils/ExpecialFunctions")
const FileManager = require('../utils/FileManager')

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

// Rotina de comentar em varios e varios comentarios
async function CommentRotine(post_sublink, timesToComment=5, needFriends=false) {
  const { CommentInPost } = ExpecialFunctions
  const { browser_settings } = config;
  const { SaveFile } = FileManager;

  const browser = await puppeteer.launch(browser_settings); 
  const page = await browser.newPage();

  let stopIn = cache[0].idStoped;
  stopIn = await CommentInPost(page, post_sublink, timesToComment, needFriends, stopIn)
  cache[0].idStoped = stopIn

  console.log(`
    Comment done time ${stopIn}
    Saving id..
  `)

  await browser.close()
  await SaveFile(cache, "cache_browser")
  
  console.log("Hey master, good morning. Its over!")
}

module.exports = {
  CommentRotine
}
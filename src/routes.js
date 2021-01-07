const cron = require('node-cron');
const express = require('express');
const router = express.Router();

const browser = require("./components/browser")

router.get('/', function (req, res) {
  res.send('First Page of bot');
})

router.get('/post', function (req, res, next) {
  const { query : { id } } = req
  res.send(`Para usar essa pagina vá para post/id do post sorteio`);
})

router.get('/post/:id', function (req, res, next) {
  const { CommentRotine } = browser;
  
  const { params : { id } } = req
  const sub_url = `/p/${id}/` 

  console.log("Iniciando cron para post: ", sub_url)
  CommentRotine(sub_url)

  // seg min hour mday month wday
  console.log("Cron irá rodar apartir de uma hora..")
  cron.schedule("* * 1 * * *", 
    () => {
      console.log("Cron acordada, iniciando..")
      CommentRotine(sub_url)
    }
  )
  res.send(`Iniciando cron para post: ${sub_url}`);
})

module.exports = router
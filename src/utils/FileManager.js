const fs = require("fs");

async function SaveFile(file, filename) {
  let fileName = `${filename}.json`
  fs.writeFile(
    `./src/scraped/${fileName}`,
    JSON.stringify(file, null, 2),
    (err) => {
      if(err) throw new Error("Sorry sir, we have a problem")
      console.log(`The file ${filename} has been save, sir!`)
    }
  )  
}

module.exports = {
  SaveFile 
};


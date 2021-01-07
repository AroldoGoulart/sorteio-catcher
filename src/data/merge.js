// um simples arquivo para mergiar tres jsons

const FirstEmojiList = require("./original/emojiSet1.json")
const SecondEmojiList = require("./original/emojiSet2.json")
const ThirdEmojiList = require("./original/emojiSet3.json")

const FileManager = require("../utils/FileManager")
const dataMerged = require("./Teste.json")

console.log("Emojis in each file")
console.log(FirstEmojiList.length)
console.log(SecondEmojiList.length)
console.log(ThirdEmojiList.length)    

const listOne = FirstEmojiList.map((emoji) => emoji.character )
const listOneCode = FirstEmojiList.map((emoji) => emoji.codePoint )

const listTwo = SecondEmojiList.map((emoji) => emoji.emoji)

const listThree = ThirdEmojiList.map((emoji) => emoji.char)
const listThreeCode = ThirdEmojiList.map((emoji) => emoji.codes)

console.log(listOne)
console.log(listTwo)
console.log(listThree)

/*
let finalList = listThree

for(let i=0; i<= listThreeCode.length; i++) {
    for(let j=i; j <= listOne.length; j++) {
        if(listOne[j] && listOne[j] != listThree[i]){
            let uniqueChar = true
            let cont = 0;
            for(let k=0; k<= finalList.length; k++) {
                if(finalList[k] == listOne[j]) {
                    uniqueChar = false
                    break
                } 
            }
            if(uniqueChar) {
                finalList.push(listOne[j])
            }
        }   
    }
}   

FileManager.SaveFile(finalList, "Teste")
console.log(finalList.length)

*/

let dataFinal = dataMerged
let newDataFinal = dataMerged

for(let i=0; i<= dataFinal.length; i++) {
    for(let j=i; j <= listTwo.length; j++) {
        if(listTwo[j] && listTwo[j] != dataFinal[i]){
            let uniqueChar = true
            for(let k=0; k<= newDataFinal.length; k++) {
                if(newDataFinal[k] == listTwo[j]) {
                    uniqueChar = false
                    break
                } 
            }
            if(uniqueChar) {
                newDataFinal.push(listTwo[j])
            }
        }   
    }
}   

FileManager.SaveFile(newDataFinal, "book")
console.log(newDataFinal.length)
const {readFile, writeFile} = require('fs')
const util = require('util')

const express = require("express")
const bodyParser = require("body-parser")
const app = express()
// var { unicornsJSON } = require('./data.js')
var unicornsjSON = []

const readFileAsync = util.promisify(readFile)
const writeFileAsync = util.promisify(writeFile)

const port = 5050

// Middlewares
app.use(bodyParser.json())
app.use(express.json())

app.get('/api/v1/unicorns', (req, res) => {
    res.send(unicornsJSON)
})
  
app.post('/api/v1/unicorn', (req, res) => {
    unicornsJSON.push(req.body)
    console.log(unicornsJSON)
    //update the file
    writeFileAsync('./data.json', JSON.stringify(unicornsJSON), "utf-8")
      .then(() => { })
      .catch((err) => { console.log(err); })
    res.end()
})
  
app.get('/api/v1/unicorn/:id', (req, res) => {
    var found = false
    for (i = 0; i < unicornsJSON.length; i++) {
      if (unicornsJSON[i]._id == req.params.id) {
        found = true
        break
      }
    }
  
    if (found) { res.json(unicornsJSON[i]); return }
    res.json({ msg: "not found" })
})
  
app.patch('/api/v1/unicorn/:id', (req, res) => {
    unicornsJSON = unicornsJSON.map(({ _id, ...aUnicorn }) => {
      if (_id == req.body._id) {
        console.log("Bingo!");
        return req.body
      } else
        return aUnicorn
    })
    writeFileAsync('./data.json', JSON.stringify(unicornsJSON), "utf-8")
      .then(() => { })
      .catch((err) => { console.log(err); })
    res.send("Updated successfully!")
})
  
app.delete('/api/v1/unicorn/:id', (req, res) => {
    unicornsJSON = unicornsJSON.filter((element) => element._id != req.params.id)
    writeFileAsync('./data.json', JSON.stringify(unicornsJSON), "utf-8")
      .then(() => { })
      .catch((err) => { console.log(err); })
    res.send("Deleted successfully?")
})

app.listen(process.env.PORT || port, async (err) => {
  if (err) {
    console.error(err);
  }
  try {
    unicornsJSON = await readFileAsync('./data.json', 'utf-8')
    if (!unicornsJSON) {
      console.log("Could not read the file");
      return
    }
    unicornsJSON = JSON.parse(unicornsJSON)
    console.log(unicornsJSON);
  } catch (error) {
    console.log(error);
  }

  console.log(`Example app listening on port ${port}`)
})
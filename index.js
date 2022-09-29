const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const {Schema} = mongoose

const unicornSchema = new Schema({
  "name": String, // String is shorthand for {type: String}
  "weight": Number,
  "loves": [String],
  "gender": {
    enum: ["f", "m"]
  },
  "vampires": Number,
  "dob": Date
});
const unicornModel = mongoose.model('unicorns', unicornSchema)


const app = express()
const port = 5050

app.use(bodyParser.json())
app.use(express.json())

// app.get('/api/v2/unicorns')           // - get all the unicorns
// app.post('/api/v2/unicorn')          // - create a new unicorn
// app.get('/api/v2/unicorn/:id')       // - get a unicorn
// app.patch('/api/v2/unicorn/:id')     // - update a unicorn
// app.delete('/api/v2/unicorn/:id')       // - delete unicorn

app.get("/api/v2/unicorns", async (req, res) => {
  const unicorns = unicornModel.find({})
    .then((docs) => {
      res.json(docs).end()
    })
    .catch((err) => {
      console.log(`Error encountered when getting all unicorns ${err}`)
      res.end("Error")
    });
})

app.get("/api/v2/unicorn/:id", async (req, res) => {
  const {id} = req.params;
  const unicron = unicornModel.find({_id: mongoose.Types.ObjectId(`${id}`)})
    .then((doc) => {
      console.log(doc);
      res.json(doc).end()
    })
    .catch((err) => {
      console.log(`Error encountered when getting unicorn ${err}`)
      res.end("Error")
    })
})

app.post("/api/v2/unicorn", async (req, res) => {
  const newUnicorn = req.body;
  unicornModel.create(newUnicorn, (err) => {
    if (err) {
      console.error(err)
    }
  })
  res.json(newUnicorn)
})

app.patch("/api/v2/unicorn/:id", async (req, res) => {
  const {__id, ...newValues} =  req.body;
  unicornModel.updateOne({_id: mongoose.Types.ObjectId(req.params.id)}, 
    newValues, 
    (error, res) => {
      if (error) console.error(error)
      console.log(res)
    })
  res.send("Updated successfuly!")
})

app.delete("/api/v2/unicorn/:id", async (req, res) => {
  unicornModel.deleteOne({_id: mongoose.Types.ObjectId(req.params.id)}, 
    function (err, result) {
      if (err) {
        console.error(err)
      }
      console.log(result);
    })
  res.send(`Unicorn ${req.params.id} deleted successfully`)
})

app.listen(process.env.PORT || port, async (err) => {
  if (err) {
    console.log(err)
  }
    try {
      await mongoose.connect('mongodb://localhost:27017/test')
    } catch (error) {
      console.log('db connection error', error);
    }
    console.log(`Example app listening on port ${port}`)
  }
)
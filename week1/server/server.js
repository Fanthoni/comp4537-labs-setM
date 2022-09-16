const express = require('express')
const bodyparser = require("body-parser");
const https = require('https');
const mongoose = require('mongoose');
cors = require("cors")


const json_cities = require('./data.js');
const app = express()

app.use(express.static('./public'));
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(cors())


mongoose.connect("mongodb://localhost:27017/test",
  {useNewUrlParser: true, useUnifiedTopology: true});

const citySchema = new mongoose.Schema({
    name: String,
    temperature: Number,
    description: String
 });
const cityModel = mongoose.model("cities", citySchema);

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.get('/contact', function (req, res) {
    res.send('Hi there, here is my <a href="mailto:nabil@eceubc.ca"> email </a>.')
})

app.post("/", function(req, res) {
    var apikey = "b660f3402c54cb9a9c48f89c35249e5c";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + req.body.cityName + "&units=metric&appid=" + apikey

    https.get(url, function(https_res) {
        https_res.on("data", function(data) {
        res.write("<h1> " + req.body.cityName + " weather is " + JSON.parse(data).weather[0].description) + "</h1>";
        res.write("<h1> " + req.body.cityName + " temp is " + JSON.parse(data).main.temp) + "</h1>";

        // console.log(JSON.parse(data).weather[0].icon );
        res.write('  <img src="' + "http://openweathermap.org/img/wn/" + JSON.parse(data).weather[0].icon + '.png"' + "/>");
        res.send();
        })
    });
})

// Get cities by name
app.get('/cities/:city_name', function(req, res) {
    console.log("received a request for "+ req.params.city_name);
    cityModel.find({name: req.params.city_name}, function(err, cities){
        if (err){
          console.log("Error " + err);
        }else{
          console.log("Data "+ JSON.stringify(cities));
        }
        res.send(JSON.stringify(cities));
    });
  })

// Get all cities
app.get('/cities', function(req, res) {
    cityModel.find({}, function(err, cities){
    if (err){
        console.log("Error " + err);
    }else{
        console.log("Data "+ JSON.stringify(cities));
    }
    res.send(JSON.stringify(cities));
    });
})

// GEt all cities from JSON file
app.get('/cities_from_json_file', function (req, res) {
    res.send(json_cities.list);
})

// Get city by name from JSON file
app.get('/cities_from_json_file/:city_name', function (req, res) {

    res.send(json_cities.list.filter(function(i_){
        return i_.name == req.params.city_name;
    }));
})


// Get temperature of a city from JSON file
function map_f(i_) {
return i_["tempreture"]

}

app.get('/city_temperature_from_json_file/:city_name', function (req, res) {

    res.send(json_cities.list.filter(function(i_){
        return i_.name == req.params.city_name;
    }).map(map_f));

})
  

// Add a city to the database
app.put("/insert", function(req, res){
    cityModel.create({
      name : req.body.name,
      temperature : req.body.temperature,
      description: req.body.description
    }, function(err, data){
      if(err) console.log(err);
      else
      console.log(data);
      res.send("All good! Inserted.")
    });
})

// Delete a city by name
app.delete("/delete/:city_name", function(req, res){
cityModel.remove({
    name : req.body.name
}, function(err, data){
    if(err) console.log(err);
    else
    console.log(data);
    res.send("All good! Delteted.")
});
})


app.listen(5050, function(err) {
    console.log(`Server is running at port 5050`)
    if(err) console.log(err);
})

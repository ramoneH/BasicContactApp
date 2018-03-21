//create a variable called express
//notify the app that it needs express framework
var express = require("express");
//bootstrap the app to express
var app = express();
//run this app on port 3000
var port = 3000;

// create a variable called mongoose
//notify the app that it needs mongoose framework
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
//connect the app to the db in the specified location
mongoose.connect("mongodb://localhost:27017/contactshowcase-app");

//inform the app to use ejs as it's view engine
app.set('view engine', 'ejs'); 

var contactFormSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    subject: String,
    message: String,
    created_at: {type: Date, default:Date.now()},
});

var Contact = mongoose.model("contact-form", contactFormSchema);


//body parser is a module in express package that helps apps
//parse data in http req body
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//creating a GET method
app.get('/', (req, res) => {
    //find is a mongoose function that helps get all results
    //from the specified schema
    Contact.find((err, result) =>
     {
      if (err) return console.log(err)
       //if success render index.ejs and assign results to
      // a templating variable named contacts that we can access
      //in index.ejs
      res.render('index.ejs', {contacts: result})
    })
  })


app.get("/style.css", (req, res) => {
    //sendFile is a method in express framework that sends file back
    //to the client
    res.sendFile(__dirname + "/style.css");
});


app.post("/save", (req, res) => {
    var myData = new Contact(req.body);
    myData.save()
        .then(item => {
            res.send("Contact Form saved to database");
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
});;





//informing your app to listen to port number you have provided on top
app.listen(port, () => {
    console.log("Server listening on port " + port);
});
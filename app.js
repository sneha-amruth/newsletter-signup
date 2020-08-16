//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const emailId = req.body.email;

    const data = {
        members: [{
            "email_address": emailId,
            "status": "subscribed",
            "merge_fields": {
              "FNAME": firstName,
              "LNAME": lastName
            }
          }]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/05f9cbdc7b";
    const options = {
        method: "POST",
        auth: "sneha:2aad165d6a29090f88db3f2add11c41d-us17"
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
     res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
})

//api key 2aad165d6a29090f88db3f2add11c41d-us17
//audience id 05f9cbdc7b



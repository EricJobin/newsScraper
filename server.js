var express = require("express");
var exphbs = require("express-handlebars");
// var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();

// Configure middleware

// // Use morgan logger for logging requests
// app.use(logger("dev"));
// NOTE REMOVE ALL logger OR dev VARIABLES FOUND IN SAMPLE CODE


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/homeworkdb", { useNewUrlParser: true }); //Commenting this out for Heroku Deployment???

//If deployed, use the deployed database, otherwise use local database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/homeworkdb"
mongoose.connect(MONGODB_URI);

// Routes

// A GET route for scraping /. --------------------------------------------------------------------
var results = [];
app.get("/scrape", function(req, res) {
	axios.get("https://slashdot.org/").then(function(response) {
		console.log("Scraping has been called")
		var $ = cheerio.load(response.data);
  		// var results = [];
  		$("article").each(function(i, element) {
			var storyBody = $(element).children('div.body').text();
			storyBody=storyBody.trim();
			storyBody=storyBody.replace(/(\')/gm, "&#39;");
			storyBody=storyBody.replace(/(\r\n|\n|\r)/gm,"")
		
			var storyLink = $(element).children('header').children('h2').children('span').children('span').children('a.story-sourcelnk').attr("href");
			var storyTitle = $(element).children('header').children('h2').children('span.story-title').children('a').text();

			if (storyTitle && storyBody && storyLink){
				results.push({
					storyTitle: storyTitle,
					storyBody: storyBody,
					storyLink: storyLink
				});
			}
		})
		//Create a new Article using the `result` object built from scraping
		db.Article.create(results)
		.then(function(dbArticle) {
			console.log("Pushing to Mongo")
	  		console.log(dbArticle);
		})
		.catch(function(err) {
	  		console.log(err);
		})
		.then(function() {
			db.Article.find({})
			.then(function(dbArticle) {
				res.json(dbArticle);
			})
		})
		.catch(function(err) {
			res.json(err);
		});
	});
});

// Route for adding a note to an Article
app.post("/addnote/:id", function(req, res) {
	// console.log(req.body);
	// console.log(req.params.id);
	// console.log(req.body.userNote);

	db.Article.update({_id: req.params.id}, {$set: {userNote: req.body.userNote} })
	.then(function(dbArticle) {
		console.log("Pushing to Mongo")
		console.log(dbArticle);
	})
	.then(function(dbArticle) {
		res.json(dbArticle);
	})
	.catch(function(err) {
		res.json(err);
	});
});

// Route for removing a note from an Article
app.post("/delnote/:id", function(req, res) {
	// console.log(req.body);
	// console.log(req.params.id);
	// console.log(req.body.userNote);

	db.Article.update({_id: req.params.id}, {$set: {userNote: req.body.userNote} })
	.then(function(dbArticle) {
		console.log("Pushing to Mongo")
		console.log(dbArticle);
	})
	.then(function(dbArticle) {
		res.json(dbArticle);
	})
	.catch(function(err) {
		// If an error occurred, send it to the client
		res.json(err);
	});
});



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

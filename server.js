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
mongoose.connect("mongodb://localhost/homeworkdb", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
var results = [];
app.get("/scrape", function(req, res) {
	axios.get("https://slashdot.org/").then(function(response) {
		console.log("Scraping has been called")
		var $ = cheerio.load(response.data);
  		// var results = [];
  		$("article").each(function(i, element) {
			var storyBody = $(element).children('div.body').text();
			storyBody = storyBody.trim();
			// storyBody=storyBody.replace("\n", "");
			// storyBody=storyBody.replace("\t", "");
			// storyBody=storyBody.replace("\\'", "TEST");
			storyBody=storyBody.replace(/(\')/gm, "&#39;");
			storyBody=storyBody.replace(/(\r\n|\n|\r)/gm,"")
			// These replaces aren't working
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
		// .then(function() {
		// 	db.Article.find({})
		// 	.then(function(dbArticle) {
		// 		res.json(dbArticle);
		// 	})
		// })
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


// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
	console.log("articles called")
	console.log(results)
	res.json(results);
  	// db.Article.find({})
	// .then(function(dbArticle) {
	// 	res.json(dbArticle);
	// })
	// .catch(function(err) {
	// 	res.json(err);
	// });
});

// Route for saving/updating an Article's associated Note
// app.post("/noteadd/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   	db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       	return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       	res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       	res.json(err);
//     });
// });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

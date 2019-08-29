var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	storyTitle: {
		type: String,
		unique: true,
    	required: true
	},
	storyLink: {
		type: String,
		unique: true,
    	required: true,
	},
	storyBody: {
		type: String,
		unique: true,
    	required: true,
	},
	userNote: {
		type: String,
	}
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;

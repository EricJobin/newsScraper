// Grab the articles as a json and renders them to dom
$.getJSON("/scrape", function(data) {
	console.log(data)
	for (var i = 0; i < data.length; i++) {
		//Appending articles
		$("#articles").append(`<div class = "savedArticle">
		Title: ${data[i].storyTitle}<br>
		Link: <a href=${data[i].storyLink}><strong>${data[i].storyLink}</strong></a><br>
		${data[i].storyBody} <br>`);

		//Appending notes, if any
				if (data[i].userNote){
			$("#articles").append(`<div class ="note">
					${data[i].userNote}
					<button type="button" class="removeNote" id=${data[i]._id}>Delete Note</button>
			</div>`)
		}
		//Appending form to add note if no notes
		else {
		$("#articles").append(`
			<form id="formId${data[i]._id}">
				Article Notes:<br>
				<input type="text" name="userNote${data[i]._id}"><br>
				<input type="submit" value="Submit" class="addNote" id=${data[i]._id}>

			</form>`)
			// <input type="submit" value="Submit" class="addNote" id=${data[i]._id}>
			//<button class="addNote" id=${data[i]._id}>Add Note</button>
			// <button class="xbuttons">Click</button>
		}

		$("#articles").append(`</div><hr>`)

	}
});

// --- Function to add note to database, called in document.on click below --------
function addNote(){
	event.preventDefault();
	// console.log("click addNote");
	let inputid= event.path[0].id;
	var userNote=$(`input[name=userNote${inputid}`).val();

	$.ajax({
	    method: "POST",
	    url: `/addnote/${inputid}`,
	    data: {
	    	userNote: userNote,
	    }
	})
	.then(function(data) {
		console.log(url);
		console.log(data);
	});
}

//----------------------------------------------REFERENCE CODE----------------------------------------------------
$(document).on("click", "#savenote", function() {
	  // Grab the id associated with the article from the submit button
	  var thisId = $(this).attr("data-id");
	
	  // Run a POST request to change the note, using what's entered in the inputs
	  $.ajax({
	    method: "POST",
	    url: "/articles/" + thisId,
	    data: {
	      // Value taken from title input
	      title: $("#titleinput").val(),
	      // Value taken from note textarea
	      body: $("#bodyinput").val()
	    }
	  })
	    // With that done
	    .then(function(data) {
	      // Log the response
	      console.log(data);
	      // Empty the notes section
	      $("#notes").empty();
	    });
	
	  // Also, remove the values entered in the input and textarea for note entry
	  $("#titleinput").val("");
	  $("#bodyinput").val("");
});//-------------------------END OF REFERENCE CODE------------------------------------

//------------------------------------
function removeNote(){
	event.preventDefault();
	// console.log("click delNote")
	// console.log(this.id);
}

// function clickTest(){
// 	event.preventDefault();
// 	console.log("clickky")
// }

$(document).on("click", ".addNote, .removeNote", function() {
	addNote();
	removeNote();


})


// // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });

// // When you click the savenote button
// $(document).on("click", "#savenote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });

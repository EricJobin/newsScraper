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
		}

		$("#articles").append(`</div><hr>`)

	}
});

// --- Function to add note to database, called in document.on click below --------
function addNote(){
	event.preventDefault();
	if (event.path[0].className == "removeNote"){console.log("leaving addNote");return};

	let inputid= event.path[0].id;
	var userNote=$(`input[name=userNote${inputid}`).val();

	// let t0, t1, t2, t3, t4, t5, t6;
	// t0 = "addNote Routine"
	// t1="event";
	// t2=event;
	// t3="inputid";
	// t4=inputid;
	// t5="userNote";
	// t6=userNote;
	// tlog=[t0,t1,t2,t3,t4,t5, t6];
	// console.log(tlog);

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

//------------------------------------
function removeNote(){
	event.preventDefault();
	if (event.path[0].className == "addNote"){console.log("leaving removeNote");return};
	// let e0, e1, e2, e3, e4, e5, e6;
	// e0="removeNote routine";
	// e1= "event";
	// e2= event;

	let inputid= event.path[0].id;

	// e3= "inputid";
	// e4= inputid;
	// e5="event.path[0].className";
	// e6=event.path[0].className;

	// let elog= [e0, e1, e2, e3, e4,e5,e6 ];
	// console.log(elog);

	$.ajax({
	    method: "POST",
	    url: `/delnote/${inputid}`,
	    data: {
	    	userNote: "",
	    }
	})
	.then(function(data) {
		console.log(url);
		console.log(data);
	});
}

$(document).on("click", ".addNote, .removeNote", function() {
	addNote();
	removeNote();
})

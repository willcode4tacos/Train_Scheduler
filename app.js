// Initialize Firebase
var config = {
    apiKey: "AIzaSyDic3jJTTyJTa6QsFouYsIkOXBHFcB7R4s",
    authDomain: "trainschedule-da4dc.firebaseapp.com",
    databaseURL: "https://trainschedule-da4dc.firebaseio.com",
    projectId: "trainschedule-da4dc",
    storageBucket: "trainschedule-da4dc.appspot.com",
    messagingSenderId: "7757671888"
  };


  firebase.initializeApp(config);

var trainData = firebase.database();


// Button for adding trains
$("#submitTrain").on("click", function(){

	// Grabs user input
	var trainName = $("#addName").val().trim();
	var destination = $("#addStop").val().trim();
	var firstTrainUnix = moment($("#addFirst").val().trim(), "HH:mm").subtract(10, "years").format("X");
	var frequency = $("#addFreq").val().trim();

	// Create local "temporary" object for holding train data
	var newTrain = {
		name:  trainName,
		destination: destination,
		firstTrain: firstTrainUnix,
		frequency: frequency
	}

	// Uploads train data to the database
	trainData.ref().push(newTrain);

	// Logs everything to console
	console.log(newTrain.name);
	console.log(newTrain.destination); 
	console.log(firstTrainUnix);
	console.log(newTrain.frequency)


	alert("New Train Added");

	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#firstTrainInput").val("");
	$("#frequencyInput").val("");

	//Determine when the next train arrives
	return false;
});


//Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	//Store everything into a variable
	var tName = childSnapshot.val().name;
	var tDestination = childSnapshot.val().destination;
	var tFrequency = childSnapshot.val().frequency;
	var tFirstTrain = childSnapshot.val().firstTrain;

	//Calculate the minutes until arrival 
	var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
	var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency ;
	var tMinutes = tFrequency - tRemainder;

	//To calculate the arrival time, add the tMinutes to the currrent time
	var tArrival = moment().add(tMinutes, "m").format("hh:mm A"); 
	console.log(tMinutes);
	console.log(tArrival);

	console.log(moment().format("hh:mm A"));
	console.log(tArrival);
	console.log(moment().format("X"));

	//Add each train's data into the table 
	$("#trainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");

});




angular.module('udream', ['ngRoute','ngSanitize', 'ngStorage','firebase'])

.controller('promotionCtrl', function($scope,$http,$localStorage,$timeout,$firebaseAuth) {

	$scope.user = localStorage.getItem("user");

	// Initialize Firebase
	var config = {
	 apiKey: "AIzaSyDiOismV5QKmeRcpwziozJqYBLrYhD4p-4",
	 authDomain: "udream-e60e9.firebaseapp.com",
	 databaseURL: "https://udream-e60e9.firebaseio.com",
	 storageBucket: "udream-e60e9.appspot.com",
	 messagingSenderId: "964274225982"
	};
	firebase.initializeApp(config);
	//End initialize firebase

	var auth = $firebaseAuth();
	$scope.signOut = function(){
		auth.$signOut();
	}

	//Listens for changes to the client's authentication state
	auth.$onAuthStateChanged(function(firebaseUser) {
		if (firebaseUser) {
		console.log("Signed in as:", firebaseUser.email);
	} else {
		console.log("Signed out");
		window.location = "login.html";
	}
})

	var database = firebase.database();
	var referencia = database.ref('promociones');

referencia.on("child_added", function(snapshot){
console.log("El juego actual es ", snapshot.val());
//	console.log("El id actual es ", snapshot.key());
});

	$scope.sendPromotion = function(){


	// A post entry.
  var postData = {
		city:$scope.city,
		company:$scope.company,
  	description: $scope.description,
		price_discount: $scope.price_discount,
		price_before: $scope.price_before,
		url_image: $scope.url_image,
		phone: $("#phone_number").val(),
		dates_range: $("#id-date-range-picker-1").val(),
		time: $("#timepicker1").val(),
  	date: new Date().getTime()
  };

	// Create a root reference
var storageRef = firebase.storage().ref();

// Create a reference to 'mountains.jpg'
var mountainsRef = storageRef.child('mountains.jpg');

// Create a reference to 'images/mountains.jpg'
var mountainImagesRef = storageRef.child('images/mountains.jpg');

// Create the file metadata
var metadata = {
  contentType: 'image/jpeg'
};
// Upload the file to the path 'images/rivers.jpg'
// We can use the 'name' property on the File API to get our file name
// This blob object can be saved to firebase
var blob = new Blob([new Uint8Array($scope.file_promotion)], { type: "image/jpeg" });
var uploadTask = storageRef.child('images/' + "simonito").put(blob);

// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', function(snapshot){
// Observe state change events such as progress, pause, and resume
// See below for more detail
console.log("UPLOAD TASK",snapshot);
}, function(error) {
// Handle unsuccessful uploads
console.log("UPLOAD ERROR",error);
}, function() {
// Handle successful uploads on complete
// For instance, get the download URL: https://firebasestorage.googleapis.com/...
var downloadURL = uploadTask.snapshot.downloadURL;
console.log("UPLOAD downloadurl",downloadURL);
});


		var database = firebase.database();
		var ref = database.ref('promociones');
		ref.push(postData);

		ref.on("child_added", function(snapshot){
		console.log("El juego actual es ", snapshot.val());
	//	console.log("El id actual es ", snapshot.key());
	});
	}



})

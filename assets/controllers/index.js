angular.module('udream', ['ngRoute','ngSanitize','ngStorage','firebase'])

.controller('indexCtrl', function($scope,$http,$localStorage,$timeout,$firebaseAuth) {

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

})

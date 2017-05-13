angular.module('udream', ['ngRoute','ngSanitize','ngStorage','firebase'])

.controller('loginCtrl', function($scope,$http,$localStorage,$timeout,$firebaseAuth) {

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

	console.log(auth);

		//Listens for changes to the client's authentication state
		auth.$onAuthStateChanged(function(firebaseUser) {
  		if (firebaseUser) {
    	console.log("Signed in as:", firebaseUser.email);
  	} else {
    	console.log("Signed out");
  	}
	})
	//End listener


	 	//Create new user
		$scope.isError = false;
		$scope.registerPressed = false;
    $scope.register = function() {
			if($scope.email !== undefined && $scope.passwordRegister !== undefined){
      if($scope.passwordRegister === $scope.repeatPassword){
			$scope.registerPressed = true;
      auth.$createUserWithEmailAndPassword($scope.email, $scope.passwordRegister)
			.then(function(userData) {
        $scope.message = "User created with email: " + userData.email;
				window.location = "index.html";
      }).catch(function(error) {
				$scope.registerPressed = false;
				$scope.isError = true;
        $scope.messageError = error.message;
      });

			}else{
					$scope.messageError = "Las passwords no coinciden";
					$scope.isError = true;
				}
			}else{
				$scope.messageError = "Por favor inserte todos los campos.";
				$scope.isError = true;
			}
    }
		//End create new user

		//Login
		$scope.buttonPressed = false;
		$scope.isLoginError = false;

		$scope.login = function(){

			if($scope.email_login !== undefined && $scope.password_login !== undefined){
		  $scope.buttonPressed = true;
			auth.$signInWithEmailAndPassword($scope.email_login, $scope.password_login)
				.then(function(firebaseUser) {
  				console.log("login as:", firebaseUser.email);
					window.location = "index.html";
          localStorage.setItem("user", firebaseUser.email);
				}).catch(function(error) {
					$scope.buttonPressed = false;
					$scope.isLoginError = true;
					$scope.messageError = error.message;
  				console.error("Authentication failed:", error.message);
				});
			}else{
					$scope.messageError = "Los campos no pueden estar vacios.";
					$scope.isLoginError = true;
				}
		 }
		//End login

		//Reset password
		$scope.resetPressed = false;
		$scope.isResetPassError = false;
		$scope.resetPassword = function(){
			if($scope.emailReset !== undefined){
			$scope.resetPressed = true;
			auth.$sendPasswordResetEmail($scope.emailReset).then(function() {
  			console.log("Password reset email sent successfully!");
				$scope.messageError = "las instrucciones para recuperar tu password han sido enviadas a tu correo.";
				$scope.isResetPassError = true;
				$scope.resetPressed = false;
				}).catch(function(error) {
				$scope.resetPressed = false;
				$scope.isResetPassError = true;
				$scope.messageError = error.message;
  			console.error("Error: ", error);
			});
		}else{
			$scope.messageError = "El email no puede estar vacio.";
			$scope.isResetPassError = true;
		}
		}
			//End reset password

			$scope.loginbox = true;
			$scope.signupbox = false;
			$scope.forgotbox = false;
			$scope.forgotPass = function(){
				$scope.loginbox = false;
				$scope.signupbox = false;
				$scope.forgotbox = true;
			}

		 $scope.iniciarSesion = function(){
			 $scope.loginbox = true;
 			 $scope.signupbox = false;
 			 $scope.forgotbox = false;
		 }

		 $scope.createAccount = function(){
			 $scope.loginbox = false;
 			 $scope.signupbox = true;
 			 $scope.forgotbox = false;
		 }


})

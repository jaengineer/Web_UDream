angular.module('udream', ['ngRoute','ngSanitize', 'ngStorage','firebase'])

.controller('realidadVirtualCtrl', function($scope,$http,$localStorage,$timeout,$firebaseAuth) {

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

	$scope.typeGame = "GeoMap";

	var database = firebase.database();
	var referencia = database.ref('realidadVirtual');

	referencia.on("child_added", function(snapshot){
		console.log("El premio actual es ", snapshot.val());
	});

	$scope.sendPremio = function(){

		//Convert date to format: dd/mm/yyyy
		var dateRange = $("#id-date-range-picker-1").val();
		var date = dateRange.substring(0,dateRange.indexOf("-"));
		var d = new Date(date)
		//End

	// A post entry.
  var postData = {
		typeGame: "playAtHome",
		city:$scope.city,
		name:$scope.name,
  	description: $scope.description,
		premio_value: $scope.premio_value,
		dates_range: formattedDate(d),
		time: $("#timepicker1").val(),
  	date: new Date().getTime(),
		latitud:$scope.latitud,
		longitud:$scope.longitud,
		latitud_premio:$scope.latitud_premio,
		longitud_premio:$scope.longitud_premio
  };

		function formattedDate(d) {
  		let month = String(d.getMonth() + 1);
  		let day = String(d.getDate());
  		const year = String(d.getFullYear());

  		if (month.length < 2) month = '0' + month;
  		if (day.length < 2) day = '0' + day;

  		return day+"/"+month+"/"+year;
		}
		console.log("DATA",postData);

		var database = firebase.database();
		var ref = database.ref('realidadVirtual');
		ref.push(postData);

		ref.on("child_added", function(snapshot){
		console.log("El premio actual es ", snapshot.val());
		window.location = "verPremios.html";
	});
	}

})

.controller('verPremiosCtrl', function($scope,$http,$localStorage,$timeout,$firebaseArray) {

	$scope.premios = [];
	var database = firebase.database();
	var premios = database.ref('realidadVirtual');
	$firebaseArray(premios);

	var obj = function (key,val) {
    this.key = key;
    this.val = val;
  };

		premios.on("child_added", function(snapshot){
			console.log("El premio actual es ", snapshot.val());
			var item = new obj(snapshot.key,snapshot.val());
			$scope.premios.push(item);
		});

		$scope.editarPremio = function(premio){
		localStorage.setItem("premio",JSON.stringify(premio));
		}

		$scope.borrarPremio = function(premio){
			console.log("BORRAR PREMIO",premio.key);
			var database = firebase.database();
			var prem = database.ref('realidadVirtual').child(premio.key);
			prem.remove();
			//Sacamos el elemento borrado del array
			var pos = buscarPremio(premio.key);
			$scope.premios.splice(pos,1);
		}

//Buscar premio por KEY
function buscarPremio(key){
	var pos = -1;
	var i = 0;
	var esta = false;

	while((!esta)&&(i<$scope.premios.length)){

		if($scope.premios[i].key===key){
			esta = true;
			pos = i;
		}
		else{
			i++;
		}
	}
	return pos;
}

})

.controller('editarPremioCtrl', function($scope,$http,$localStorage,$timeout,$firebaseArray) {

	$scope.miPremio = JSON.parse(localStorage.getItem("premio"));//Get premio from local storage

	//Set variables
	$scope.typeGame = $scope.miPremio.val.typeGame;
	$scope.city = $scope.miPremio.val.city;
	$scope.name = $scope.miPremio.val.name;
	$scope.description = $scope.miPremio.val.description;
	$scope.premio_value = $scope.miPremio.val.premio_value;
	$scope.dates_range = $scope.miPremio.val.dates_range;
	$scope.time = $scope.miPremio.val.time;
	$scope.latitud = $scope.miPremio.val.latitud;
	$scope.longitud = $scope.miPremio.val.longitud;
	$scope.latitud_premio = $scope.miPremio.val.latitud_premio;
	$scope.longitud_premio = $scope.miPremio.val.longitud_premio;

	var database = firebase.database();
	var premios = database.ref('realidadVirtual').child($scope.miPremio.key);


	$scope.editarPremio = function(){

		//Convert date to format: dd/mm/yyyy
		var dateRange = $("#id-date-range-picker-1").val();
		var date = dateRange.substring(0,dateRange.indexOf("-"));
		var d = new Date(date)
		//End

		var objPremio ={
				typeGame: $scope.typeGame,
	      city: $scope.city,
	      name: $scope.name,
				description:$scope.description,
				premio_value:$scope.premio_value,
				dates_range: formattedDate(d),
				time:$scope.time,
				latitud: $scope.latitud,
				longitud: $scope.longitud,
				latitud_premio:$scope.latitud_premio,
				longitud_premio:$scope.longitud_premio
			};

		premios.update(objPremio);
		window.location = "verPremios.html";

		function formattedDate(d) {
  		let month = String(d.getMonth() + 1);
  		let day = String(d.getDate());
  		const year = String(d.getFullYear());

  		if (month.length < 2) month = '0' + month;
  		if (day.length < 2) day = '0' + day;

  		return day+"/"+month+"/"+year;
		}
	}

  $scope.tipo_pista = "cofre";
	var tipoPista ="";
	$scope.selectPista = function(){
	console.log("pista",$scope.tipo_pista);
	}
	console.log("TIPO PISTA",$("#tipo_pistax").val());
	$scope.valor_premio = "";
	$scope.titulo_pista = "";
	$scope.description_pista = "";
	$scope.imagen_pista = "";
	$scope.address_pista = "";
	$scope.phone_pista = "";
	$scope.email_pista = "";
	$scope.boton_pista = "";
	$scope.latitud_pista =  "";
	$scope.longitud_pista = "";

	$scope.insertarPista = function(){
		console.log("TIPO PISTA",$("#tipo_pistax").val());
		var objPista ={
			valor_premio: $scope.valor_premio,
			titulo_pista:$scope.titulo_pista,
			tipo_pista: $("#tipo_pistax").val(),
			description_pista: $scope.description_pista,
			imagen_pista:$scope.imagen_pista,
			address_pista:$scope.address_pista,
			phone_pista:$scope.phone_pista,
			email_pista:$scope.email_pista,
			boton_pista: $scope.boton_pista,
			latitud_pista: $scope.latitud_pista,
			longitud_pista: $scope.longitud_pista
		};
		console.log("objPista",objPista);
		premios.child("pistas").push(objPista);

	}

	//Listar todas las pistas de un premio
	$scope.pistas = [];
	var objPista = function (description,lat,lon,key) {
    this.description = description;
    this.lat = lat;
		this.lon = lon;
		this.key = key;
  };
	var pistas = database.ref('realidadVirtual').child($scope.miPremio.key).child('pistas');
	$firebaseArray(pistas);

		//Listener para las pistas de un juego o premio
		pistas.on("child_added", function(snapshot){

				var item = new objPista(snapshot.val().description_pista,parseFloat(snapshot.val().latitud_pista),
					parseFloat(snapshot.val().longitud_pista),snapshot.key);
					$scope.pistas.push(item);
			});
		//Fin lista de pistas

		//Eliminar premio
		$scope.eliminarPista = function(pista){
			console.log("BORRAR PREMIO",pista.key);

			var mipista = database.ref('realidadVirtual').child($scope.miPremio.key).child('pistas').child(pista.key);
			mipista.remove();

			//Sacamos el elemento borrado del array
			var pos = buscarPista(pista.key);
			$scope.pistas.splice(pos,1);
		}
		//Fin eliminar premio

		//Buscar pista por KEY
		function buscarPista(key){
			var pos = -1;
			var i = 0;
			var esta = false;

			while((!esta)&&(i<$scope.pistas.length)){

				if($scope.pistas[i].key===key){
					esta = true;
					pos = i;
				}
				else{
					i++;
				}
			}
			return pos;
		}


})

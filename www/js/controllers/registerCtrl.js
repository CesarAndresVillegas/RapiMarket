angular.module('starter')
.controller('registerCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.userRegister = {};

	$scope.backView = function(){
		$state.go("login");
	};

	$scope.onRegister = function(){

		if(!$scope.userRegister.nombre){
			$rootScope.showAlert("Error", "Por favor indique el nombre");
			return;
		}

		if(!$scope.userRegister.apellido){
			$rootScope.showAlert("Error", "Por favor indique el apellido");
			return;
		}

		if(!$scope.userRegister.correo){
			$rootScope.showAlert("Error", "Por favor indique el correo");
			return;
		}

		if(!$scope.userRegister.telefono){
			$rootScope.showAlert("Error", "Por favor indique el teléfono");
			return;
		}

		if(!$scope.userRegister.pass){
			$rootScope.showAlert("Error", "Por favor indique el nombre");
			return;
		}

		if(!$scope.userRegister.confirmPass){
			$rootScope.showAlert("Error", "Por favor indique el nombre");
			return;
		}

		var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

		if(!$scope.userRegister.correo.match(mailregex)){
			$rootScope.showAlert("Error", "Por faovr indique un correo válido");
			return;
		}

		if($scope.userRegister.pass != $scope.userRegister.confirmPass){
			$rootScope.showAlert("Error", "Las contraseñas no coinciden");
			return;
		}

		// Captura de datos
		var datosRegistro = {
			correo: $scope.userRegister.correo,
			pass: $scope.userRegister.pass,
			nombre: $scope.userRegister.nombre,
			apellido: $scope.userRegister.apellido,
			telefono: $scope.userRegister.telefono
		};

		// Peticion
		$http.post($rootScope._host + "registerUser", JSON.stringify(datosRegistro))
		.success(function(data){
			data = eval(data);
			if (data[0] == 'Exito') {
				$rootScope.showAlert("Exito", data[1]);
				$scope.userRegister = {};
				$state.go("login");
			}
		})
		.error(function(err){
			data = eval(data);
			$rootScope.showAlert("Error", data[1]);
		});
	};
});
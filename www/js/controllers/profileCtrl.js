angular.module('starter')
.controller('profileCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.profile = {};
	$scope.listHistorialPedidos = [];

	$scope.init = function(){
		$scope.profile.name = SharedService.datosUsuario.nombre + " " + SharedService.datosUsuario.apellido;
		$scope.profile.mail = SharedService.datosUsuario.correo;
		$scope.profile.phone = SharedService.datosUsuario.telefono;

		// Consultar direcciones
		$http.get($rootScope._host + "historialPedidos/" + SharedService.datosUsuario.id)
		.success(function(data){
			if (data[0] == 'Exito') {
				$scope.listHistorialPedidos = data[1];
			}
		})
		.error(function(err){ console.log(err); });
	};

	$scope.onEditAddress = function(){
		$state.go("address");
	};

	$scope.backView = function(){
		$state.go("mainScreen");
	};

	$scope.onTab = function(_tab){
		if(_tab == "Inicio"){
			return;
		}
		if(_tab == "Inicio"){
			$state.go("categories");
		} 
		else if (_tab == "Categorias"){
			$state.go("mainScreen");
		}
		else if (_tab == "Perfil"){
			$state.go("profile");
		}
		else if (_tab == "Carro"){
			$state.go("cart");
		}
		else if (_tab == "Salir"){
			$state.go("login");
		}
	};
});
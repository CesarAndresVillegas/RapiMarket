angular.module('starter')
.controller('categoriesCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.backView = function(){
		$state.go("login");
	};

	$scope.filter = function(_tipo){
		// Hacer filtro por el _tipo
		console.log(_tipo);
		$state.go("mainScreen");
	};

	$scope.irProfile = function(){
		$state.go("profile");
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
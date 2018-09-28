angular.module('starter')
.controller('cartCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.productsCart = [];

	$scope.init = function(){
		$scope.productsCart = SharedService.productsCart;

		if($scope.productsCart.length == 0){
			$rootScope.showAlert("", "No tienes productos en tu carrito.");
			$state.go("mainScreen");
		}
	};

	$scope.backView = function(){
		$state.go("categories");
	};

	$scope.irCheckout = function(){
		SharedService.productsCart = $scope.productsCart;
		if(SharedService.productsCart.length > 0){
			$state.go("checkout");
		}else{
			$state.go("mainScreen");
			$rootScope.showAlert("", "No se encontraron productos en tu carrito.");
		}
	};

	$scope.onPlus = function(_index){
		$scope.productsCart[_index].cantidad = $scope.productsCart[_index].cantidad + 1;
	};

	$scope.onMinus = function(_index){
		$scope.productsCart[_index].cantidad = $scope.productsCart[_index].cantidad - 1;
		if($scope.productsCart[_index].cantidad < 1 ){
			$scope.productsCart[_index].cantidad = 1;
		}
	};

	$scope.onDelete = function(_index){
		$scope.productsCart.splice(_index, 1);
	};

	$scope.getTotal = function(){
		var total = 0;

		for(var i = 0; i < $scope.productsCart.length; i++){
			total = total + ($scope.productsCart[i].precio * $scope.productsCart[i].cantidad);
		}

		return total;
	};

	$scope.onTab = function(_tab){
		if(_tab == "Inicio"){
			return;
		}
		window.anterior = "Carro";
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
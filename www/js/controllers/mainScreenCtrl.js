angular.module('starter')
.controller('mainScreenCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window, $interval) {
	$scope.products = [];
	$scope.searcProduct = {};
	$scope.main = {};

	$scope.init = function(){
		// Consultar banners.
		$http.get($rootScope._host + 'banners')
		.success(function(data){
			if(data[0] == 'Exito' && SharedService.banners.length == 0){
				SharedService.banners = data[1];
				$scope.changeBanner();
				SharedService.intervalBanner =  $interval(function(){
					$scope.changeBanner();
				}, 5000);
			}else{
				$interval.cancel(SharedService.intervalBanner);
				$scope.changeBanner();
				SharedService.intervalBanner =  $interval(function(){
					$scope.changeBanner();
				}, 5000);
			}
		})
		.error(function(err){
			console.log(err);
		});

		// Obtener productos aleatorios.
		$http.get($rootScope._host + 'productosRandom')
		.success(function(data){
			if(data[0] == 'Exito'){
				$scope.products = data[1];
			}
		})
		.error(function(err){
			console.log(err);
		});
	};

	$scope.changeBanner = function(){
		var nRandom = $scope.getRandom(0, SharedService.banners.length -1);
		$scope.main.banner = SharedService.banners[nRandom].link;
	};

	$scope.getRandom = function(min, max){
		return Math.floor(Math.random()*(max-min+1)+min);
	};

	$scope.backView = function(){
		$state.go("categories");
	};

	$scope.onAdd = function(_product){
		// Verificar que no exista.
		for(var i = 0; i < SharedService.productsCart.length; i++){
			if(SharedService.productsCart[i].id == _product.id){
				SharedService.productsCart[i].cantidad  = SharedService.productsCart[i].cantidad + _product.cantidad;
				return;
			}
		}

		// Validar si existe cantidad.
		if(!_product.cantidad){
			_product.cantidad = 1;
		}

		SharedService.productsCart.push(_product);
		$rootScope.showToast("Item agregado");
	};

	$scope.onPlus = function(_index){
		// Sumar 1 a la cantidad del catalogo.
		if($scope.products[_index].cantidad == null) {
			$scope.products[_index].cantidad = 2
		}
		else{
			$scope.products[_index].cantidad = $scope.products[_index].cantidad + 1;
		}
	};

	$scope.onMinus = function(_index){
		// Disminuir 1 a la cantidad del catalogo
		if(!$scope.products[_index].cantidad){
			$scope.products[_index].cantidad = 0;
		}

		$scope.products[_index].cantidad = $scope.products[_index].cantidad - 1;

		if($scope.products[_index].cantidad < 0){
			$scope.products[_index].cantidad = 0;
		}
	};

	$scope.goToCart = function(){
		if(SharedService.productsCart.length > 0){
			$state.go("cart");
		}
		else{
			$rootScope.showAlert("", "No tienes productos en tu carrito.");
		}
	};

	$scope.onTab = function(_tab){
		window.anterior = "Inicio";
		if(_tab == "Inicio" && $state.current.name != "mainScreen"){
			$state.go("mainScreen");
		} 
		else if (_tab == "Categorias" && $state.current.name != "categories"){
			$state.go("categories");
		}
		else if (_tab == "Perfil" && $state.current.name != "profile"){
			$state.go("profile");
		}
		else if (_tab == "Carro" && $state.current.name != "cart"){
			$state.go("cart");
		}
		else if (_tab == "Salir" && $state.current.name != "login"){
			$state.go("login");
		}
	};
});
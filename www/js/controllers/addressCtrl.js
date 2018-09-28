angular.module('starter')
.controller('addressCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.listDirecciones = [];

	$scope.init = function(){
		// Consultar direcciones
		$http.get($rootScope._host + "getDirecciones/" + SharedService.datosUsuario.id)
		.success(function(data){
			if (data[0] == 'Exito') {
				$scope.listDirecciones = data[1];
			}
		})
		.error(function(err){ console.log(err); });
	};

	$scope.backView = function(){
		$state.go("profile");
	};

	$scope.onDeleteAddress = function(){
		console.log("Delete");
	};
});
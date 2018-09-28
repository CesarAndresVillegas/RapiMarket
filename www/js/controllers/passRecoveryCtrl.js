angular.module('starter')
.controller('passRecoveryCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.recuperar = {};

	$scope.backView = function(){
		$state.go("login");
	};

	$scope.onRecuperar = function(){
		if($scope.recuperar.mail == ""){
			$rootScope.showAlert("Error", "Por favor indique el correo");
			return;
		}

		var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
		if(!$scope.recuperar.mail.match(mailregex)){
			$rootScope.showAlert("Error", "Por favor indique un correo válido");
			return;
		}

		$http.get($rootScope._host + "recuperarPass/" + $scope.recuperar.mail)
		.success(function(data){
			data = eval(data);
			if (data[0] == 'Exito') {
				$rootScope.showAlert("Exito", data[1]);
				$state.go("login");
			} else {
				$rootScope.showAlert("Error", data[1]);
			}
		})
		.error(function(data){
			data = eval(data);
			$rootScope.showAlert("Error", data[1]);
		});
	};
});
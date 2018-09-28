angular.module('starter')
.controller('loginCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.user = {
		mail: "francisco.restrepo@aliansap.com.co",
		pass:"123"
	};
	$scope.onOlvidoPass = function(){
		$state.go("passRecovery");
	};

	$scope.onLogin = function(){
		var mail = $scope.user.mail;
		var pass = $scope.user.pass;

		if(!mail){
			$rootScope.showAlert("Error", "Por favor indique el correo");
			return;
		}

		if(!pass){
			$rootScope.showAlert("Error", "Por favor indique la contraseña");
			return;
		}

		// Realizar proceso de login
		$http.get($rootScope._host + 'login/' + mail + "/" + pass)
		.success(function(data){
			data = eval(data);
			if (data[0] == 'Exito') {
				SharedService.datosUsuario = data[1][0];
				// Verificar el rol.
				if(data[1][0].roles_id == '2'){ // Comprador
					$state.go("categories");
				}
				else{ // Repartidor
					$state.go("mainDelivery");
				}
			}
			else{
				$rootScope.showAlert("Error", "Por favor verifique usuario / contraseña");
			}
		})
		.error(function(err){ console.log(err); })
	};

	$scope.onLoginFB = function(){
		$rootScope.showAlert("Login FB");
	};

	$scope.onRegister = function(){
		$state.go("register");
	};
});
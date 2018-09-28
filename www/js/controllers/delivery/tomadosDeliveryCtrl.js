angular.module('starter')
.controller('tomadosDeliveryCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.listTomados = [];

	$scope.init = function(){
		$scope.onRefresh();
	};

	$scope.backView = function(){
		$state.go("mainDelivery");
	};

	$scope.distance = function(lat1, lon1, lat2, lon2) {
		var p = 0.017453292519943295; // Math.PI / 180
		var c = Math.cos;
		var a = 0.5 - c((lat2 - lat1) * p) / 2 +
		c(lat1 * p) * c(lat2 * p) *
		(1 - c((lon2 - lon1) * p)) / 2;

		return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
	};

	$scope.onRefresh = function() {
		$scope.getPedidosTomados();
	};

	$scope.getPedidosTomados= function(){
		$rootScope.show();

		// Peticion
		$http.get($rootScope._host + 'getPedidosTomados/' + SharedService.datosUsuario.id)
		.success(function(data){
			data = eval(data);
			if (data[0] == 'Exito') {
				// Calcular distancia respecto a posicion actual.
				navigator.geolocation.getCurrentPosition(function(pos) {
					$rootScope.hide();
					var latActual = pos.coords.latitude;
					var lngActual = pos.coords.longitude;

					for (var i = 0; i < data[1].length; i++) {
						var latPed = data[1][i].lat;
						var lngPed = data[1][i].lng;

						data[1][i].distancia = "Aprox." + Number($scope.distance(latActual, lngActual, latPed, lngPed)).toFixed(2) + " km";
					}

					$scope.listTomados = data[1];
				},
				function(err) {
					$rootScope.hide();
					console.log("error" + JSON.stringify(err));
					that.showToast("No se ha logrado determinar tu posicion actual", 2000);
					if (data[0] == 'Exito') {
						$scope.listTomados = data[1];
					}
					else{
						$scope.listTomados = [];
					}
				}, {timeout:15000});
			} else {
				$rootScope.hide();
				$scope.listTomados = [];
			}
		})
		.error(function(err){ console.log(err); $scope.listTomados = [];})
	};
});
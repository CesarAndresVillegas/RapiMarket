angular.module('starter')
.controller('mainDeliveryCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.listPendientes = [];

	$scope.init = function(){
		$scope.onRefresh();
	};

	$scope.backView = function(){
		$state.go("login");
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
		$scope.getPedidosPendientes();
	};

	$scope.tomarPedido = function(_pedido){
		$rootScope.showConfirm("ACEPTAR PEDIDO","Desea tomar el pedido del cliente ?. Si acepta este pedido se asignara directamente a su cuenta de usuario")
		.then(function (res) {
			if (res) {
				var datosRepartidor = {
					idPedido: _pedido.id,
					repartidor_id: SharedService.datosUsuario.id,
					pedido: _pedido
				};

				$http.post($rootScope._host + "actualizarRepartidor", datosRepartidor)
				.success(function(data){
					data = eval(data);
					if (data[0] == 'Exito') {
						$rootScope.showAlert("Exito", data[1]);
						$state.go("DetallePedido");
					} else {
						$rootScope.showAlert("Error", data[1]);
					}
				})
				.error(function(err){ console.log(err); })
			}
		});
	};

	$scope.getPedidosPendientes = function(){
		$rootScope.show();

		$http.get($rootScope._host + 'getPedidosPendientes')
		.success(function(data){
			data = eval(data);
				// Calcular distancia respecto a posicion actual.
				navigator.geolocation.getCurrentPosition(function(pos) {

					var latActual = pos.coords.latitude;
					var lngActual = pos.coords.longitude;

					for (var i = 0; i < data[1].length; i++) {
						var latPed = data[1][i].lat;
						var lngPed = data[1][i].lng;

						data[1][i].distancia = "Aprox." + Number($scope.distance(latActual, lngActual, latPed, lngPed)).toFixed(2) + " km";
					}

					$scope.listPendientes = data[1];
					$rootScope.hide();

				}, function(err) {
					$rootScope.hide();
					console.log("error" + JSON.stringify(err));

				// No se logro determinar pos actual
				if (data[0] == 'Exito') {
					$scope.listPendientes = data[1];
				}else{
					$scope.listPendientes = [];
				}

			}, {timeout:15000});
			})
		.error(function(err) { console.log(err); $scope.listPendientes = []; })
	};

	$scope.irMisPedidos = function(){
		$state.go("tomados");
	};
});
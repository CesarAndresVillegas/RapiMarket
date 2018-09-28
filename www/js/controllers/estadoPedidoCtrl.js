angular.module('starter')
.controller('estadoPedidoCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window, $interval) {
	$scope.estadoPedido = {};
	$scope.estadoPedido.textoEstadoActual = "Localizando un repartidor cerca de ti...";
	$scope.estadoPedido.nombreDomiciliario = "";
	$scope.estadoPedido.numeroDomiciliario = "";
	$scope.estadoPedido.placaDomiciliario = "";

	// Estados
	$scope.estadoPedido.isSearch = false;
	$scope.estadoPedido.isFound = false;
	$scope.estadoPedido.isPicking = false;
	$scope.estadoPedido.isDelivering= false;

	$scope.init = function(){
		// Consultar...
		$scope.iniciarSeguimiento();
		$scope.verificarPedido();
	};

	$scope.backView = function(){
		$state.go("mainScreen");

		// Remover el interval verificar.
		$interval.cancel(SharedService.intervalVerificar);
	};

	$scope.getTotal = function(){
		var total = 0;

		for(var i = 0; i < SharedService.productsCart.length; i++){
			total = total + (SharedService.productsCart[i].precio * SharedService.productsCart[i].cantidad);
		}

		return total;
	};

	$scope.iniciarSeguimiento = function(){

		// Remover el intervalo de checkeo
		$interval.cancel(SharedService.intervalVerificar);

		// that.totalPedidoFlujo.setText(totalPedido);
		SharedService.intervalVerificar = $interval(function() {
			$scope.verificarPedido();
		}, 10000);
	};

	$scope.llenarDatosRepartidor = function(_pedido){
		//this.fotoRepartidor.setSrc(pedido.foto_repartidor);
		$scope.estadoPedido.nombreDomiciliario = _pedido.nombre_repartidor + ' ' + _pedido.apellido_repartidor;
		$scope.estadoPedido.numeroDomiciliario = _pedido.telefono_repartidor;
		$scope.estadoPedido.placaDomiciliario = _pedido.placa_repartidor
	};

	$scope.verificarPedido = function(){
		$http.get($rootScope._host + "verificarPedido/" + SharedService._pedidoEstado.id)
		.success(function(data){
			data = eval(data);
			if (data[0] == 'Exito') {
				$scope.cambiarEstado(data[1][0]);
			} else {
				$rootScope.showAlert("Error", data[1]);
			}
		})
		.error(function(err){
			data = eval(data);
			$rootScope.showAlert("Error", data[1]);
		})
	};

	$scope.cambiarEstado = function(_pedido){
		$scope.miPedido = _pedido;

		if(_pedido.estados_pedidos_id == 1) {
			// Activar solo el estado actual.
			$scope.estadoPedido.isSearch = true;
			$scope.estadoPedido.isFound = false;
			$scope.estadoPedido.isPicking = false;
			$scope.estadoPedido.isDelivering= false;

			$scope.estadoPedido.textoEstadoActual = "Localizando un repartidor cerca de ti...";

		} else if (_pedido.repartidor_id != null && _pedido.estados_pedidos_id == 2) {
			// Activar solo el estado actual.
			$scope.estadoPedido.isSearch = false;
			$scope.estadoPedido.isFound = true;
			$scope.estadoPedido.isPicking = false;
			$scope.estadoPedido.isDelivering= false;

			$scope.llenarDatosRepartidor(_pedido);
			$scope.estadoPedido.textoEstadoActual = "El pedido ha sido asignado a un repartidor";

		} else if (_pedido.repartidor_id != null && _pedido.estados_pedidos_id == 3) {
			$scope.estadoPedido.isSearch = false;
			$scope.estadoPedido.isFound = true;
			$scope.estadoPedido.isPicking = true;
			$scope.estadoPedido.isDelivering= false;

			$scope.textoEstadoActual = "El repartidor esta recolectando de su pedido";

		} else if (_pedido.repartidor_id != null && _pedido.estados_pedidos_id == 4) {

			$scope.estadoPedido.isSearch = false;
			$scope.estadoPedido.isFound = true;
			$scope.estadoPedido.isPicking = false;
			$scope.estadoPedido.isDelivering= true;

			$scope.llenarDatosRepartidor(_pedido);

			$scope.estadoPedido.textoEstadoActual = "El repartidor esta realizando la entrega de su pedido";
		} else if (_pedido.repartidor_id != null && _pedido.estados_pedidos_id == 5) {
			$scope.estadoPedido.isSearch = false;
			$scope.estadoPedido.isFound = true;
			$scope.estadoPedido.isPicking = false;
			$scope.estadoPedido.isDelivering= false;

			$scope.llenarDatosRepartidor(_pedido);

			$scope.estadoPedido.textoEstadoActual = "Recuerde finalizar el proceso para iniciar una nueva compra";


			// Remover el intervalo de checkeo
			$interval.cancel(SharedService.intervalVerificar);
		}
	};
});
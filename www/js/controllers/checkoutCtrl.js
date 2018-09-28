angular.module('starter')
.controller('checkoutCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.direcciones = [];
	$scope.formas_pago = [{
		id: 1,
		nombre: "Efectivo"
	},
	{
		id: 2,
		nombre: "Tarjeta Débito"
	},
	{
		id: 3,
		nombre: "Tarjeta Crédito"
	}
	];

	$scope.isSend = false;
	$scope.checkout = {};

	$scope.init = function(){
		$rootScope.show();
		// Consultar las direcciones.
		$scope.isSend = false;
		$http.get($rootScope._host + 'getDirecciones/' + SharedService.datosUsuario.id)
		.success(function(data){
			$rootScope.hide();
			data = eval(data);
			if (data[0] == 'Exito') {

				for (var i = 0; i < data[1].length; i++) {
					data[1][i].direccion = data[1][i].alias + " - " + data[1][i].direccion;
				}

				$scope.direcciones = data[1];
			}
		})
		.error(function(err){ $rootScope.hide(); console.log(err); });
	};

	$scope.backView = function(){
		$state.go("cart");
	};

	$scope.getTotal = function(){
		var total = 0;

		for(var i = 0; i < SharedService.productsCart.length; i++){
			total = total + (SharedService.productsCart[i].precio * SharedService.productsCart[i].cantidad);
		}

		return total;
	};

	$scope.confirmarPedido = function(){
		// Validar datos.
		if(!$scope.checkout.direccion){
			$rootScope.showAlert("Error", "Por favor indique la dirección.");
			return;
		}

		if(!$scope.checkout.forma_pago){
			$rootScope.showAlert("Error", "Por favor indique la forma de pago.");
			return;
		}

		if(!$scope.checkout.phone){
			$rootScope.showAlert("Error", "Por favor indique el teléfono.");
			return;
		}

		if(!$scope.checkout.observations){
			$rootScope.showAlert("Error", "Por favor indique las observaciones.");
			return;
		}

		$rootScope.showConfirm("Desea realizar el pedido", "").then(function (res) {
			if (res) {
				// Hacer petición del pedido.
				$scope.generarPedido();
			}
		});
	};

	$scope.generarPedido = function() {

		// Deshabilitar boton de generar pedido.
		$scope.isSend = true;
		$rootScope.show();

		// Pedido encabezado
		var pedido = {};
		var modeloProductosCarrito = SharedService.productsCart;

		pedido.direcciones_id = $scope.checkout.direccion.id;
		pedido.formas_pago_id = $scope.checkout.forma_pago.id;
		pedido.instrucciones = $scope.checkout.observations;
		pedido.usuarios_id = SharedService.datosUsuario.id;
		pedido.telefono = $scope.checkout.phone;

		// Array de detalles del pedido
		var pedidoDetalles = [];

		for (var i = 0; i < modeloProductosCarrito.length; i++) {
			var detalle = {};

			detalle.cantidad = modeloProductosCarrito[i].cantidad;
			detalle.precio_unitario = parseInt(modeloProductosCarrito[i].precio);
			detalle.productos_id = modeloProductosCarrito[i].id;

			pedidoDetalles.push(detalle);
		}

		// Se asignan los detalles del pedido
		pedido.items = pedidoDetalles;

		// Peticion
		$http.post($rootScope._host + "generarPedido", JSON.stringify(pedido))
		.success(function(data){
			data = eval(data);
			$rootScope.hide();
			if (data[0] == 'Exito') {
				$rootScope.showAlert("Exito", "Se ha generado el pedido # " + data[1] + " exitosamente!!!");
				// Vaciar modelo carrito y enviar a pantalla de estado Pedido
				pedido.id = data[1];
				SharedService._pedidoEstado = pedido;
				SharedService.productsCart = [];

				$state.go("estadoPedido");

				// Habilitar boton de generar pedido.
				$scope.isSend = false;
			}
			else{
				$rootScope.showAlert("Error", "Error al generar el pedido por favor intente nuevamente.");
				// Habilitar boton de generar pedido.
				$scope.isSend = false;
			}
		})
		.error(function(err){
			$rootScope.hide();
			data = eval(data);
			$rootScope.showAlert("Error", data[1]);

			// Habilitar boton de generar pedido.
			$scope.isSend = false;
		})
	},

	$scope.goMap = function(){
		$state.go("map");
	};
});
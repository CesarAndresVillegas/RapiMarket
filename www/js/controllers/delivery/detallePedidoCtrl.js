angular.module('starter')
.controller('detallePedidoCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.listProducts = [];
	$scope.isRecolectando = false;
	$scope.pedidoActual = {};
	$scope.totalPedido = "";
	$scope.showBtnRecolectar = true;

	$scope.init = function(){
		$scope.loadPedido(SharedService.pedidoActual);
	};

	$scope.backView = function(){
		$state.go("mainDelivery");
	};

	$scope.onRecolectarPedido = function(){
		$rootScope.showConfirm("Recolectar productos ?", "Desea iniciar la recoleccion de productos ?")
		.then(function(res){
			if(res){
				$rootScope.show();
				var datos = {
					idPedido: that.idPedido.getText(),
					idEstado: 3
				};
				// Enviar peticion para cambiar estado a recolectado
				$http.get($rootScope._host + "cambiarEstadoPedido", JSON.stringify(datos))
				.success(function(data){
					sap.ui.core.BusyIndicator.hide();
					data = eval(data);
					if (data[0] == 'Exito') {
						that.iniciarRecoleccion.setVisible(false);
						that.oList.setVisible(true);
					} else {
						sap.m.MessageBox.error(data[1], '', 'Error');
					}
				})
				.error(function(err){ 
					sap.ui.core.BusyIndicator.hide();
					data = eval(data);
					sap.m.MessageBox.error(data[1], '', 'Error');
				})
			}
		});

		sap.m.MessageBox.confirm(
			"Desea iniciar la recoleccion de productos ?", {
				title: "Recolectar productos",
				actions: ["Si", "No"],
				onClose: function(oAction) {
					if (oAction == "Si") {
						// Enviar peticion para cambiar estado a recolectado
						var datos = {
							idPedido: that.idPedido.getText(),
							idEstado: 3
						};
						// Peticion
						$.ajax({
							type: 'POST',
							url: _HOST + 'cambiarEstadoPedido',
							data: JSON.stringify(datos),
							success: function(data) {
								sap.ui.core.BusyIndicator.hide();
								data = eval(data);
								if (data[0] == 'Exito') {
									$scope.isRecolectando = true;
									$scope.showBtnRecolectar = false;
								} else {
									$rootScope.showAlert("Error", data[1]);
								}
							},
							error: function(data) {
								sap.ui.core.BusyIndicator.hide();
								data = eval(data);
								$rootScope.showAlert("Error", data[1]);
							}
						});
					}
				}
			}
			);
	};

	$scope.loadPedido = function(_pedido){
		$rootScope.show();
		this.llenarEncabezado(datosEncabezado.pedido);

		$http.get($rootScope._host + "getProductos" + _pedido.id)
		.success(function(data){
			data = eval(data);
			if (data[0] == 'Exito') {
				$scope.determinarEstadoPedido(data);
				var totalPedido = 0;
				for (var i = 0; i < data[1].length; i++) {
					totalPedido = totalPedido + (Number(data[1][i].precio_unitario) * Number(data[1][i].cantidad));
				}

					// Asignar el total del pedido
					$scope.totalPedido = totalPedido;

					// Asignar a la lista.
					$scope.listProducts = data[1];
				} else {
					sap.m.MessageBox.error("Ha ocurrido un error al intentar obtener los pedidos pendientes, por favor intente de nuevo mas tarde.", '',
						'Error');
				}

				$rootScope.hide();
			})
		.error(function(err){
			$rootScope.hide();
		})
	};

	$scope.determinarEstadoPedido = function(_data){
		if(_data[1][0].estados_pedidos_id == 2){ // Aceptado
			$scope.isRecolectando = false;
			$scope.showBtnRecolectar = true;
		}
		if(_data[1][0].estados_pedidos_id == 3){ // Recolectando
			$scope.isRecolectando = true;
			$scope.showBtnRecolectar = false;
		}
	};

	$scope.onEntregar = function(){
		$state.go("entregaDelivery");
	};

	$scope.onLlamarUsuario = function(){
		var phonenumber = $scope.pedidoActual.telefono;
		var call = "tel:" + phonenumber;
		window.open(call, '_system');
	};
});
angular.module('starter')
.controller('mapCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $timeout) {
	$scope.map;
	$scope.marker;
	$scope.mapText = {};

	$scope.onDragEnd = function(event){
		console.log(event);
	};

	$scope.mapOptions = {
		center: 0,
		zoom: 17,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: false,
		navigationControl: false,
		disableDefaultUI: true
	};

	$scope.init = function(){
		$rootScope.show();
		navigator.geolocation.getCurrentPosition(function(data) {
			$rootScope.hide();

			// Coordenadas
			var slat = data.coords.latitude;
			var slng = data.coords.longitude;
			var latLng = new google.maps.LatLng(slat, slng);

			// Asignar el centro al mapa
			$scope.mapOptions.center = latLng;

			$scope.map = new google.maps.Map(document.getElementById("map"), $scope.mapOptions);

			// Crear y asignar el marcador
			$scope.setPosition(latLng);

			// Obtener direccion aproximada.
			$scope.getDireccion($scope.map.getCenter());

			// Registrar eventos de cambio.
			google.maps.event.addListener($scope.map, 'center_changed', function() {
				$timeout(function() {
					$scope.setPosition($scope.map.getCenter());
				}, 100);
			});

			google.maps.event.addListener($scope.map, 'dragend', function(event) {
				$scope.getDireccion($scope.map.getCenter());
			});
		},
		function(err){
			console.log(err);
			$rootScope.hide();
			$rootScope.showAlert("Error","No se ha logrado determinar tu posición, verifica que el GPS este encendido.");
		},
		{timeout:7000}
		);
	};

	$scope.backView = function(){
		$state.go("checkout");
	};

	$scope.getDireccion = function(objPos){
		var vlat = objPos.lat();
		var vlng = objPos.lng();

		$http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + vlat + ',' + vlng + '&sensor=true')
		.success(function(data){
			var dir = (data.results[0].formatted_address).split(",");
			$scope.mapText.currentDireccion = dir[0] + ", " + dir[1];
		});
	};

	$scope.crearDireccion = function(){
		var datosDireccion = {
			lat: $scope.marker.getPosition().lat(),
			lng: $scope.marker.getPosition().lng(),
			alias: $scope.mapText.aliasDireccion,
			direccion: $scope.mapText.currentDireccion,
			usuarios_id: SharedService.datosUsuario.id
		};
		// Peticion
		$http.post($rootScope._host + "crearDireccion", JSON.stringify(datosDireccion))
		.success(function(data){
			data = eval(data);
			if (data[0] == 'Error') {
				$rootScope.showAlert("Error", data[1]);
			} else {
				$state.go("checkout");
			}
		})
		.error(function(err){
			data = eval(data);
			$rootScope.showAlert("Error", data[1]);
		});
	};

	$scope.setPosition=function(pos){
		if($scope.marker == null){
			$scope.marker = new google.maps.Marker({
				map: $scope.map,
				animation: google.maps.Animation.DROP,
				position: pos
			});
		}else{
			$scope.marker.setPosition(pos);
		}
	}
});
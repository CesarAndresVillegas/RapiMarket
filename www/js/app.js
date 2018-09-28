// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform, $rootScope, $http, SharedService, $ionicPopup, $ionicLoading) {

	$rootScope._host = "http://rapimarket.co/rapimarket/rapimarket_api/public/";

	// Template para pantalla de carga.
	$rootScope.show = function() {
		$ionicLoading.show({
			template: 'Cargando, por favor espere...'
		});
	};

	$rootScope.hide = function() {
		$ionicLoading.hide();
	};

	$rootScope.showAlert = function (_title, _message) {
		return $ionicPopup.alert({
			title: _title,
			template: _message
		});
	};

	$rootScope.showConfirm = function (_title, _message) {
		return $ionicPopup.confirm({
			title: _title,
			template: _message
		});
	};

	$rootScope.showToast = function(_text){
		$ionicLoading.show({ template: _text, noBackdrop: true, duration: 1000 });
	};

	// Obtener terminos activos.
	$http.get($rootScope._host + 'termsActive')
	.success(function(data) {
		SharedService.termsActive = data[1][0];
		console.log(data);
	})
	.error(function(err){ console.log(err);});

	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
		  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		  // for form inputs)
		  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);

		  // Don't remove this line unless you know what you are doing. It stops the viewport
		  // from snapping when text inputs are focused. Ionic handles this internally for
		  // a much nicer keyboard experience.
		  cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

.config(function ($ionicConfigProvider) {
	$ionicConfigProvider.views.swipeBackEnabled(false);
})

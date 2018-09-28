angular.module('starter')
.factory('SharedService', function() {
	var SharedService = {
		datosUsuario: {},
		productsCart: [],
		banners: []
	};
	return SharedService;
});
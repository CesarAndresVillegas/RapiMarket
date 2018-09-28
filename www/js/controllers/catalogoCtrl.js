angular.module('starter')
.controller('catalogoCtrl', function($scope, $rootScope, $ionicPopup, $state, $http, SharedService, $window) {
	$scope.backView = function(){
		$state.go("categories");
	};
});
angular.module('starter')
.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('categories', {
    url: '/categories',
    templateUrl: 'templates/categories.html',
    controller: 'categoriesCtrl'
  })

  .state('catalogo', {
    url: '/catalogo',
    templateUrl: 'templates/catalogo.html',
    controller: 'catalogoCtrl'
  })

  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl'
  })

  .state('passRecovery', {
    url: '/passRecovery',
    templateUrl: 'templates/passRecovery.html',
    controller: 'passRecoveryCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'registerCtrl'
  })

  .state('mainScreen', {
    url: '/mainScreen',
    templateUrl: 'templates/mainScreen.html',
    controller: 'mainScreenCtrl'
  })

  .state('cart', {
    url: '/cart',
    templateUrl: 'templates/cart.html',
    controller: 'cartCtrl'
  })

  .state('checkout', {
    url: '/checkout',
    templateUrl: 'templates/checkout.html',
    controller: 'checkoutCtrl'
  })

  .state('estadoPedido', {
    url: '/estadoPedido',
    templateUrl: 'templates/estadoPedido.html',
    controller: 'estadoPedidoCtrl'
  })

  .state('address', {
    url: '/address',
    templateUrl: 'templates/address.html',
    controller: 'addressCtrl'
  })

  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'mapCtrl'
  })

  // Delivery
  .state('mainDelivery', {
    url: '/mainDelivery',
    templateUrl: 'templates/delivery/mainDelivery.html',
    controller: 'mainDeliveryCtrl'
  })

  .state('entregaDelivery', {
    url: '/entregaDelivery',
    templateUrl: 'templates/delivery/entregaDelivery.html',
    controller: 'entregaDeliveryCtrl'
  })

  .state('tomados', {
    url: '/tomadosDelivery',
    templateUrl: 'templates/delivery/tomadosDelivery.html',
    controller: 'tomadosDeliveryCtrl'
  })

  $urlRouterProvider.otherwise('/login')
})
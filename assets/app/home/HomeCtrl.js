(function(){
    'use strict'
    angular
        .module('app')
        .controller('HomeCtrl', HomeCtrl)
    HomeCtrl.inject = ['$scope'];

    function HomeCtrl ($scope){
        $scope.prueba = "Vista Inicial HOME";
    };
})();

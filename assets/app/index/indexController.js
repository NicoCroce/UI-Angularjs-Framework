(function(){
    'use strict';
    angular
        .module('app')
        .controller('IndexController', IndexController);
        IndexController.$inject = ['$scope'];
        
        function IndexController ($scope) {
            $scope.title = "Prueba Index"          
        };
})();
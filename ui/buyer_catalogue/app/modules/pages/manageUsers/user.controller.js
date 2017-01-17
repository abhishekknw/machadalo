angular.module('machadaloPages')
.controller('userCtrl',
    ['$scope', '$rootScope', '$window', '$location', 'userService',
    function ($scope, $rootScope, $window, $location, userService) {
        // reset login status
     $scope.model = {};
     $scope.options = [
        {usercode : 'BD', id : '01'},
        {usercode : 'Ops', id: '02'},
        {usercode : 'Agency', id: '03'}
      ];

     $scope.register = function(){
     userService.createUser($scope.model)
      .success(function(response, status){
        console.log("Successful");
        alert("Successfully Created");
        })
        .error(function(response, status){
            console.log("error occured", status);
            alert("Error Occured");
        });
     }

    }]);

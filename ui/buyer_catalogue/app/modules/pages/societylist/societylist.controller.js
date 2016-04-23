angular.module('machadaloPages')
.controller('SocietyListCtrl',
    ['$scope', '$rootScope', '$window', '$location', '$http','societyListService', 'pagesService',
    function ($scope, $rootScope, $window, $location, $http, societyListService, pagesService) {
      societyListService.processParam();
    //Start: For displaying filter values
      $scope.otherFilters = [];
      $scope.locationValueModel = [];
      $scope.locationValue = [];
      $scope.typeValue = [];
      $scope.typeValuemodel = [];
      $scope.locationValueSettings = {
        scrollableHeight: '100px',
        scrollable: true,
        externalIdProp: '',
        dynamicTitle: true,
      };
      $scope.locationcustomTexts = {
        buttonDefaultText: 'Select Location',
        checkAll: 'Select All',
        uncheckAll: 'Select None',
        dynamicButtonTextSuffix: 'Value'
      };
      $scope.typeValue = [
       {id: 1, label: "Ultra High"},
       {id: 2, label: "High"},
       {id: 3, label: "Medium"},
       {id: 4, label: "Standard"}
      ];
      $scope.typecustomTexts = {
        buttonDefaultText: 'Select Society Type',
        checkAll: 'Select All',
        uncheckAll: 'Select None'
      };
      $scope.checkboxes = [];
      var flattype = [
        {"name":"Small", checked: false},
        {"name":"Medium", checked: false},
        {"name":"Large", checked: false},
        {"name":"Very Large", checked: false}
    ];
    $scope.checkboxes = flattype;
    $scope.types = [];
    var inventorytype = [
      {"inventoryname": "Poster Campaign", checked: false},
      {"inventoryname": "Standee Caimpaign", checked: false},
      {"inventoryname": "Stall Campaign", checked: false},
      {"inventoryname": "Car Display Campaign", checked: false},
      {"inventoryname": "Flier Campaign", checked: false}
    ];
    $scope.types = inventorytype;

      societyListService.listFilterValues()
      .success(function (response){
        $scope.locationValue = response;
      })
      $scope.model = {};
        var sObj = '';
       societyListService.getSocietyList(sObj)
          .success(function (response) {
             $scope.model = response;
             console.log($scope.model);

      });
     $scope.filterResult = {};
      $scope.filterSocieties = function(typeValuemodel, locationValueModel, checkboxes, types) {
        var mySource1 = {locationValueModel};
        var mySource2 = {typeValuemodel};
        var mySource3 = {checkboxes};
        var mySource4 = {types}
        var myDest = {}
        angular.extend(myDest, mySource1, mySource2, mySource3, mySource4)
        console.log(myDest);
        societyListService.getSocietyList(myDest)
         .success(function (response){
           $scope.model = response;
        });
      }
      //End: For displaying filter values

    $scope.clearFilter = function (){
      $scope.locationValueModel = [];
      $scope.typeValuemodel = [];
      var flattype = [
        {"name":"Small", checked: false},
        {"name":"Medium", checked: false},
        {"name":"Large", checked: false},
        {"name":"Very Large", checked: false}
      ];
      $scope.checkboxes = flattype;
      var inventorytype = [
        {"inventoryname": "Poster Campaign", checked: false},
        {"inventoryname": "Standee Caimpaign", checked: false},
        {"inventoryname": "Stall Campaign", checked: false},
        {"inventoryname": "Car Display Campaign", checked: false},
        {"inventoryname": "Flier Campaign", checked: false}
      ];
      $scope.types = inventorytype;
      societyListService.getSocietyList(sObj)
         .success(function (response) {
            $scope.model = response;
            console.log($scope.model);

     });
    }

   //Start:For adding shortlisted society
   $scope.disable = false;
   if($rootScope.campaignId){
     $scope.shortlistThis = function(id) {
     societyListService.addShortlistedSociety($rootScope.campaignId, id)
      .success(function (response){
        //for disabling shortlisted society button
          $scope.disable = function(id){
            if(response.id == id){
                return true;
            }
          }
          console.log(response);
     });
   }}//End: For adding shortlisted society

   //Start: To navigate to catalogue page
   if($rootScope.campaignId){
   $scope.catalogue = function(id){
     alert(id);
     $location.path('campaign/' + $rootScope.campaignId +'/societyDetails/' + id);
   }}//End: To navigate to catalogue page

  //Start: Sort Functionality
  $scope.predicate = 'society_name';
  $scope.reverse = true;
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  }
  //End: Sort Functionality

  $scope.societyList = function() {
	  $location.path("manageCampaign/shortlisted/" + '5' + "/societies");
	};
  /*//pagination starts here
  $scope.totalItems = 64;
  $scope.currentPage = 4;

  $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

  $scope.pageChanged = function() {
   alert('gvg');
  };
  $scope.maxSize = 5;
  $scope.bigTotalItems = 175;
  $scope.bigCurrentPage = 1;
    //pagination ends here
*/
}]);

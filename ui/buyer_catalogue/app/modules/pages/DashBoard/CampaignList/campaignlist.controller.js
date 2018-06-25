angular.module('catalogueApp')

.controller('CampaignListCtrl', ['$scope', '$rootScope', '$window', '$location','commonDataShare','constants','campaignListService',
    function ($scope, $rootScope, $window, $location , commonDataShare,constants,campaignListService) {

      $scope.campaignHeadings = [
        {header : 'Sr No'},
        {header : 'Campaign Name'},
        {header : 'Assgined To'},
        {header : 'Assgined By'},
        {header : 'Assigned Date'},
        {header : 'Start Date'},
        {header : 'End Date'},
        {header : 'View Booking Details'},
        {header : 'Assign Dates'},
        {header : 'View Execution Image'}
      ];

      $scope.is_Superuser = $window.localStorage.isSuperUser;
      // var vm = this;

      var getCampaignDetails = function(){
        if($scope.is_Superuser == 'true'){
          var fetch_all = '1';
          campaignListService.getAllCampaignDetails(fetch_all)
          .then(function onSuccess(response){
            $scope.campaignData = response.data.data;
            $scope.loading = response.data.data;
            if($scope.campaignData.length == 0){
              $scope.isEmpty = true;
              $scope.msg = constants.emptyCampaignList;
            }
            // $scope.loading = response.data;
          })
          .catch(function onError(response){
            $scope.isEmpty = true;
            $scope.loading = response;
            console.log("error occured", response);
            commonDataShare.showErrorMessage(response);
            // swal(constants.name,constants.errorMsg,constants.error);
          });
        }else {
          var assigned_by = '0';
          var fetch_all = '0';
          var userId = $rootScope.globals.currentUser.user_id;
          $scope.Data = [];
          campaignListService.getCampaignDetails(assigned_by,userId,fetch_all)
            .then(function onSuccess(response){
              console.log(response);
              $scope.campaignData = response.data.data;
              $scope.Data = $scope.campaignData;
              $scope.loading = response.data.data;

              console.log($scope.Data);
              if($scope.campaignData.length == 0){
                $scope.isEmpty = true;
                $scope.msg = constants.emptyCampaignList;
              }
              // $scope.loading = response.data;
            })
            .catch(function onError(response){
              $scope.isEmpty = true;
              $scope.loading = response;
              console.log("error occured", response);
              commonDataShare.showErrorMessage(response);
              // swal(constants.name,constants.errorMsg,constants.error);
            });
        }

        }

        var getUsersList = function(){
          commonDataShare.getUsersList()
            .then(function onSuccess(response){
          		$scope.userList = response.data.data;
          	})
          	.catch(function onError(response){
          		console.log("error occured", response);
              commonDataShare.showErrorMessage(response);
              // swal(constants.name,constants.errorMsg,constants.error);
          	});
        }

        var init = function(){
          getCampaignDetails();
          getUsersList();
        }
        //Call init function TO Load reuired data initially..
        init();

        $scope.getDetails = function(proposal_id){
          $location.path('/' + proposal_id + '/releasePlan');
        }
        $scope.goToAssignDatesPage = function(proposal_id){
          $location.path('/' + proposal_id + '/auditReleasePlan');
        }
        $scope.getExecutionDetails = function(proposal){
          $window.localStorage.campaignState = constants[proposal.campaign_state];
          $window.localStorage.campaignId = proposal.proposal_id;
          $window.localStorage.campaignOwner = proposal.created_by;
          $window.localStorage.campaignName = proposal.name;

          $location.path('/' + proposal.proposal_id + '/opsExecutionPlan');
        }


    }]);

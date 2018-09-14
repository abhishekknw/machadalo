/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

  angular.module('catalogueApp')
      .controller('DashboardCtrl',function($scope,NgMap, $rootScope, baConfig, colorHelper,DashboardService, commonDataShare, constants,$location,$anchorScroll,uiGmapGoogleMapApi,uiGmapIsReady) {
 $scope.itemsByPage=15;
 $scope.query = "";
 $scope.oneAtATime = true;

 $scope.rowCollection = [];
 $scope.invNameToCode = {
   'POSTER' : 'PO',
   'STALL' : 'SL',
   'STANDEE' : 'ST',
   'FLYER' : 'FL',
   'GATEWAY ARCH' : 'GA'
 };
        $scope.invKeys = [
          {header : 'POSTER'},
          {header : 'STANDEE'},
          {header : 'STALL'},
          {header : 'FLIER'},
          {header : 'GATEWAY ARCH'},
        ];
        $scope.invCodes = {
          PO : 'PO',
          ST : 'ST',
          SL : 'SL',
          FL : 'FL',
          GA : 'GA'
        };
        $scope.actKeys = [
          {header : 'RELEASE', key : 'release', label1 : 'Released', label2 : 'UnReleased'},
          {header : 'AUDIT', key : 'audit', label1 : 'Audited', label2 : 'UnAudited'},
          {header : 'CLOSURE', key : 'closure', label1 : 'Closed', label2 : 'UnClosed' },
        ];


        $scope.supHeaders = [
          {header : 'Campaign Name', key : 'proposal_name'},
          {header : 'Inventory', key : 'supplier_name'},
          {header : 'Today Released', key : 'inv_type'},
          {header : 'Average Delay(%)', key : 'act_name'},
          {header : 'Average Off Location(Meters)', key : 'act_name'},
          {header : 'Images', key : 'images'},
          {header : 'Other Images', key : 'hashtagimages'},
        ];
        $scope.campaignStatus = {
          ongoing : {
            status : 'ongoing', value : false, campaignLabel : 'Ongoing Campaigns', supplierLabel : 'Ongoing Societies'
          },
          completed : {
            status : 'completed', value : false, campaignLabel : 'Completed Campaigns', supplierLabel : 'Completed Societies'
          },
          upcoming : {
            status : 'upcoming', value : false, campaignLabel : 'Upcoming Campaigns', supplierLabel : 'Upcoming Societies'
          },
        };
        $scope.charts = {
          pie : { name : 'Pie Chart', value : 'pie' },
          doughnut : { name : 'Doughnut Chart', value : 'doughnut' },

        };
        $scope.LeadsHeader = [
          {header : 'Ongoing'},
          {header : 'Completed'},

        ];
        $scope.perfLeads = {
          all : 'all',
          invleads : 'invleads',
        };
        $scope.showPerfLeads = false;

        $scope.perfMetrics = {
          inv : 'inv',
          ontime : 'onTime',
          location : 'onLocation',
          leads : 'leads',
          multipleLeads : 'multipleLeads',
          blank : 'blank'
        };
        $scope.showPerfMetrics = false;

       $scope.perfPanel = {
          all : 'all',
          respective : 'respective'
          };
        $scope.showPerfPanel = false;
        $scope.inventories = constants.inventories;
        $scope.campaignStatusLabels = [$scope.campaignStatus.ongoing.name,$scope.campaignStatus.completed.name, $scope.campaignStatus.upcoming.name];
        $scope.pieChartDefaulOptions = { legend: { display: true, position: 'right',padding: '10px' } };
        $scope.getCampaignsMenu = function(status){
          $scope.campaignStatus.ongoing.value = false;
          $scope.campaignStatus.completed.value = false;
          $scope.campaignStatus.upcoming.value = false;
          $scope.campaignStatus[status].value = !$scope.campaignStatus[status].value;
        }

        var campaignDataStruct = {
          id : '',
          supplier_id : '',
          proposal_name : '',
          inv_id : '',
          inv_type : '',
          images : [],
          act_name : '',
          act_date : '',
          reAssign_date : '',
        };

        var category = $rootScope.globals.userInfo.profile.organisation.category;
        var orgId = $rootScope.globals.userInfo.profile.organisation.organisation_id;
        $scope.campaignDataList = [];
        var getAllCampaignsData = function(){
          DashboardService.getAllCampaignsData(orgId, category)
          .then(function onSuccess(response){
            console.log(response);
            $scope.count = 0;
            $scope.invActDateList = [];
            $scope.inventoryActivityCountData = response.data.data;
            angular.forEach(response.data.data, function(data,key){
              $scope.isPanelOpen = !$scope.isPanelOpen;
              $scope.inventoryActivityCountData[key] = sortObject(data);
              $scope.invActDateList = $scope.invActDateList.concat(Object.keys($scope.inventoryActivityCountData[key]));
            })
            $scope.invActDateList = Array.from(new Set($scope.invActDateList));
            $scope.invActDateList.sort().reverse();
            $scope.dateListKeys = {};
            angular.forEach($scope.invActDateList, function(date){
              $scope.dateListKeys[date] = date;
            })
            getHistory(response.data.data);
            $scope.loading = response.data.data;
          }).catch(function onError(response){
            console.log(response);
          })
        }

        var loadData = function(){
            getAllCampaignsData();
        }
        loadData();

        function sortObject(obj) {
          return Object.keys(obj).sort().reverse().reduce(function (result, key) {
              result[key] = obj[key];
              return result;
          }, {});
        }

        $scope.count = 0;
        $scope.date = new Date();
        $scope.date = commonDataShare.formatDate($scope.date);
        $scope.pre = -1;
        $scope.next = 1;
        $scope.getDate = function(day){
          $scope.dateWiseSuppliers = [];

          $scope.showAssignedInvTable = false;
          $scope.OntimeOnlocation.ontime.value = false;
          $scope.OntimeOnlocation.onlocation.value = false;
          $scope.date = new Date($scope.date);
          $scope.date.setDate($scope.date.getDate() + day);
          $scope.date = commonDataShare.formatDate($scope.date);
        }
        $scope.getRecentActivity = function(day){
          $scope.dateWiseSuppliers = [];
          $scope.isPanelOpen =!$scope.isPanelOpen;
          $scope.showAssignedInvTable = false;
          $scope.OntimeOnlocation.ontime.value = false;
          $scope.OntimeOnlocation.onlocation.value = false;
          var initialDate = $scope.date;
          var date = new Date($scope.date);
          var counter = 100000;
          date.setDate(date.getDate() + day);
          date = commonDataShare.formatDate(date);

          while($scope.dateListKeys[date] != date){
            date = new Date(date);
            date.setDate(date.getDate() + day);
            date = commonDataShare.formatDate(date);
            counter--;
            if(counter < 0){
              alert("No Activity");
              break;
            }
          }
          if(counter < 0)
            $scope.date = initialDate;
          else
            $scope.date = date;
        }

        $scope.getPercent = function(num1,num2){
          var percent = num1/num2*100;
          return percent;
        }

        $scope.getAssignedIdsAndImages = function(date,type,inventory){
          $scope.dateWiseSuppliers = [];
          $scope.invName = inventory;
          $scope.actType = type;
          DashboardService.getAssignedIdsAndImages(orgId, category, type, date, inventory)
          .then(function onSuccess(response){
            console.log(response);
            $scope.campaignReleaseData = [];
            var campaignReleaseData = [];

            campaignReleaseData['totalOnTimeCount'] = 0;
            campaignReleaseData['totalOffTimeCount'] = 0;
            campaignReleaseData['totalOnLocationCount'] = 0;
            campaignReleaseData['totalOffLocationCount'] = 0;
            campaignReleaseData['totalOffLocationDistance'] = 0;
            campaignReleaseData['totalOffTimeDays'] = 0;
            campaignReleaseData['totalInvCount'] = 0;

            angular.forEach(response.data.data, function(data,campaignName){
              $scope.campaignData = [];
              var campaignData = {};
              campaignData['name'] = campaignName;
              campaignData['images'] = [];
              campaignData['inv_count'] = 0;
              campaignData['onLocationCount'] = 0;
              campaignData['offLocationCount'] = 0;
              campaignData['onTimeCount'] = 0;
              campaignData['offTimeCount'] = 0;
              campaignData['offTimeDays'] = 0;
              campaignData['offLocationDistance'] = 0;
              angular.forEach(data, function(items,inv){
                campaignData.inv_count += 1;
                campaignData[inv] = {};
                campaignData[inv]['onLocation'] = false;
                campaignData[inv]['onTime'] = false;
                // campaignData[inv]['minDistance'] = 100;
                campaignData[inv]['dayCount'] = 100;

                  for(var i=0; i<items.length; i++){
                    campaignData['proposalId'] = items[i].proposal_id;
                    if(items[i].hasOwnProperty('distance') && items[i].distance <= constants.distanceLimit){
                      campaignData[inv]['onLocation'] = true;
                      campaignData[inv]['minDistance'] = items[i].distance;
                      break;
                    }
                    else if(items[i].hasOwnProperty('distance')){
                      if(!campaignData[inv].hasOwnProperty('minDistance') || items[i].distance < campaignData[inv]['minDistance']){
                        campaignData[inv]['minDistance'] = items[i].distance;
                      }
                    }
                  }
                  for(var i=0; i<items.length; i++){
                    var days = Math.floor((new Date(items[i].created_at) - new Date(items[i].actual_activity_date)) / (1000 * 60 * 60 * 24));
                    if(days == 0){
                      campaignData[inv]['onTime'] = true;
                      break;
                    }else if(days < campaignData[inv]['dayCount']){
                      campaignData[inv]['dayCount'] = days;
                    }
                  }
                  if(campaignData[inv]['onLocation']){
                    campaignData['onLocationCount'] += 1;
                    campaignData['offLocationDistance'] += campaignData[inv]['minDistance'];
                  }
                  else{
                    campaignData['offLocationCount'] += 1;
                    campaignData['offLocationDistance'] += campaignData[inv]['minDistance'];
                  }


                  if(campaignData[inv]['onTime'])
                    campaignData['onTimeCount'] += 1;
                  else{
                    campaignData['offTimeCount'] += 1;
                    campaignData['offTimeDays'] += campaignData[inv]['dayCount'];
                  }
                  campaignData['images'].push(items);

              })
              campaignReleaseData['totalOnTimeCount'] += campaignData['onTimeCount'];
              campaignReleaseData['totalOffTimeCount'] += campaignData['offTimeCount'];
              campaignReleaseData['totalOnLocationCount'] += campaignData['onLocationCount'];
              campaignReleaseData['totalOffLocationCount'] += campaignData['offLocationCount'];
              campaignReleaseData['totalOffLocationDistance'] += campaignData['offLocationDistance'];
              campaignReleaseData['totalInvCount'] += campaignData['inv_count'];
              campaignReleaseData['totalOffTimeDays'] += campaignData['offTimeDays'];

              campaignReleaseData.push(campaignData);
            })
            $scope.campaignReleaseData = campaignReleaseData;
            if($scope.campaignReleaseData.length){
                $scope.showAssignedInvTable = true;
            }else{
                $scope.showAssignedInvTable = false;
            }
            $scope.campaignDataList = [];
          }).catch(function onError(response){
            console.log(response);
          })
        }

        $scope.goToExecutionPage = function(images){
          $scope.imageUrlList = [];
          angular.forEach(images, function(imageObjects){
            for(var i=0; i<imageObjects.length; i++){
              var imageData = {
                image_url : 'http://androidtokyo.s3.amazonaws.com/' + imageObjects[i].image_path,
                comment : imageObjects[i].comment,
              };
              $scope.imageUrlList.push(imageData);
            }
          })
        }


        $scope.getCampaigns = function(date){
            $scope.showSupplierTypeCountChart = false;
          if(!date)
            date = new Date();
          date = commonDataShare.formatDate(date);
          date = date + ' 00:00:00';
          $scope.showCampaignGraph = true;
          $scope.campaignLabel = false;
          $scope.showLeadsDetails = false;
          $scope.showDisplayDetailsTable = false;

          DashboardService.getCampaigns(orgId, category, date)
          .then(function onSuccess(response){
            console.log(response);
            $scope.searchSelectAllModel = [];
            $scope.showSingleCampaignChart = false;
            $scope.campaignData = response.data.data;
            $scope.mergedarray = [];

            angular.forEach($scope.campaignData, function(data){
              angular.forEach(data,function(campaign){
                  $scope.mergedarray.push(campaign);
              })
            })
            console.log($scope.mergedarray);
            $scope.campaigns = [$scope.campaignData.ongoing_campaigns.length,$scope.campaignData.completed_campaigns.length,$scope.campaignData.upcoming_campaigns.length];
              $scope.campaignChartdata = [
              { label : $scope.campaignStatus.ongoing.campaignLabel, value : $scope.campaignData.ongoing_campaigns.length },
              { label : $scope.campaignStatus.completed.campaignLabel, value : $scope.campaignData.completed_campaigns.length },
              { label : $scope.campaignStatus.upcoming.campaignLabel, value : $scope.campaignData.upcoming_campaigns.length }
            ];
            $scope.options = angular.copy(doughnutChartOptions);
            $scope.options.chart.pie.dispatch['elementClick'] = function(e){ $scope.pieChartClick(e.data.label); };
            $scope.showPerfPanel = $scope.perfPanel.all;
          }).catch(function onError(response){
            console.log(response);
          })
        }


      $scope.pieChartClick = function(label){

        $anchorScroll('bottom');
        $scope.campaignStatusName = label;
        var campaignStatus = _.findKey($scope.campaignStatus, {'campaignLabel' : label});
        getCountOfSupplierTypesByCampaignStatus(campaignStatus);
      }
       var getCountOfSupplierTypesByCampaignStatus = function(campaignStatus){
         DashboardService.getCountOfSupplierTypesByCampaignStatus(campaignStatus)
         .then(function onSuccess(response){
           console.log(response);
           if(response.data.data){
              $scope.supplierCodeCountData = formatCountData(response.data.data);
              $scope.supplierTypesData = response.data.data;
              $scope.supplierTypesDataList = [];
              angular.forEach($scope.supplierTypesData, function(data){
                $scope.supplierTypesDataList = $scope.supplierTypesDataList.concat(data);

              })
              $scope.supplierCodeCountOptions = angular.copy(doughnutChartOptions);
              $scope.showSupplierTypeCountChart = true;
           }
         }).catch(function onError(response){
           console.log(response);
         })
       }

          $scope.doughnutChartOptions = function(){
               $anchorScroll('bottom');
          }


       var formatCountData = function(data){
         var countData = [];
         angular.forEach(data, function(items,key){
           var temp_data = {
             label : constants[key] + ' Campaigns',
             value : items.length,
             campaigns : items
           }
           countData.push(temp_data);
         })
         return countData;
       }
       var formatSupplierCountData = function(data){
         var countData = [];
         angular.forEach(data, function(item){
           var temp_data = {
             label : constants[item.supplier_code] + ' Count',
             value : item.total,
           }
           countData.push(temp_data);
         })
         return countData;
       }

       var formatLabelData = function(data,label){
         var labelData = [];
         angular.forEach(data, function(item){
           labelData.push(item[label]);
         })
         return labelData;
       }
       $scope.type = $scope.charts.doughnut.value;
       $scope.series = ["Campaigns"];
       $scope.getChart = function(chartType){
         $scope.data = [$scope.campaigns];
         if(chartType == 'doughnut'){
           $scope.options = angular.copy(doughnutChartOptions);
           $scope.options.chart.pie.dispatch['elementClick'] = function(e){
             $scope.pieChartClick(e.data.label);


            };

         }
         if(chartType == 'pie'){
           $scope.options = $scope.pieChartOptions;
         }
         $scope.type = chartType;
       }



       var doughnutChartOptions = {
            chart: {
                type: 'pieChart',
                height: 350,
                top: -30,
                donut: true,
                x: function(d){return d.label;},
                y: function(d){return d.value;},

                showLabels: true,
                labelType : 'value',
                pie: {
                    startAngle: function(d) { return d.startAngle -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle -Math.PI/2 },
                    dispatch : {
                    }
                },
                duration: 500,
                legend: {
                  rightAlign:false,

                },
                legendPosition : 'bottom',
                tooltip: {
              },
              interactive : true
            }
        };

        $scope.pieChartOptions = {
           chart: {
               type: 'pieChart',
               height: 350,
               x: function(d){return d.label;},
               y: function(d){return d.value;},
               showLabels: true,
               labelType : 'value',
               duration: 500,
               labelThreshold: 0.01,
               labelSunbeamLayout: true,
               legend: {
                 rightAlign:false,

               },
               legendPosition : 'bottom',
           }
       };

       $scope.variableoptions = {
         chart: {
               type: 'linePlusBarChart',
               height: 500,
               margin: {
                   top: 30,
                   right: 75,
                   bottom: 50,
                   left: 75
               },
               bars: {
                   forceY: [0]
               },
               bars2: {
                   forceY: [0]
               },
               color: ['#2ca02c', 'darkred'],
               x: function(d,i) { return i; },
                showLabels: true,
               xAxis: {
                   axisLabel: 'X Axis',
                   tickFormat: function(d) {
                   // var label = $scope.formatMultiBarChartDataForSuppliers[0].values[d].x;
                   var label = $scope.values1;
                   return label;
                   console.log(label);
                  }
               },
               x2Axis: {
                   showMaxMin: false

               },
               y1Axis: {
                   axisLabel: 'Y1 Axis',
                   tickFormat: function(d){
                       return d3.format(',f')(d);
                   },
                   axisLabelDistance: 12
               },
               y2Axis: {
                   axisLabel: 'Y2 Axis',
                   tickFormat: function(d) {
                       return 'HQ ' + d3.format(',.2f')(d)
                   }
               },
               y3Axis: {
                   tickFormat: function(d){
                       return d3.format(',f')(d);
                   }
               },
               y4Axis: {
                   tickFormat: function(d) {
                       return '$' + d3.format(',.2f')(d)
                   }
               }
           }
               };



       var stackedBarChart = {
          "chart": {
            "type": "multiBarChart",
            "height": 450,
            // "labelType" : "11",
            "margin": {
              "top": 100,
              "right": 20,
              "bottom": 145,
              "left": 45
            },
            "clipEdge": true,
            "duration": 500,
            "stacked": true,
              "xAxis": {
              "axisLabel": "",
              "showMaxMin": false,
              "rotateLabels" : -30
            },
            "yAxis": {
              "axisLabel": "",
              "axisLabelDistance": -20,

              "ticks" : 8
            },
            "legend" : {
                    "margin": {
                    "top": 5,
                    "right": 3,
                    "bottom": 5,
                    "left": 15
                },
            },

            "reduceXTicks" : false
          }
        };

        var lineChart = {
          "chart": {
            "type": "lineChart",
            "height": 450,
            "useInteractiveGuideline": true,
            "dispatch": {},
            "xAxis": {
              "axisLabel": "Campaigns",
              tickFormat: function(d) {
                return d.y;
              }
            },
            "yAxis": {
              "axisLabel": "",
            }
          }
        };


       // START : service call to get suppliers as campaign status
       $scope.getSuppliersOfCampaignWithStatus = function(campaign){
         getCampaignInventoryActivitydetails(campaign.campaign);
         $scope.campaignTabPropsalName = campaign.name;
         $scope.campaignLabel = true;
         $scope.getCampaignFilters(campaign.campaign);
         $scope.campaignId = campaign.campaign;
         $scope.inv = campaign;

         DashboardService.getSuppliersOfCampaignWithStatus(campaign.campaign)
         .then(function onSuccess(response){

           console.log(response);
           $scope.showLeadsDetails = false;
           $scope.showDisplayDetailsTable = false;
           $scope.showSupplierTypeCountChart = false;
           $scope.showCampaignInvTable = false;
           $scope.showSupplierInvTable = false;
           $scope.showSingleCampaignChart = true;

           $scope.campaignStatusData = response.data.data;
           $scope.campaignSupplierAndInvData = response.data.data;
           $scope.showSupplierSocietywiseInvTable = false;
           $scope.showSupplierInvdDataTable = function(invData){
             $scope.SocietyInvTable = $scope.campaignStatusData;
             $scope.showSupplierSocietywiseInvTable = true;
          };
           $scope.countallsupplier = $scope.campaignStatusData.completed.length+$scope.campaignStatusData.ongoing.length+$scope.campaignStatusData.upcoming.length;
           var totalFlats=0,totalLeads=0,totalSuppliers=0,hotLeads=0;

           // $scope.totalLeadsCount = response.data.data.supplier_data.length;
           $scope.campaignStatusData['totalSuppliers'] = 0;
           angular.forEach($scope.campaignStatusData, function(data,key){
              if($scope.campaignStatusData[key].length && key != 'upcoming'){
                $scope.campaignStatusData['totalSuppliers'] += $scope.campaignStatusData[key].length;
                $scope.campaignStatusData[key]['totalFlats'] = 0;
                $scope.campaignStatusData[key]['totalLeads'] = 0;
                $scope.campaignStatusData[key]['hotLeads'] = 0;
                angular.forEach(data, function(supplierData){
                  $scope.campaignStatusData[key]['totalFlats'] += supplierData.supplier.flat_count;
                  $scope.campaignStatusData[key]['totalLeads'] += supplierData.leads_data.length;
                  if(supplierData.leads_data.length){
                    $scope.showLeadsDetails = true;
                    angular.forEach(supplierData.leads_data, function(lead) {
                      if(lead.is_interested){
                        $scope.campaignStatusData[key]['hotLeads'] += 1;

                      }
                    })
                  }
                })
                totalLeads += $scope.campaignStatusData[key].totalLeads;
                totalFlats += $scope.campaignStatusData[key].totalFlats;
              }
         })
            $scope.avgLeadsPerFlat = totalLeads/totalFlats * 100;
            $scope.avgLeadsPerSupplier = totalLeads/$scope.campaignStatusData.totalSuppliers;
            $scope.avgHotLeadsPerFlat = hotLeads/totalFlats * 100;
            $scope.avgHotLeadsPerSupplier = hotLeads/$scope.campaignStatusData.totalSuppliers;

           $scope.campaignChartdata = [
             { label : $scope.campaignStatus.ongoing.supplierLabel, value : $scope.campaignStatusData.ongoing.length, status : $scope.campaignStatus.ongoing.status },
             { label : $scope.campaignStatus.completed.supplierLabel, value : $scope.campaignStatusData.completed.length, status : $scope.campaignStatus.completed.status },
             { label : $scope.campaignStatus.upcoming.supplierLabel, value : $scope.campaignStatusData.upcoming.length, status : $scope.campaignStatus.upcoming.status }
           ];
           $scope.options1 = angular.copy(doughnutChartOptions);
           $scope.options1.chart.pie.dispatch['elementClick'] = function(e){ $scope.getSupplierAndInvData(e.data); };



         }).catch(function onError(response){
           console.log(response);
         })
       }
       // END : service call to get suppliers as campaign status


       // START : get campaign filters
       $scope.getCampaignFilters = function(campaignId){
         $scope.showTimeLocBtn = false;
         $scope.campaignId = campaignId;
         $scope.showPerfMetrics = $scope.perfMetrics.blank;
         DashboardService.getCampaignFilters(campaignId)
         .then(function onSuccess(response){
           console.log(response);

           $scope.campaignInventories = [];
           $scope.showinv = true;
           $scope.select = {
            campaignInventories: ""
          };
           angular.forEach(response.data.data, function(inv){
             if($scope.invCodes.hasOwnProperty(inv.filter_code)){
               $scope.campaignInventories.push(inv);
             }
           })
           $scope.performanceMetricsData = [];

         }).catch(function onError(response){
           console.log(response);
         })
       }
       // END : get campaign filters

       // START : get Performance metrics data
        $scope.getPerformanceMetricsData = {};
       $scope.getPerformanceMetricsData = function(inv,perf_param){
         $scope.inv = inv;
         var type = 'inv';
         if(!perf_param)
            perf_param = 'inv';
         $scope.select.campaignInventories = "";

         DashboardService.getPerformanceMetricsData($scope.campaignId,type,inv,perf_param )
         .then(function onSuccess(response){
           console.log(response);
           $scope.performanceMetricsData = response.data.data;
           $scope.activityInvPerfData = {
             release : Object.keys($scope.performanceMetricsData.actual.release).length,
             audit : Object.keys($scope.performanceMetricsData.actual.audit).length,
             closure : Object.keys($scope.performanceMetricsData.actual.closure).length
           }
           $scope.showPerfMetrics = $scope.perfMetrics.inv;
            $scope.showTimeLocBtn = true;
           if(perf_param == 'on_time'){
             setOntimeData($scope.performanceMetricsData.actual);
             $scope.showPerfMetrics = $scope.perfMetrics.ontime;
           }
           if(perf_param == 'on_location'){
            getOnLocationData($scope.performanceMetricsData.actual);
            $scope.showPerfMetrics = $scope.perfMetrics.onLocation;
           }

         }).catch(function onError(response){
           console.log(response);
         })
       }
       // END : get Performance metrics data

       // START : create on time data on activities
        var setOntimeData = function(data){
          angular.forEach(data, function(activity,key){
            activity['ontime'] = 0;
            angular.forEach(activity, function(imageData){
              for(var i=0;i<imageData.length;i++){
                var days = Math.floor((new Date(imageData[i].created_at) - new Date(imageData[i].activity_date)) / (1000 * 60 * 60 * 24));
                if(days == 0){
                  activity['ontime'] += 1;
                  break;
                }
              }
            })

          })
        }
       // END : create on time data on activities
       $scope.getOnTimeData = function(perf_param){
         $scope.getPerformanceMetricsData($scope.inv, perf_param);
       }

       $scope.getLocationData = function(perf_param){
         $scope.getPerformanceMetricsData($scope.inv, perf_param);
       }

       var getOnLocationData = function(data){
             angular.forEach(data, function(activity,key){
               data[key]['onLocation'] = 0;
               angular.forEach(activity, function(imageData){
                 for(var i=0; i<imageData.length; i++){
                   if(imageData[i].hasOwnProperty('distance') && imageData[i].distance <= constants.distanceLimit){
                     data[key].onLocation += 1;
                     break;
                   }
                 }
               })

             })


       }
       $scope.initializePerfMetrix = function(){
         $scope.showSupplierTypeCountChart = false;
       }

     $scope.getCampaignInvTypesData = function(campaign){
       $scope.proposal_id = campaign.proposal_id;
       $scope.campaignName = campaign.proposal__name;
       DashboardService.getCampaignInvTypesData($scope.proposal_id)
       .then(function onSuccess(response){
         console.log(response);
        $scope.campaignInventoryTypesData = response.data.data;
        $scope.loading = response.data.data;
        $scope.getSupplierInvTableData($scope.campaignInventoryTypesData);
        $scope.campaignInventoryData = response.data.data;
        $scope.totalTowerCount = 0;
        $scope.totalFlatCount = 0;
        $scope.totalSupplierCount = response.data.data.supplier_data.length;
        angular.forEach(response.data.data.supplier_data, function(data,key){

          $scope.totalTowerCount += data.tower_count;
          $scope.totalFlatCount += data.flat_count;

        })

     }).catch(function onError(response){
       console.log(response);
     })
    }

    $scope.getSupplierInvTableData = function(supplier){
      $scope.supplierInvData = supplier;
      $scope.showSupplierInvTable = true;

    }

    var getCampaignInventoryActivitydetails = function(campaignId){
    DashboardService.getCampaignInventoryActivitydetails(campaignId)
      .then(function onSuccess(response){
        console.log(response);
        $scope.campaignInventoryActivityData = response.data.data;
        }).catch(function onError(response){
      console.log(response);
    })
   }




     $scope.onLocationDetails = false;
       $scope.onTimeDetails = false;

   $scope.OntimeOnlocation = {
     ontime : {
       status : 'ontime', value : false
     },
     onlocation : {
       status : 'onlocation', value : false
     },
   };

   $scope.showOntimeOnlocation = function(status){
     $scope.showOnClickDetails = true;
     $scope.OntimeOnlocation.ontime.value = false;
     $scope.OntimeOnlocation.onlocation.value = false;

     $scope.OntimeOnlocation[status].value = !$scope.OntimeOnlocation[status].value;
   }


   var getHistory = function(data){
     $scope.historyData = {};
     angular.forEach(data, function(dates,invKey){
       angular.forEach(dates, function(activities,dateKey){
         if(!$scope.historyData.hasOwnProperty(dateKey)){
           $scope.historyData[dateKey] = {};
         }
         angular.forEach(activities, function(count,actKey){
           if(!$scope.historyData[dateKey].hasOwnProperty(actKey)){
             $scope.historyData[dateKey][actKey] = {};
             $scope.historyData[dateKey][actKey]['actual'] = 0;
             $scope.historyData[dateKey][actKey]['total'] = 0;
           }
           $scope.historyData[dateKey][actKey].actual += data[invKey][dateKey][actKey].actual;
           $scope.historyData[dateKey][actKey].total += data[invKey][dateKey][actKey].total;
         })
       })
     })
   }
   $scope.getDatewiseSuppliersInventory = function(proposalId, proposalName){
     $scope.dateWiseSuppliers = [];
     $scope.selectedProposalname = proposalName;
     console.log(proposalId,$scope.date);
     DashboardService.getDatewiseSuppliersInventory(proposalId, $scope.date, $scope.invName, $scope.actType)
     .then(function onSuccess(response){
       console.log(response);
       angular.forEach(response.data.data, function(data){
         $scope.dateWiseSuppliers.push(data);
       })
     }).catch(function onError(response){
       console.log(response);
     })
   }
   $scope.getLeadsByCampaign = function(campaignId){
     $scope.showTimeLocBtn = false;
     $scope.showinv = false;
     $scope.showSelection = true;
     $scope.showPerfMetrics = $scope.perfMetrics.blank;
     DashboardService.getLeadsByCampaign(campaignId)
     .then(function onSuccess(response){
       console.log(response);
       $scope.LeadsByCampaign = response.data.data;
       $scope.d3StackedBarChartData = formatD3StackedBarChartData($scope.LeadsByCampaign.supplier_data);
       $scope.stackedBarChartOptions = angular.copy(stackedBarChart);
       $scope.stackedBarChartSupplierData = formatMultiBarChartDataForSuppliers(response.data.data.supplier_data);
       $scope.stackedBarChartDateData = formatMultiBarChartDataByDate(response.data.data.date_data);
       $scope.campaignLeadsData = response.data.data;
       $scope.showPerfMetrics = $scope.perfMetrics.leads;
     }).catch(function onError(response){
       console.log(response);
     })
   }

  //  $scope.formatMultiBarChartDataForSuppliers = [
  //      {
  //          "key" : "Quantity" ,
  //          "bar": true,
  //          "values" : [ [ 1136005200000, 1271000.0] , [ 1138683600000, 1271000.0], [ 1138683600000, 1271000.0], [ 1138683600000, 1271000.0] ]
  //      },
  //      {
  //          "key" : "Price",
  //          "values" : [ [ 1136005200000 , 71.89] , [ 1138683600000 , 75.51], [ 1138683600000 , 75.51] , [ 1138683600000 , 75.51] ]
  //      }
  //  ].map((series) => {
  //          series.values = series.values.map((d) => { return {x: d[0], y: d[1] } });
  //          return series;
  // });

   var formatMultiBarChartDataForSuppliers = function(data){
     var values1 = [];
     var values2 = [];
     angular.forEach(data, function(supplier){
        var value1 =
           [supplier.data.society_name, supplier.total - supplier.interested];
        var value2 =
           [supplier.data.society_name, supplier.interested];
        values1.push(value1);
        values2.push(value2);


     })
     console.log(values1);
     console.log(values2);
     var temp_data = [
       {
         key : "Normal Leads",
         color : constants.colorKey1,
         values : values1,
         "bar": true,
       },
       {
         key : "High Potential Leads",
         color : constants.colorKey2,
         values : values2,

       }
     ].map((series) => {
             series.values = series.values.map((d) => { return {x: d[0], y: d[1] } });
             return series;
    });
     return temp_data;
    console.log(temp_data);
   }

   var formatMultiBarChartDataByDate = function(data){
     var values1 = [];
     var values2 = [];
     angular.forEach(data, function(date){
       var tempDate = commonDataShare.formatDate(date.created_at);
        var value1 =
           { x : tempDate, y : date.total - date.interested};
        var value2 =
           { x : tempDate, y : date.interested};
        values1.push(value1);
        values2.push(value2);
     })
     var temp_data = [
       {
         key : "Normal Leads",
         color : constants.colorKey1,
         values : values1
       },
       {
         key : "High Potential Leads",
         color : constants.colorKey2,
         values : values2
       }
     ];
     return temp_data;
   }


   $scope.getDateData = function(date){
     $scope.date = date;
   }


   $scope.graphicalComparision = {
     leads : {
       status : 'leads', value : false
     },
     inventory : {
       status : 'inventory', value : false
     },
   };
   $scope.getGraphicalComparision = function(status){
     $scope.graphicalComparision.leads.value = false;
     $scope.graphicalComparision.inventory.value = false;
     $scope.showPerfMetrics = false;
     $scope.campaignInventories = [];
     $scope.showTimeLocBtn = false;
     $scope.graphicalComparision[status].value = !$scope.graphicalComparision[status].value;
   }

   $scope.searchSelectAllSettings = { enableSearch: true,
       keyboardControls: true ,idProp : "campaign",
       template: '{{option.name}}', smartButtonTextConverter(skip, option) { return option; },
       selectionLimit: 4,
       showCheckAll : true,
       scrollableHeight: '300px', scrollable: true};

 $scope.selected_baselines_customTexts = {buttonDefaultText: 'Select Campaigns'};

   $scope.events = {

   onItemSelect : function(item){
   }
 }

    $scope.compCampaigns = {
      campaigns : {
        status : 'campaigns', value : false
      }
    };
    $scope.getCompareCampaigns = function(status){
      $scope.compCampaigns.value = false;
      $scope.showPerfMetrics = false;
      $scope.compCampaigns[status].value = !$scope.compCampaigns[status].value;
    }

    $scope.ontimelocation = {
      ontimeloc : {
        status : 'ontimeloc', value : false
      },
      showdrop : {
        status : 'showdrop', value : false
      }
    };
    $scope.getontimelocation = function(status){
      $scope.ontimelocation.value = false;
      $scope.ontimelocation[status].value = !$scope.ontimelocation[status].value;
    }


    $scope.getCompareCampaignChartData = function(campaignChartData){
      var proposalIdData = [];
      var proposalIdDataNames = {};
      console.log($scope.searchSelectAllModel);
      angular.forEach($scope.searchSelectAllModel,function(data){
        proposalIdData.push(data.id);
        proposalIdDataNames[data.id] = {
          name : data.id.name,
        };
      })
      DashboardService.getCompareCampaignChartData(proposalIdData)
      .then(function onSuccess(response){
        console.log(response);

        var campaignIds = Object.keys(response.data.data);
        angular.forEach(proposalIdData, function(campaignId){
          if(!(campaignIds.indexOf(campaignId) > -1)){
            response.data.data[campaignId] = {};
            response.data.data[campaignId]['data'] = {};
            response.data.data[campaignId]['total'] = 0;
            response.data.data[campaignId]['interested'] = 0;
            response.data.data[campaignId]['data']['name'] = proposalIdDataNames[campaignId].name;
          }
        });
        formatLineChartData(response.data.data);
        $scope.stackedBarChartOptions = angular.copy(stackedBarChart);
        $scope.stackedBarChartcampaignsData = formatMultiBarChartDataByMultCampaigns(response.data.data);
        $scope.showPerfMetrics = $scope.perfMetrics.multipleLeads;

      }).catch(function onError(response){
        console.log(response);
      })
    }
    var formatMultiBarChartDataByMultCampaigns = function(data){
      var values1 = [];
      var values2 = [];
      angular.forEach(data, function(campaign){
         var value1 =
            { x : campaign.data.name, y : campaign.total - campaign.interested};
         var value2 =
            { x : campaign.data.name, y : campaign.interested};
         values1.push(value1);
         values2.push(value2);
      })
      var temp_data = [
        {
          key : "Normal Leads",
          color : constants.colorKey1,
          values : values1
        },
        {
          key : "High Potential Leads",
          color : constants.colorKey2,
          values : values2
        }
      ];
      return temp_data;
    };
    var formatLineChartData = function(data){
      $scope.lineChartLabels = [];
      $scope.lineChartValues = [];
      var values1 = [];
      var values2 = [];

      var count = Object.keys(data).length;
      angular.forEach(data, function(campaign){
        $scope.lineChartLabels.push(campaign.data.name);
        values1.push(campaign.total/count);
        values2.push((campaign.interested)/count);
      });
      $scope.lineChartValues.push(values1);
      $scope.lineChartValues.push(values2);
    }
    console.log($scope.lineChartValues);

    $scope.lineChartOptions = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },

      ],
      xAxes: [{
        ticks: {
        autoSkip: false
        }
      }],
      responsive: true,
      maintainAspectRatio: false,
    },
    series: ['Normal','High Potential'],
    legend: {display: true},
    colors: ['#d7525b', '#fcfc5f'],

  };
  $scope.datasetOverride =  [
            {
                fill: true,
                backgroundColor: [
               "#d7525b",

                ]
            },
            {
                fill: true,
                backgroundColor: [
               "#fcfc5f",

                ]
            },
            ];

  $scope.openMenu = function($mdMenu, ev) {
      $mdMenu.open(ev);
    };
    var invStatusKeys = {
      'STALL' : {
        status : false, total : 0
      },
      'POSTER' : {
        status : false, total : 0
      },
      'FLIER' : {
        status : false, total : 0
      },
      'STANDEE' : {
        status : false, total : 0
      },
      'GATEWAY ARCH' : {
        status : false, total : 0
      },

    }
    $scope.getSupplierAndInvData = function(data){
      $scope.societyCampaignName = true;
      $scope.campaignName = false;
      $scope.supplierStatus = data.status;
      $scope.supplierAndInvData = $scope.campaignSupplierAndInvData[data.status];
      $scope.invStatusKeys = angular.copy(invStatusKeys);
      $scope.countLeads = 0;
      console.log($scope.supplierAndInvData);
      angular.forEach($scope.supplierAndInvData, function(supplier){
        $scope.latitude = supplier.supplier.society_latitude;
        $scope.longitude = supplier.supplier.society_longitude;
        $scope.societyName = supplier.supplier.society_name;
        $scope.length = $scope.supplierAndInvData.length;
          angular.forEach(supplier.supplier.inv_data, function(inv,key){
          $scope.invStatusKeys[key].status = true;
          })
          angular.forEach(supplier.leads_data, function(inv,key){
            $scope.leads_data = inv;

            $scope.showLeads = true;
            $scope.countLeads += 1;
            if($scope.leads_data.is_interested){
              $scope.supplierHotLeads += 1;
            }
          })
      })
      $scope.showDisplayDetailsTable = true;
      $scope.map = { zoom: 13,bounds: {},center: {latitude: $scope.latitude,longitude: $scope.longitude}};
      $scope.supplierMarkers = assignMarkersToMap($scope.supplierAndInvData);
      uiGmapIsReady.promise()
        .then(function(instances) {
          uiGmapGoogleMapApi.then(function(maps) {

          });
        });
      $scope.$apply();

    }
    $scope.windowCoords = {};
    $scope.onClick = function(marker, eventName, model) {
      $scope.space = model;
      $scope.campaignInventory = model;
      $scope.windowCoords.latitude = model.latitude;
      $scope.windowCoords.longitude = model.longitude;
      $scope.show = true;
    }
    function assignMarkersToMap(suppliers) {
        var markers = [];
        // var icon;
        var checkInv = true;
        angular.forEach(suppliers, function(supplier,$index){

              markers.push({
                  latitude: supplier.supplier.society_latitude,
                  longitude: supplier.supplier.society_longitude,
                  id: supplier.supplier.supplier_id,
                  // icon: 'http://www.googlemapsmarkers.com/v1/009900/',
                  options : {draggable : false},
                  dataofSupplierAndInvData : supplier.supplier,
                  title : {
                      name : supplier.supplier.society_name,
                      flat_count : supplier.supplier.flat_count,
                  },
              });
              if(checkInv){
                  angular.forEach($scope.invStatusKeys, function(inv,key){
                    if($scope.invStatusKeys[key].status){
                      if('inv_data' in supplier.supplier && key in supplier.supplier.inv_data){
                        markers[$index].title[key] = {
                            'key' : key,
                            'total' : supplier.supplier.inv_data[key].total.total
                        }
                      }else {
                          markers[$index].title[key] = {
                              'key' : key,
                              'total' : 0
                          }
                        }

                    }
                  })
              }


        });
        return markers;

    };
    $scope.supplierMarkers = [];
    $scope.map = { zoom: 5,bounds: {},center: {latitude: 19.119,longitude: 73.48,}};
    $scope.options = { scrollwheel: false, mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_LEFT
        },
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT
        },
        streetViewControl: true,
        streetViewControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT
        },
      };



    $scope.calculateTotalCount = function(invKey, value){
      if(value)
        $scope.invStatusKeys[invKey].total += value;
    }


  $scope.selectTabIndex = {
    value : 0
  }

$scope.switchToLeads = function(){
  $scope.selectTabIndex.value = 2;
  $scope.getLeadsByCampaign($scope.campaignId);
}


$scope.switchToInventory = function(inv){
  $scope.selectTabIndex.value = 2;
  var perf_param = null;
  $scope.getPerformanceMetricsData(inv,perf_param);
}
$scope.setImageUrl = function(item,images){
  console.log(item);
  $scope.campaignNameOnImageModal = item.name;
  $scope.campaignName = true;
  $scope.societyCampaignName = false;
  $scope.imageUrlList = [];
  angular.forEach(images, function(data){
    console.log(data);
    for(var i=0; i<data.length; i++){
      var imageData = {
        image_url : 'http://androidtokyo.s3.amazonaws.com/' + data[i].image_path,
        comment : data[i].comment,
        distance : data[i].distance,
      };
      $scope.imageUrlList.push(imageData);
    }
  })
  console.log($scope.imageUrlList);
}
// map
$scope.setInventoryInfoModalDetails = function(supplier,inv){
}


$scope.map;
   NgMap.getMap().then(function(evtMap) {
       $scope.map = evtMap;
   });
   $scope.showDetail = function(evt, supplierData){
     $scope.map;
     NgMap.getMap().then(function(evtMap) {
         $scope.map = evtMap;
     });
     console.log(supplierData);
     $scope.windowDisplay = supplierData;
     console.log($scope.windowDisplay);
     $scope.map.showInfoWindow('myWindow', this);
   };

$scope.viewSupplierImages = function(supplierId, invType, activityType, date){
  console.log(date);
    $scope.imageUrlList = [];
  DashboardService.getSupplierImages(supplierId, invType, activityType, date)
  .then(function onSuccess(response){
    console.log(response);

    angular.forEach(response.data.data, function(data){
      var imageData = {
        image_url : 'http://androidtokyo.s3.amazonaws.com/' + data.image_path,
        comment : data.comment,
        distance : data.distance
      };
      $scope.imageUrlList.push(imageData);
    })
  }).catch(function onError(response){
    console.log(response);
  })
}

$scope.setHashtagImageUrl = function(item,images){
  console.log(item);
  $scope.campaignNameOnImageModal = item.name;
  $scope.campaignName = true;
  $scope.societyCampaignName = false;
  $scope.hashTagImageUrl = [];
  angular.forEach(images, function(data){
    console.log(data);
    for(var i=0; i<data.length; i++){
      var imageData = {
        image_url : 'http://androidtokyo.s3.amazonaws.com/' + data[i].image_path,
        comment : data[i].comment,
        distance : data[i].distance,
      };
      $scope.hashTagImageUrl.push(imageData);
    }
  })
  console.log($scope.hashTagImageUrl);
}
$scope.getHashtagImages = function(item){
  console.log($scope.campaignReleaseData,item, $scope.date);
    $scope.hashTagImageUrl = [];
  DashboardService.getHashtagImages(item.proposalId,$scope.date)
  .then(function onSuccess(response){
    console.log(response);
    $scope.hashTagImageData = [];
    angular.forEach(response.data.data, function(data){
      var imageData = {
        image_url : constants.aws_campaign_images_url + data.image_path,
        comment : data.hashtag,
        supplier_name : data.supplier_data.society_name
      };
      $scope.hashTagImageData.push(imageData);
    })
    console.log($scope.hashTagImageData);
  }).catch(function onError(response){
    console.log(response);
  })
}
//
$scope.options = {width: 500, height: 300, 'bar': 'aaa'};
           // $scope.data = [1, 2, 3, 4];
//            $scope.hovered = function(d){
//                $scope.barValue = d;
//                $scope.$apply();
//            };
//            $scope.barValue = 'None';


var formatD3StackedBarChartData = function(data){
  var d3Data = [];
  // var d3Data['counts'] = [];
  angular.forEach(data, function(value){
    var object_data = {
      label : value.data.society_name,
      total : value.total,
      counts : []
    };
    // object_data['counts'] = [];

    var temp_data = {
       'name'  : 'count',
       'y0'  : 0,
       'y1' : value.total - value.interested,
       'label' : value.data.society_name,
       'total' : value.total,
      };
    object_data['counts'].push(temp_data);
    var temp_data = {
       'name'  : 'count2',
       'y0'  : value.total - value.interested,
       'y1' : value.total,
       'label' : value.data.society_name,
       'total' : value.total,
      };
    object_data['counts'].push(temp_data);

   d3Data.push(object_data);
  });
  console.log(d3Data);
  return d3Data;
}

$scope.getBookingCampaigns = function(campaign){
  console.log(campaign);
  DashboardService.getBookingCampaigns(campaign.campaign)
  .then(function onSuccess(response){
    console.log(response);
      $scope.bookingPhases = response.data.data;
  }).catch(function onError(response){
    console.log(response);
  })
}

//END
})


})();

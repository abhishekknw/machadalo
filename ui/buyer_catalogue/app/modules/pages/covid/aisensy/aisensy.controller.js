angular.module('machadaloPages').filter('firstlater', [function () {
    return function (input, scope) {
        if (input != null)
            input = input.charAt(0).toUpperCase();
        return input;
    }
}])
    .directive('myEnter', function () {
        return function (scope, element, attrs) {

            element.bind("keydown keypress", function (event) {
                if (event.which === 13 && !event.shiftKey)
                {
                    scope.$apply(function () {
                        // pasteIntoInput(this, "%0a");
                        scope.$eval(attrs.myEnter);
                       
                    }
                    );
                    event.preventDefault();

                    // if(!event.shiftKey){
                    //     event.preventDefault();
                    //     scope.$apply(attrs.myEnter);
                    // }
                }
                //     event.preventDefault();
                //     if(event.which == 13) {
                //         if (!event.shiftKey) {
                //             scope.$eval(attrs.myEnter);
                //         event.preventDefault();
                //     }
                // }
            });
        };
    })
    .controller('aisensyCtrl',
        ['$scope', '$rootScope', '$window', '$sce', '$location', 'AuthService','releaseCampaignService', '$anchorScroll', 'suspenseLeadService', '$state', 'userService', 'constants', 'AuthService', 'vcRecaptchaService', 'commonDataShare',
            function ($scope, $rootScope, $window, $sce, $location, AuthService,releaseCampaignService, suspenseLeadService, $anchorScroll, $state, userService, constants, AuthService, vcRecaptchaService, permissions, commonDataShare) {
                // AuthService.Clear();

                $scope.isCollapsed = true;
                $scope.$on('$routeChangeSuccess', function () {
                    $scope.isCollapsed = true;
                });

                $scope.ckeckdUserAisensy = [];
                $scope.ckeckdUserAisensy1 = [];

                let gooIndex = document.getElementById('goo-index');
                let hoverEnter = index => {
                    gooIndex.style.top = 100 * index + 'px';
                    let allScreens = document.querySelectorAll('.screen');
                    allScreens.forEach(e => {
                        e.classList.remove('visible')
                    })
                    let nowVisible = document.getElementById('screen_' + index);
                    nowVisible.classList.add('visible');
                }

                $scope.tab = { name: 'tabA' };
                // console.log("start 78787")

                // AIsensy controller
                $scope.getActiveUser = function (page) {
                    // alert("first api call")
                    $scope.tab.name = 'tabA';
                    $scope.hideChatModule();
                    $scope.formData.historySearch = "";
                    $scope.showcontactDetail = false;
                    $scope.showhistoryDetail = false;
                    $scope.showChatModule = false;
                    $scope.showgetActiveUser = true;
                    $scope.showtemplateDetail = false;
                    $scope.isUserProfile = false;
                    $scope.showfilterDetail = false;
                    $scope.formData.contactSearch = "";
                    // $scope.historySearch = "";
                    // $scope.search = "";
                    //$scope.showfilterDetail = false;

                    let param = {
                        next_page: 1
                    }
                    if (page) {
                        param.next_page = page;
                    } else {
                        $scope.totalCount = 1;
                        $scope.currentPage = 1;
                        $scope.itemsPerPage = 10;
                        $scope.serial = 1
                        $scope.pagination = {
                            current: 1
                        };
                    }
                    if ($scope.formData.activesearch) {
                        param.search = $scope.formData.activesearch;
                    }

                    AuthService.getAllActiveUserData(param)

                        .then(function onSuccess(response) {
                            $scope.activeUserData = response.data.data.users;
                            $scope.totalCount = response.data.data.total_count
                            console.log($scope.activeUserData)
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }
                $scope.formData = {};

                $scope.getActionRequiredUser = function (page) {

                    $scope.tab.name = 'tabB';
                    $scope.isUserProfile = false;
                    $scope.formData.interveneSearch = '';
                    $scope.formData.activesearch = '';
                    $scope.showChatModule = false;
                    $scope.showfilterDetail = false;
                    let param = {
                        next_page: 1,
                    }
                    if (page) {
                        param.next_page = page;
                    } else {
                        $scope.totalCount = 1;
                        $scope.currentPage = 1;
                        $scope.itemsPerPage = 10;
                        $scope.serial = 1
                        $scope.pagination = {
                            current: 1
                        };
                    }
                    if ($scope.formData.actionSearch) {
                        param.search = $scope.formData.actionSearch;
                    }
                    AuthService.getAllActionRequiredData(param)

                        .then(function onSuccess(response) {
                            $scope.actionRequiredUserData = response.data.data.users;
                            $scope.totalCount = response.data.data.total_count
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }

                $scope.getInterveneUser = function (page) {
                    $scope.tab.name = 'tabC';
                    $scope.isUserProfile = false;
                    $scope.formData.actionSearch = '';
                    $scope.formData.activesearch = '';
                    $scope.showChatModule = false;
                    $scope.showfilterDetail = false;
                    let param = {
                        next_page: 1
                    }
                    if (page) {
                        param.next_page = page;
                    } else {
                        $scope.totalCount = 1;
                        $scope.currentPage = 1;
                        $scope.itemsPerPage = 10;
                        $scope.serial = 1
                        $scope.pagination = {
                            current: 1
                        };
                    }
                    if ($scope.formData.interveneSearch) {
                        param.search = $scope.formData.interveneSearch;
                    }
                    AuthService.getAllInterveneUserData(param)

                        .then(function onSuccess(response) {
                            $scope.interveneUserData = response.data.data.users;
                            $scope.totalCount = response.data.data.total_count
                            console.log($scope.interveneUserData)
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }

                $scope.nextPageChat = function (phone) {
                    $scope.userDetail(phone, $scope.pageCount + 1);

                }

                $scope.prvPageChat = function (phone) {
                    $scope.userDetail(phone, $scope.pageCount - 1);

                }


                $scope.userDetail = function (value, page) {
                    $scope.showChatModule = true;
                    // let param = {
                    //     phoneNumber: value,
                    //     nextPage: 1
                    // }

                    let param = {
                        nextPage: 1,
                        phoneNumber: value,
                    }
                    console.log(value, page)
                    if (page) {
                        param.nextPage = page;
                    } else {
                        $scope.totalCount = 0;
                    }

                    $scope.pageCount = param.nextPage;
                    $scope.disableNextPagebutton = false;
                    AuthService.getAllUserDetailData(param)

                        .then(function onSuccess(response) {
                            console.log(response)

                            $scope.userDetailData = response.data.data;
                            $scope.userChatPayload= $scope.userDetailData.payload;
                            console.log('ooooooooooo', $scope.userChatPayload);
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                    AuthService.getAllUserChatData(param)
                        .then(function onSuccess(response) {
                            $scope.userChatData = response.data.data;
                            console.log("userChatDAta",$scope.userChatData);
                            $scope.totalCount = $scope.userChatData.total_count;
                            if ($scope.totalCount > 20) {
                                let count = $scope.totalCount / 20;
                                if ($scope.pageCount < count) {
                                    $scope.disableNextPagebutton = true;
                                }
                            }

                            if ($scope.userChatData && $scope.userChatData.payload && $scope.userChatData.payload.length > 0) {
                                for (let i in $scope.userChatData.payload) {
                                    //console.log('oppppppppppppppppppp',$scope.userChatData.payload[i].content.contentType);

                                    if ($scope.userChatData.payload[i].content && $scope.userChatData.payload[i].content.url) {
                                        let typesArray = $scope.userChatData.payload[i].content.contentType.split("/");
                                        $scope.userChatData.payload[i].content.types = typesArray;
                                        // $scope.userChatData.payload[i].content.url = $scope.userChatData.payload[i].content.url + typesArray[1];
                                        if (typesArray[0] == 'image') {
                                            $scope.userChatData.payload[i].content.url = $scope.userChatData.payload[i].content.url + typesArray[1]
                                        } else {
                                            // $scope.userChatData.payload[i].content.url = $scope.userChatData.payload[i].content.url + typesArray[1]
                                            let emdUrl = $scope.userChatData.payload[i].content.url + typesArray[1]
                                            $scope.userChatData.payload[i].content.url = $sce.trustAsResourceUrl(emdUrl);
                                        }


                                    }
                                }

                            }
                            console.log("1234", $scope.userChatData)
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }

                $scope.userProfileIcon = function () {
                    $scope.isUserProfile = true;
                }
                $scope.userChatIcon = function () {
                    $scope.isUserProfile = false;
                }

                $scope.isUserProfile = false;
                $scope.userChat = function (value) {

                    let param = {
                        phoneNumber: value,
                        start: value,
                        end: value
                    }
                    AuthService.getAllUserChatData(param)

                        .then(function onSuccess(response) {
                            console.log(response)

                            $scope.userChatData = response.data.data;

                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }
                $scope.hideChatModule = function (value) {
                    $scope.showChatModule = false;
                    $scope.isUserProfile = false;
                    $scope.messageBox = false;
                }

                $scope.writeMessage = function (data, tabValue) {
                    console.log('1111111111111111111', data);
                    $scope.messageBox = true;
                    $scope.tab = { name: 'tabC' };
                    let param = {
                        phone: data.phone_number,
                        username: data.whatsapp_name
                    }
                    AuthService.addUserToIntervene(param)
                        .then(function onSuccess(response) {
                            if (response.data.status) {
                                if (tabValue == 'active') {
                                    var localindex_index = $scope.activeUserData.map(function (el) {
                                        return el.phone_number;
                                    }).indexOf(data.phone_number);
                                    if (localindex_index != -1) {
                                        $scope.activeUserData.splice(localindex_index, 1);
                                        if ($scope.interveneUserData.length > 0) {
                                            $scope.interveneUserData.unshift(data)
                                        } else {
                                            $scope.interveneUserData.push(data)
                                        }
                                    }
                                } else {
                                    var localindex_index = $scope.actionRequiredUserData.map(function (el) {
                                        return el.phone_number;
                                    }).indexOf(data.phone_number);
                                    if (localindex_index != -1) {
                                        $scope.actionRequiredUserData.splice(localindex_index, 1);
                                        if ($scope.interveneUserData.length > 0) {
                                            $scope.interveneUserData.unshift(data)
                                        } else {
                                            $scope.interveneUserData.push(data)
                                        }
                                    }
                                }
                            }
                        }).catch(function onError(response) {
                            console.log(response);
                        })

                }
                $scope.messageBox = false;
                $scope.resolveButton = false;

                $scope.interveneButton = function (data) {
                    console.log('+++++++++++++++++++++++++++', data);
                    $scope.messageBox = false;
                    $scope.resolveButton = true;
                    let param = {
                        phone: data.phone_number,
                        username: data.whatsapp_name
                    }

                    AuthService.addUserToActive(param)
                        .then(function onSuccess(response) {
                            if (response.data.status) {
                                var localindex_index = $scope.interveneUserData.map(function (el) {
                                    return el.phone_number;
                                }).indexOf(data.phone_number);
                                if (localindex_index != -1) {
                                    $scope.interveneUserData.splice(localindex_index, 1);
                                    // if ($scope.activeUserData.length > 0) {
                                    //     $scope.activeUserData.unshift(data)
                                    // } else {
                                    //     $scope.activeUserData.push(data)
                                    // }
                                }

                            }

                        }).catch(function onError(response) {
                            console.log(response);
                        })
                    $scope.hideChatModule();
                    $scope.getActiveUser();
                    $scope.tab = { name: 'tabA' };



                }

                $scope.contactDetail = function (page) {
                    $scope.formData.historySearch = "";
                    $scope.showcontactDetail = true;
                    $scope.showhistoryDetail = false;
                    $scope.totalCount = 0;
                    $scope.showgetActiveUser = false;
                    $scope.showgetActionRequiredUser = false;
                    $scope.showgetInterveneUser = false;
                    $scope.showtemplateDetail = false;
                    //$scope.contactDetailData = [];
                    $scope.showfilterDetail = false;
                    let param = {
                        next_page: 0
                    }
                    if (page) {
                        page = page - 1;
                        param.next_page = page;
                    } else {
                        $scope.totalCount = 0;
                        $scope.currentPage = 1;
                        $scope.itemsPerPage = 10;
                        $scope.serial = 1
                        $scope.pagination = {
                            current: 1
                        };
                    }
                    if ($scope.formData.contactSearch) {
                        param.search = $scope.formData.contactSearch;
                    }
                    AuthService.getAllUserContact(param)
                        .then(function onSuccess(response) {
                            console.log(response)
                            $scope.contactDetailData = response.data.data.users;
                            $scope.totalCount = response.data.data.total_count;
                            console.log($scope.contactDetailData)
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }

                $scope.historyDetail = function (page) {

                    $scope.formData.contactSearch = "";
                    $scope.showcontactDetail = false;
                    $scope.showhistoryDetail = true;
                    $scope.showgetActiveUser = false;
                    $scope.showtemplateDetail = false;
                    $scope.showfilterDetail = false;
                    $scope.isUserProfile = false;
                    $scope.showChatModule = false;
                    //$scope.historyDetailData = [];
                    $scope.totalCount = 0;
                    let param = {
                        next_page: 0
                    }
                    if (page) {
                        page = page - 1;
                        param.next_page = page;
                    } else {
                        $scope.totalCount = 0;
                        $scope.currentPage = 1;
                        $scope.itemsPerPage = 10;
                        $scope.serial = 1
                        $scope.pagination = {
                            current: 1
                        };
                    }
                    if ($scope.formData.historySearch) {
                        param.search = $scope.formData.historySearch;
                    }
                    AuthService.getAllUserHistory(param)


                        .then(function onSuccess(response) {
                            console.log(response)
                            $scope.historyDetailData = response.data.data.users;
                            $scope.totalCount = response.data.data.total_count
                            console.log($scope.historyDetailData)
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }


                $scope.templateDetail = function (value) {
                    // console.log(value)
                    // console.log( $scope.templateSearch)
                    let param = {
                        search: value,
                    }
                    if (!value) {
                        param.search = ""
                    }
                    // alert("template")

                    console.log("111111111", $scope.templateDetailData)
                    $scope.showcontactDetail = false;
                    $scope.showhistoryDetail = false;
                    $scope.showgetActiveUser = false;
                    $scope.showgetActionRequiredUser = false;
                    $scope.showgetInterveneUser = false;
                    $scope.showtemplateDetail = true;
                    $scope.showfilterDetail = false;
                    $scope.formData.historySearch = "";
                    $scope.formData.contactSearch = "";
                    AuthService.getTemplateTabData(param)

                        .then(function onSuccess(response) {
                            console.log(response)
                            $scope.templateDetailData = response.data.data;

                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }
                $scope.filterDetail = function (value) {
                    // console.log(value)
                    // console.log( $scope.templateSearch)
                    let param = {

                    }

                    // alert("template")
                    console.log("111111111", $scope.filterDetailData)
                    $scope.showcontactDetail = false;
                    $scope.showhistoryDetail = false;
                    $scope.showgetActiveUser = false;
                    $scope.showtemplateDetail = false;
                    $scope.showfilterDetail = true;
                    $scope.isUserProfile = false;
                    $scope.showChatModule = false;
                    $scope.formData.historySearch = "";
                    $scope.formData.contactSearch = "";

                    AuthService.getFilterTabData(param)

                        .then(function onSuccess(response) {
                            console.log(response)
                            $scope.filterDetailData = response.data.data;

                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }


                $scope.searchChat = function (value) {
                    console.log(value)
                    $scope.search = value;
                    console.log("search", $scope.search)

                    if (value != "") {
                        let param = {
                            search: $scope.search
                        }
                        AuthService.getActiveSearch(param)

                            .then(function onSuccess(response) {
                                console.log(response)
                                console.log("31")
                                $scope.activeUserData = response.data.data;

                            }).catch(function onError(response) {
                                console.log(response);
                            })
                    } else {
                        $scope.getActiveUser(1)
                    }
                }



                $scope.searchChatHistory = function (value) {
                    console.log(value)
                    $scope.search = value;
                    console.log("search", $scope.search)


                    if (value != "") {
                        let param = {
                            search: $scope.search
                        }
                        AuthService.getActiveSearch(param)

                            .then(function onSuccess(response) {
                                console.log(response)
                                console.log("31")
                                $scope.historyDetailData = response.data.data;

                            }).catch(function onError(response) {
                                console.log(response);
                            })
                    }
                    else {
                        $scope.historyDetail()
                    }
                }

                $scope.searchChatContact = function (value) {
                    console.log(value)
                    $scope.search = value;
                    console.log("search", $scope.search)

                    if (value != "") {
                        let param = {
                            search: $scope.search
                        }
                        AuthService.getActiveSearch(param)

                            .then(function onSuccess(response) {
                                console.log(response)
                                console.log("31")
                                $scope.contactDetailData = response.data.data;

                            }).catch(function onError(response) {
                                console.log(response);
                            })
                    } else {
                        $scope.contactDetail()
                    }
                }


                // $scope.searchChatTemplate = function (value) {
                //     console.log(value)
                //     $scope.search = value;
                //     console.log("search", $scope.search)

                //     if (value != "") {
                //         let param = {
                //             search: $scope.search
                //         }
                //         AuthService.getSearch(param)

                //             .then(function onSuccess(response) {
                //                 console.log(response)
                //                 console.log("31")
                //                 $scope.templateDetailData = response.data.data;

                //             }).catch(function onError(response) {
                //                 console.log(response);
                //             })
                //     } else {
                //         $scope.templateDetail(1)
                //     }
                // }



                // $scope.curPage = 1,
                // $scope.itemsPerPage = 3,
                // $scope.maxSize = 5;


                // $scope.numOfPages = function () {
                //   return Math.ceil(contactDetailData.length / $scope.itemsPerPage);

                // };

                //   $scope.$watch('curPage + numPerPage', function() {
                //   var begin = (($scope.curPage - 1) * $scope.itemsPerPage),
                //   end = begin + $scope.itemsPerPage;

                // //   $scope.filteredItems = contactDetailData.slice(begin, end);
                // });


                $scope.pageChanged = function (newPageNumber, tab) {
                    $scope.serial = newPageNumber * 10 - 9;
                    $scope.contactDetail(newPageNumber);
                };
                $scope.historyPageChanged = function (newPageNumber, tab) {
                    $scope.serial = newPageNumber * 10 - 9;
                    $scope.historyDetail(newPageNumber);
                };



                $scope.liveChatPageChanged = function (newPageNumber, tab) {
                    $scope.serial = newPageNumber * 10 - 9;
                    $scope.getActiveUser(newPageNumber);
                };


                $scope.actionRequiredPageChanged = function (newPageNumber, tab) {
                    $scope.serial = newPageNumber * 10 - 9;
                    $scope.getActionRequiredUser(newPageNumber);
                };

                $scope.interveneDataPageChanged = function (newPageNumber, tab) {

                    $scope.serial = newPageNumber * 10 - 9;
                    $scope.getInterveneUser(newPageNumber);
                };

                $scope.templatePageChanged = function (newPageNumber, tab) {
                    $scope.serial = newPageNumber * 10 - 9;
                    $scope.templateDetail(newPageNumber);
                };




                //   $scope.setCurrentPage =  function(){
                //    $scope.pagination = {
                //      current: 1
                //    };
                //    $scope.serial = 1
                //   }

                $scope.pagination = {
                    current: 1
                };
                $scope.totalCount = 0;
                $scope.currentPage = 1;
                $scope.itemsPerPage = 10;
                $scope.serial = 1
                $scope.pagination = {
                    current: 1
                };
                $scope.options = {};
            $scope.dateRangeModel = {};
                $scope.changeStartDate = function () {
                    $scope.dateRangeModel.start_date = $scope.dateRangeModel.start_dates;
                    $scope.options.minDate = $scope.dateRangeModel.start_date;
                }

                $scope.changeEndDate = function () {
                    if ($scope.changeEndDate > $scope.changeStartDate)
                        $scope.dateRangeModel.end_date = $scope.dateRangeModel.end_dates;
                }

                $scope.filterTab = function () {
                    $scope.hideChatModule();
                    $scope.dateRangeModel = {};
                    $scope.getFilterData();
                }

                $scope.getFilterData = function () {
                    $scope.showcontactDetail = false;
                    $scope.showhistoryDetail = false;
                    $scope.showgetActiveUser = false;
                    $scope.showtemplateDetail = false;
                    $scope.showfilterDetail = true;
                    $scope.dateRangeModel.start_date = $scope.dateFormat($scope.dateRangeModel.start_dates);
                    $scope.dateRangeModel.end_date = $scope.dateFormat($scope.dateRangeModel.end_dates);
                    AuthService.getFilterTabData($scope.dateRangeModel)
                        .then(function onSuccess(response) {
                            $scope.filterData = response.data.data.users;
                        }).catch(function onError(response) {
                            console.log(response);
                        })

                }

                $scope.customerJourney = function (data) {
                    console.log(data)
                    let param = {
                        phone_number: data.phone_number
                    }
                    AuthService.getCustomerJourney(param)
                        .then(function onSuccess(response) {
                            $scope.customerJourneyData = response.data.data;
                            console.log($scope.customerJourneyData)
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }

                $scope.templateInStatus = function (data) {
                    console.log(data)
                    let param = {
                        phone_number: data.phone_number
                    }
                    AuthService.gettemplateInStatus(param)
                        .then(function onSuccess(response) {
                            $scope.templateInStatusData = response.data.data;
                            console.log($scope.templateInStatusData)
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }



                $scope.dateFormat = function (date) {
                    var d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear();
                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;
                    return [year, month, day].join('-');

                }
                $scope.message = {};
                $scope.sendMessage = function (phone) {

                    let param = {
                        phone: phone,
                        
                    }
                    
                    // if(param.text!=null){
                    if ($scope.message.activeMessage) {
                        $scope.oldString = $scope.message.activeMessage;
                        param.text  = $scope.oldString.split("\n").join("%0a");
                        // }
                    }
                    else {
                        return false
                    }
                    // if ($scope.message.activeMessage == "") {
                    //     return false;
                    // }
                    // if($scope.message==''){
                    //     return false;
                    // }
                    console.log('11111111111112222222222222222222', param.text);
                    AuthService.sendMessage(param)
                        .then(function onSuccess(response) {
                            console.log(param)
                            if (response.data.status) {
                                let data = {
                                    content: { text: $scope.message.activeMessage },
                                    sender: "bot",
                                    timestamp: new Date()
                                }
                                if ($scope.userChatData) {
                                    if ($scope.userChatData.payload && $scope.userChatData.payload.length > 0) {
                                        $scope.userChatData.payload.unshift(data);
                                       
                                    }
                                    else {
                                        $scope.userChatData.payload.push(data);
                                       
                                    }
                                }
                                $scope.message = {};


                            }
                        }).catch(function onError(response) {
                            console.log(response);
                        })
                }



                $scope.getContactList = function (value) {
                    let param = {
                        search: value
                    }
                    if (!value) {
                        param.search = ""
                    }
                    console.log("1contct1");
                    console.log(param)
                    AuthService.contactList(param, true)
                        .then(function onSuccess(response) {
                            $scope.contactListData = response.data.data;
                        }).catch(function onError(response) {
                            console.log(response);
                        })

                }

                $scope.getselectedContact = function (email, name, number, c_name) {

                    // var data = {}
                    var data = {
                        gmail: "shahid.dar@machadalo.com",
                        name: name,
                        contact_number: number,
                        company_name: c_name,
                    }
                    var data11 = {
                        0:{
                        name: { firstName: name },
                        phones: [{ phone: number }],
                    }
                }

                    $scope.ckeckdUserAisensy.push(data);
                    $scope.ckeckdUserAisensy1.push(data11);
                    console.log($scope.ckeckdUserAisensy)
                    console.log(',,,,', $scope.ckeckdUserAisensy1)
                    // $scope.sendContact(phone)
                }
                console.log($scope.ckeckdUserAisensy)
                
                $scope.sendContact = function (phone) {

                    let param = {
                        phone_number: phone,
                    }
                    var data = $scope.ckeckdUserAisensy
                    var data22 = $scope.ckeckdUserAisensy1
                    // console.log("--------",typeof(data))
                    // $scope.ckeckdUserAisensy = {};
                    console.log('90909', param.phone_number, data)
                    console.log('90====', data22)
                    AuthService.attachmentContact(param, data)
                        .then(function onSuccess(response) {
                            if (response.data.status) {
                                for (const i in data22) {
                                    let datas = {
                                        content: { contacts: data22[i] },
                                        sender: "bot",
                                        timestamp: new Date()
                                    }
                                    console.log(i,"=-=-=")
                                    console.log("-0-00", datas)
                                    if ($scope.userChatData) {
                                        if ($scope.userChatData.payload && $scope.userChatData.payload.length > 0) {
                                            $scope.userChatData.payload.unshift(datas);
                                            console.log(datas, "0000")
                                        }
                                        else {
                                            $scope.userChatData.payload.push(datas);
                                            console.log(datas, "1111")
                                        }
                                    }
                                                                       
                                }

                            }


                        }).catch(function onError(response) {
                            console.log(response);
                        })
                    }

$scope.requirement_submitted_headings = [
                        { header: '' },
                        { header: 'Sector' },
                        { header: 'Sub Sector' },
                        { header: 'Current Partner' },
                        { header: 'FeedBack' },
                        { header: 'Preferred Partner' },
                        { header: 'L4 Answers' },
                        { header: 'L5 Answers' },
                        { header: 'L6 Answers' },
                        { header: 'L4.1 Answers' },
                        { header: 'L5.1 Answers' },
                        { header: 'L6.1 Answers' },
                        { header: 'Implementation Time' },
                        { header: 'Meeting Time' },
                        // { header: 'Preferred Meeting Time' },
                        { header: 'Lead Status' },
                        { header: 'Comment' },
                        { header: 'Internal Comment' },
                        { header: 'Lead Given by' },
                        { header: 'Call Status' },
                        { header: 'Price' },
                        { header: 'Timestamp' },
                        { header: 'Action' },
                      ];
$scope.requirement_browsed_headings = [
                        { header: '' },
                        { header: 'Sector' },
                        { header: 'Sub Sector' },
                        { header: 'Current Partner' },
                        { header: 'FeedBack' },
                        { header: 'Preferred Partner' },
                        { header: 'L1 Answers' },
                        { header: 'L2 Answers' },
                        { header: 'Implementation Time' },
                        { header: 'Meeting Time' },
                        { header: 'Lead Given by' },
                        { header: 'Comment' },
                        { header: 'Timestamps' }
                      ];  
 $scope.requirementDetailData=[
                         {sector:'test1'},
                         {sector:'test2'},
                         {sector:'test3'},
                    ];
$scope.requirements=[{test1:{a:"A",b:"B",c:"C"}},
                     {test2:{a:"A",b:"B",c:"C"}},
                     {test3:{a:"A",b:"B",c:"C"}}
                    ];
$scope.browsedDetailData=[
                         {sector:'test4'},
                         {sector:'test5'},
                         {sector:'test6'}
                    ];
$scope.detailedShow = [];
 $scope.ShowDetailed=function(index,name){
           $scope.sector_name=name.toLowerCase();
           $scope.oldIndex = index;
           $scope.$watch('oldIndex', function (newValue, oldValue) {
                  if (newValue != oldValue) {
                      $scope.detailedShow[oldValue] = false;
                            }
                   });

                   $scope.detailedShow[index] = !$scope.detailedShow[index];
                   $scope.opsVerifyButtonDiable = true
                   $scope.removeSubSectorDiable = true
                   $scope.updateDisable = false;
                   for (let i in $scope.requirementDetailData[index].requirements) {
                    $scope.requirementDetailData[index].requirements[i].requirementCheck = false;
                    if ($scope.opsVerifyButtonDiable && $scope.requirementDetailData[index].requirements[i].varified_ops == 'no') {
                      $scope.opsVerifyButtonDiable = false;
                    }
                    if ($scope.removeSubSectorDiable && $scope.requirementDetailData[index].requirements[i].is_deleted == 'no') {
                      $scope.removeSubSectorDiable = false;
                    }
        
                    if (!$scope.updateDisable && $scope.requirementDetailData[index].requirements[i].is_deleted == 'yes') {
                      $scope.updateDisable = true;
                    }
                }
                $scope.subSectorCheck = true
                        
                        
        }                               
                    //ops Verified
    //                 $scope.opsVerifyButtonDiable = true;
    //                 $scope.getRequirementDetail = function (id) {
    //                   userService.getSector()
    //                     .then(function onSuccess(response) {
    //                       $scope.sectorList = response.data;
    //                     })
    //                   releaseCampaignService.selectLeads()
    //                   .then(function onSuccess(response) { 
    //                     $scope.leads_time=response.data;
    //                     $scope.leads_Data=response.data.data;
    //                   })    
    //                   releaseCampaignService.requirementDetail(id)
    //                     .then(function onSuccess(response) {
    //                       $scope.requirementDetailData = response.data.data.requirements;
    //                       $scope.companiesDetailData = response.data.data.companies;
    //                       for (let k in $scope.companiesDetailData) {
    //                         $scope.companiesDetailData[k].id = $scope.companiesDetailData[k].organisation_id;
    //                         $scope.companiesDetailData[k].label = $scope.companiesDetailData[k].name;
    //                         $scope.companiesDetailData[k].sector = $scope.companiesDetailData[k].business_type[0];
    //                         if (k == response.data.data.companies.length - 1) {
    //                           $scope.companiesDetailData.push({ id: 'other', label: 'other', organisation_id: '', name: 'other' })
    //                         }
    //                       }
            
            
    //                       angular.forEach($scope.requirementDetailData, function (value, i) {
    //                         //start multiselect preferred company
    //                         // var selected_preferred_company = [];
    //                         // $scope.requirementDetailData[i].selected_preferred_company = [];
    //                         // if ($scope.requirementDetailData[i] && $scope.requirementDetailData[i].preferred_company && $scope.requirementDetailData[i].preferred_company.length > 0) {
    //                         //   for (let j in $scope.requirementDetailData[i].preferred_company) {
    //                         //     var localindex_index = $scope.companiesDetailData.map(function (el) {
    //                         //       return el.organisation_id;
    //                         //     }).indexOf($scope.requirementDetailData[i].preferred_company[j]);
    //                         //     if (localindex_index != -1) {
    //                         //       selected_preferred_company.push($scope.companiesDetailData[localindex_index])
    //                         //     }
    //                         //   }
    //                         //   $scope.requirementDetailData[i].selected_preferred_company = selected_preferred_company
    //                         // }
    //                         //end multiselect preferred company
    //                         //START sub sector multiselect preferred company
    //                         if ($scope.requirementDetailData[i].requirements.length > 0) {
    //                           for (let x in $scope.requirementDetailData[i].requirements) {
    //                             if (!$scope.requirementDetailData[i].requirements[x].current_company) {
    //                               $scope.requirementDetailData[i].requirements[x].current_company = '';
    //                             }
    //                             var selected_preferred_company_sub_sector = [];
    //                             $scope.requirementDetailData[i].requirements[x].selected_preferred_company_sub_sector = [];
            
    //                             if ($scope.requirementDetailData[i].requirements[x].preferred_company_other) {
    //                               $scope.otherPreferredCompany = true
    //                               $scope.requirementDetailData[i].requirements[x].otherPreferredCompany = true
    //                               $scope.requirementDetailData[i].requirements[x].preferred_company.push("")
    //                             }
                   
    //                             if ($scope.requirementDetailData[i].requirements[x].preferred_company && $scope.requirementDetailData[i].requirements[x].preferred_company.length > 0) {
    //                               for (let y in $scope.requirementDetailData[i].requirements[x].preferred_company) {
            
    //                                 var _index = $scope.companiesDetailData.map(function (el) {
    //                                   return el.organisation_id;
    //                                 }).indexOf($scope.requirementDetailData[i].requirements[x].preferred_company[y]);
    //                                 if (_index != -1) {
    //                                   selected_preferred_company_sub_sector.push($scope.companiesDetailData[_index])
    //                                 }
    //                               }
              
    //                               $scope.requirementDetailData[i].requirements[x].selected_preferred_company_sub_sector = selected_preferred_company_sub_sector;
    //                             }
            
    //                             var _indexCompany = $scope.companiesDetailData.map(function (el) {
    //                               return el.organisation_id;
    //                             }).indexOf($scope.requirementDetailData[i].requirements[x].company);
    //                             if (_indexCompany != -1) {
    //                               $scope.requirementDetailData[i].requirements[x].company_name = $scope.companiesDetailData[_indexCompany].name;
    //                             }
            
    //                             // if ($scope.opsVerifyButtonDiable && $scope.requirementDetailData[i].requirements[x].varified_ops == 'no') {
    //                             //   $scope.opsVerifyButtonDiable = false;
    //                             // }
            
    //                             $scope.requirementDetailData[i].requirements[x].color_class = 'yellow'
    //                             if ($scope.requirementDetailData[i].requirements[x].varified_ops == 'yes') {
    //                               $scope.requirementDetailData[i].requirements[x].color_class = 'green'
    //                             }
            
    //                             if ($scope.requirementDetailData[i].requirements[x].is_deleted == 'yes') {
    //                               $scope.requirementDetailData[i].requirements[x].color_class = 'red'
    //                             }
            
            
    //                             //start sub sector name
    //                             if ($scope.requirementDetailData[i].requirements[x].sub_sector) {
    //                               if ($scope.sectorList) {
    //                                 for (let p in $scope.sectorList) {
    //                                   if ($scope.sectorList[p].subtypes && $scope.sectorList[p].subtypes.length > 0) {
    //                                     var sub_index = $scope.sectorList[p].subtypes.map(function (el) {
    //                                       return el.id;
    //                                     }).indexOf($scope.requirementDetailData[i].requirements[x].sub_sector);
    //                                     if (sub_index != -1) {
    //                                       $scope.requirementDetailData[i].requirements[x].sub_sector_name = $scope.sectorList[p].subtypes[sub_index].business_sub_type;
    //                                     }
    //                                   }
    //                                 }
    //                                 //end sub sector name
    //                               }
    //                             }
    //                           }
                              
                              
    //                         }
    //                         //END sub sector multiselect preferred company
    //                         //start added sector name
    //                         if ($scope.sectorList) {
    //                           var localindex_indexs = $scope.sectorList.map(function (el) {
    //                             return el.id;
    //                           }).indexOf($scope.requirementDetailData[i].sector);
    //                           if (localindex_indexs != -1) {
    //                             $scope.requirementDetailData[i].sector_name = $scope.sectorList[localindex_indexs].business_type
    //                           }
                              
    //                         }
            
                        
    //                         //end added sector name
            
    //                       })
    //                       $scope.getRequirementBrowsedData(id);
    //                     }).catch(function onError(response) {
    //                       console.log(response);
    //                     })
    //                     $('#RequirementModel').modal('show');
    //                 }
                    
                    
    //                 $scope.selectLeadData=function(data){
    //                   console.log($scope.leads_time.data[10],data);
    //                   for(let i in $scope.leads_Data){
    //                     for (let j in $scope.leads_Data[i]){
    //                       if(data===j){
    //                         $scope.leads_Data=$scope.leads_Data[i][data];
    //                         break;
    //                       }
    //                     }
    //                   }
    //                 }
    //                 $scope.getRequirementBrowsedData = function (id) {
    //                     releaseCampaignService.requirementBrowsedData(id)
    //                       .then(function onSuccess(response) {
    //                         $scope.browsedDetailData = response.data.data.browsed;
    //                         //console.log($scope.browsedDetailData);
              
    //                         $scope.companiesDetailDataBrowsed = response.data.data.companies;
    //                         //console.log("current partnerData",$scope.companiesDetailDataBrowsed);
    //                         for (let k in $scope.companiesDetailDataBrowsed) {
    //                           $scope.companiesDetailDataBrowsed[k].id = $scope.companiesDetailDataBrowsed[k].organisation_id;
    //                           $scope.companiesDetailDataBrowsed[k].label = $scope.companiesDetailDataBrowsed[k].name;
    //                           $scope.companiesDetailDataBrowsed[k].sector= $scope.companiesDetailDataBrowsed[k].business_type[0];
    //                           if (k == response.data.data.companies.length - 1) {
    //                             $scope.companiesDetailDataBrowsed.push({ id: 'other', label: 'other', organisation_id: '', name: 'other' })
    //                           }
    //                         }
              
                          
    //                         for (let i in $scope.browsedDetailData) {
    //                           $scope.browsedDetailData[i].created_at = moment($scope.browsedDetailData[i].created_at).toISOString();               
    //                           if (!$scope.browsedDetailData[i].current_patner_id) {
    //                             $scope.browsedDetailData[i].current_patner_id = '';
    //                           }
    //                           var selected_preferred_company = [];
    //                           $scope.browsedDetailData[i].selected_preferred_company = [];
    //                            if($scope.browsedDetailData[i].prefered_patner_other){
    //                               $scope.browsedDetailData[i].otherPreferredCompanyBrowsed = true;
    //                               $scope.browsedDetailData[i].prefered_patners.push("");
    //                            }
    //                           if ($scope.browsedDetailData[i].prefered_patners.length > 0) {
    //                             for (let j in $scope.browsedDetailData[i].prefered_patners) {
    //                               var localindex_index = $scope.companiesDetailDataBrowsed.map(function (el) {
    //                                 return el.organisation_id;
    //                               }).indexOf($scope.browsedDetailData[i].prefered_patners[j]);
    //                               if (localindex_index != -1) {
    //                                 selected_preferred_company.push($scope.companiesDetailDataBrowsed[localindex_index])
    //                               }
    //                             }
    //                             $scope.browsedDetailData[i].selected_preferred_company = selected_preferred_company
    //                           }
              
                            
              
    //                           userService.getSector()
    //                           .then(function onSuccess(response) {
    //                             $scope.sectorList = response.data;
    //                             console.log($scope.sectorList[1].business_type);
    //                           });
    //                           //start added sector name
    //                           if ($scope.sectorList) {
    //                             var localindex_indexs = $scope.sectorList.map(function (el) {
    //                               return el.id;
    //                             }).indexOf($scope.browsedDetailData[i].sector_id);
    //                             if (localindex_indexs != -1) {
    //                               $scope.browsedDetailData[i].sector_name = $scope.sectorList[localindex_indexs].business_type
    //                               console.log($scope.browsedDetailData);
    //                             }
    //                           }
    //                           //end added sector name
              
              
    //                           if ($scope.browsedDetailData[i].sub_sector_id) {
    //                             if ($scope.sectorList) {
    //                               for (let p in $scope.sectorList) {
    //                                 if ($scope.sectorList[p].subtypes && $scope.sectorList[p].subtypes.length > 0) {
    //                                   var sub_index = $scope.sectorList[p].subtypes.map(function (el) {
    //                                     return el.id;
    //                                   }).indexOf(JSON.parse($scope.browsedDetailData[i].sub_sector_id));
    //                                   if (sub_index != -1) {
    //                                     $scope.browsedDetailData[i].sub_sector_name = $scope.sectorList[p].subtypes[sub_index].business_sub_type;
    //                                   }
    //                                 }
    //                               }
    //                               //end sub sector name
    //                             }
    //                           }
    //                         }
    //                       }).catch(function onError(response) {
    //                         console.log(response);
    //                       })
    //                   }
    //                 // $scope.opsVerified=function(){
    //                 //     alert("1");
    //                 //     $('#RequirementModel').modal('show');
    //                 //     // $rootScope.getRequirementDetail();
    //                 // }
            }
       ]
    );




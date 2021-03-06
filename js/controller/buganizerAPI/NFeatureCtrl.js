
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .controller('ngNfeatureCtrl', function($scope, buganizerF,CONST) {

            $scope.deviceList = [];
            $scope.oemList = [];
            $scope.featureList = [];
            $scope.featureList.features = [];

            var bugId,title, region,marketingProductName,supportingStatus,releaseVer,oemName,featureName,projectLead,isSupportStatusFound;
            var _featureCount = 0;
            var _features = [];

            $scope.userSignIn = function() {
              var GoogleAuth = gapi.auth2.getAuthInstance();
              GoogleAuth.disconnect();
              console.log('ACK_LOGOUT');
              window.location.reload(true);
            };

            angular.element(document).ready(function () {

                buganizerF.initIssueTrackerAPI().then(
                    // success function
                    function(authResult) {
                        console.log("ACK_API_INITIALIZING(Issue Tracker API)");
                        // call function to retrieve bugs by hotlist
                        buganizerF.getHotlistEntries('AndroidNFeatureAdoption').then(
                            //success function
                            function(response) {
                                _parseData(response);
                            },
                            //error function
                            function (msg) {
                                console.log('ERR_DATA_FETCHING_FAILED - ' + msg.error.message);
                            }
                        );
                    },
                    //error function
                    function(authResult) {
                        console.log("ERR_API_INITIALIZATION_FAILED ");

                        if(authResult === 'ERR_UNAUTHORIZED_USER_SIGNED_IN') {
                            console.log('ERR_UNAUTHORIZED_USER_SIGNED_IN');

                          angular.element(document.querySelector("#promptForAuth"))[0].style.display = null;
                          //angular.element(document.querySelector("#authorize"))[0].onclick = callback;
                        }
                    }
                );
            });

            function _parseData(response) {

                if(!response) {
                    console.log('ERR_BAD_QUERY');
                    return;
                }

                if (!response['hotlistEntries']) {
                    console.log('ERR_NO_DATA_FOUND_OR_CONNECTION_NOT_ESTABLISHED');
                    return;
                }


                for(var i = 0; i < response.hotlistEntries.length; i++)  {
                    var issue = response.hotlistEntries[i];
                    _getIssueDetails(issue);
                    _getDeviceList();
                    _getOemListNDeviceNo();
                    _getFeatureList();
                }

                _adjustDevicNo();
                _sortList();
                _generateAdoptionMatrix();
                _updateBugIdNSupportStatus(response);
            }

            function _updateBugIdNSupportStatus(response) {

                for(var i = 0; i < response.hotlistEntries.length; i++)  {
                    var issue = response.hotlistEntries[i];
                    _getIssueDetails(issue);

                    for(var featureCnt = 0; featureCnt < $scope.featureList.features.length; featureCnt++) {
                        var feature = $scope.featureList.features[featureCnt];
                        if(featureName === feature.name) {
                            for(var availableCnt = 0; availableCnt < feature.availability.length; availableCnt++) {
                                var availability = feature.availability[availableCnt];

                                if( oemName === availability.oemName && marketingProductName === availability.deviceName && releaseVer === availability.launchVersion) {
                                    availability.bug = bugId;
                                    if(supportingStatus === 'Yes' || supportingStatus === 'No')
                                        availability.availability = supportingStatus;
                                    else
                                        availability.availability = 'TBD';
                                }
                            }

                        }
                    }
                }
            }

            function _generateAdoptionMatrix() {
                // generate device x feature matrix
                for(var cnt = 0; cnt < $scope.featureList.features.length; cnt++) {
                    var feature = $scope.featureList.features[cnt];

                    feature.availability = [];

                    for(var deviceCnt = 0; deviceCnt <  $scope.deviceList.length; deviceCnt++) {
                        var device = $scope.deviceList[deviceCnt];

                        var deviceAvailInfo = new Object();
                        deviceAvailInfo.oemName = device.oemName;
                        deviceAvailInfo.deviceName = device.name;
                        deviceAvailInfo.launchVersion = device.launchversion;
                        deviceAvailInfo.availability = 'Unknown';
                        deviceAvailInfo.bug = '00000000';

                        feature.availability.push(deviceAvailInfo);
                    }
                }
            }

            function _sortList() {
                $scope.oemList.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
                $scope.deviceList.sort(sort_by('oemName', false, function(a){return a.toUpperCase()}));
                $scope.featureList.features.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
            }

            function _adjustDevicNo() {
                for (var j = 0; j < $scope.oemList.length; j++) {
                    $scope.oemList[j].colno = $scope.oemList[j].colno/$scope.featureList.features.length;
                }
            }

            function sort_by(field, reverse,primer) {
                var key = primer ?
                    function(x) {return primer(x[field])} :
                    function(x) {return x[field]};

                reverse = !reverse ? 1 : -1;

                return function (a, b) {
                    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                }
            }

            function _getFeatureList() {
                var isFeatureFound = false;
                for(var cnt = 0; cnt < $scope.featureList.features.length; cnt++) {
                    if($scope.featureList.features[cnt].name === featureName) {
                        isFeatureFound = true;
                    }
                }
                if(!isFeatureFound) {
                    var feature = new Array();
                    feature.name = featureName;
                    $scope.featureList.features.push(feature);
                }
            }

            function _getOemListNDeviceNo() {
                var bOEMFound = false;

                for (var j = 0; j < $scope.oemList.length; j++) {
                    if ($scope.oemList[j].name === oemName) {
                        $scope.oemList[j].colno += 1;
                        bOEMFound = true;
                        break;
                    }
                }

                if (!bOEMFound) { // first found. Add OEM name with colno = 1;
                    var oem = new Object();
                    oem.name = oemName;
                    oem.colno = 1;
                    $scope.oemList.push(oem);
                }
            }

            function _getDeviceList() {
                var bDeviceFound = false;

                for(var j = 0; j < $scope.deviceList.length; j++) {
                    if($scope.deviceList[j].name === marketingProductName) {
                        bDeviceFound = true;
                        break;
                    }
                }

                if(!bDeviceFound) {
                    var deviceName = new Object();
                    deviceName.name = marketingProductName;
                    deviceName.launchversion = releaseVer;
                    deviceName.oemName = oemName;
                    $scope.deviceList.push(deviceName);
                }
            }

            function _getIssueDetails(issue) {

                bugId = issue.issue.issueId;
                title = issue.issue.issueState.title;

                isSupportStatusFound = false;

                for(var cnt = 0; cnt < issue.issue.issueState.customFields.length; cnt++) {
                    switch(issue.issue.issueState.customFields[cnt].customFieldId)  {
                        //case '83961': // release version
                        case '85051': // Samsung
                        case '87023': // Next99 > Feature Adoption
                            releaseVer = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83970': // project lead
                        case '85108': // Samsung
                        case '86958': // Next99 > Feature Adoption
                            projectLead = issue.issue.issueState.customFields[cnt].textValue;
                            break;
                        //case '83966': // feature name
                        case '85112': // Samsung
                        case '86964': // Next99 > Feature Adoption
                            featureName = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83965': // OEM name
                        case '85120': // Samsung
                        case '87022': // Next99 > Feature Adoption
                            oemName = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83871': // region
                        case '85121': // Samsung
                        case '86979': // Next99 > Feature Adoption
                            region = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83872': // marketing product name
                        case '85125': // Samsung
                        case '87060': // Next99 > Feature Adoption
                            marketingProductName = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83929': // supporting status
                        case '85113': // Samsung
                        case '87061': // Next99 > Feature Adoption
                            supportingStatus = issue.issue.issueState.customFields[cnt].enumValue;
                            isSupportStatusFound = true;
                            break;
                    }
                }
                // if there was no customFiled for supporting status, it means supporting status is not yet determined.
                if(!isSupportStatusFound)
                    supportingStatus = 'TBD';

                if(supportingStatus != 'Yes' && supportingStatus != 'No')
                    supportingStatus = 'TBD';
            }

            function sort_by(field, reverse,primer) {
                var key = primer ?
                    function(x) {return primer(x[field])} :
                    function(x) {return x[field]};

                reverse = !reverse ? 1 : -1;

                return function (a, b) {
                    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                }
            }
        });
})(window.angular);
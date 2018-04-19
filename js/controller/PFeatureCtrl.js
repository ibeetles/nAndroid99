
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .controller('ngPfeatureCtrl', function($scope, buganizerF) {

            $scope.deviceList = [];
            $scope.oemList = [];
            $scope.featureList = [];
            $scope.featureList.features = [];

            var bugId,title, region,marketingProductName,supportingStatus,releaseVer,oemName,featureName,projectLead,isSupportStatusFound;
            var _featureCount = 0;
            var _features = [];

            angular.element(document).ready(function () {

                buganizerF.initIssueTrackerAPI().then(
                    // success function
                    function(authResult) {
                        console.log("succeeded in init API - initIssueTrackerAPI");
                        // call function to retrieve bugs by hotlist
                        buganizerF.getHotlistEntries('AndroidPFeatureAdoption').then(
                            //success function
                            function(response) {
                                _parseData(response);
                            },
                            //error function
                            function (msg) {
                                console.log(msg);
                                console.log('failed to retrieve hotlist and its bug list - initIssueTrackerAPI');
                            }
                        );
                    },
                    //error function
                    function(authResult) {
                        console.log("failed in init API - initIssueTrackerAPI");
                    }
                );
            });

            function _parseData(response) {
                console.log('parsing data - _parseData');
                if(!response) {
                    console.log('Bad Query executed - _parseData');
                    return;
                }

                if (!response['hotlistEntries']) {
                    console.log('No data existing - _parseData');
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
                        //case '83961': // launch version
                        case '85051': // Samsung
                        case '87023': // Next99 > Feature Adoption
                        case '87079': // Moto
                        case '88362': // LG
                            releaseVer = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83970': // project lead
                        case '85108': // Samsung
                        case '86958': // Next99 > Feature Adoption
                        case '87095': // Moto
                        case '88376': // LG
                            projectLead = issue.issue.issueState.customFields[cnt].textValue;
                            break;
                        //case '83966': // feature name
                        case '85112': // Samsung
                        case '86964': // Next99 > Feature Adoption
                        case '87084': // Moto
                        case '88371': // LG
                            featureName = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83965': // OEM name
                        case '85120': // Samsung
                        case '87022': // Next99 > Feature Adoption
                        case '87074': // Moto
                        case '88367': // LG
                            oemName = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83871': // region
                        case '85121': // Samsung
                        case '86979': // Next99 > Feature Adoption
                        case '87083': // Moto
                        case '88430': // LG
                            region = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83872': // marketing product name
                        case '85125': // Samsung
                        case '87060': // Next99 > Feature Adoption
                        case '87078': // Moto
                        case '88426': // LG
                            marketingProductName = issue.issue.issueState.customFields[cnt].enumValue;
                            break;
                        //case '83929': // supporting status
                        case '85113': // Samsung
                        case '87061': // Next99 > Feature Adoption
                        case '87096': // Moto
                        case '88368': // LG
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
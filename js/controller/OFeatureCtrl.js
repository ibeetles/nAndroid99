
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .controller('ngOfeatureCtrl', function($scope, buganizerF, RESOURCE) {

            $scope.deviceList = [];
            $scope.oemList = [];
            $scope.featureList = [];
            $scope.appTitle = RESOURCE.APP_TITLE;

            var bugId, title, region,marketingProductName,supportingStatus,releaseVer,oemName,featureName,projectLead,isSupportStatusFound;

            var _featureCount = 0;
            var _features = [];

            angular.element(document).ready(function () {

                buganizerF.initIssueTrackerAPI().then(
                    // success function
                    function(authResult) {
                        console.log("succeeded in Control - ngNeoNFeatureAdoptionListCtrl");
                        // call function to retrieve bugs by hotlist
                        buganizerF.getHotlistEntries('AndroidNFeatureAdoption').then(
                            //success function
                            function(response) {
                                // check if response has list of bugs
                                _parseData(response);
                            },
                            //error function
                            function (msg) {
                                console.log(msg);
                            }
                        );
                    },
                    //error function
                    function(authResult) {
                        console.log("failed in Control - ngNeoNFeatureAdoptionListCtrl");
                    }
                );
            });

            function _parseData(response) {
                console.log('parsing data.....');

                if(!response) {
                    console.log('No data in responsed array - _parseData');
                    return;
                }

                for(var i = 0; i < response.hotlistEntries.length; i++)  {
                    var issues = response.hotlistEntries[i];
                    _manipulateIssueDetails(issues);
                    _manipulateDeviceList(oemName, marketingProductName,releaseVer);
                    _manipulateOemNameAndColCount(oemName);
                    _manipulateFeatures(featureName,oemName, marketingProductName,bugId,supportingStatus);
                }

                //dd
                _manipulateOemColno();

                $scope.featureList.features = _features;

                // additional portion of codes
                _manipulateAddingDeviceListToOemList();
                _manipulateAddingFeatureToDeviceList();

                _manipulateAllSorting();

                // final approach
                _remanipulateDeviceList();
                console.log('Done');
            }

            function _remanipulateDeviceList() {
                // clear all memeory
                $scope.deviceList = [];

                for (var cnt = 0; cnt < $scope.oemList.length; cnt++) {
                    var oem = $scope.oemList[cnt];
                    for(var deviceCnt = 0; deviceCnt < oem.deviceList.length; deviceCnt++) {
                        $scope.deviceList.push(oem.deviceList[deviceCnt]);
                    }
                }

                //clear up all the memory here
                $scope.featureList = [];
                $scope.featureList.features = [];

                for(var cnt = 0; cnt < $scope.oemList.length; cnt++) {
                    var oem = $scope.oemList[cnt];
                    for(var deviceCnt = 0; deviceCnt < oem.deviceList.length; deviceCnt++) {
                        var device = oem.deviceList[deviceCnt];
                        for(var featureCnt = 0; featureCnt < device.featureList.length; featureCnt++) {
                            var feature = device.featureList[featureCnt];

                            // add availability if there is feature

                            var isFeatureFound = false;
                            for(var isFeatureFoundCnt = 0 ; isFeatureFoundCnt < $scope.featureList.features.length; isFeatureFoundCnt++) {
                                var orgFeature = $scope.featureList.features[isFeatureFoundCnt];
                                if(orgFeature.name === feature.name) {
                                    // add deviceAvailInfo
                                    var deviceAvailInfo = new Object();
                                    deviceAvailInfo.oemName = oem.name;
                                    deviceAvailInfo.name = device.name;
                                    deviceAvailInfo.bug = feature.bug;
                                    deviceAvailInfo.availability = feature.suppotStatus;

                                    $scope.featureList.features[isFeatureFoundCnt].availability.push(deviceAvailInfo);

                                    isFeatureFound = true;

                                    break;
                                }
                            }

                            if(!isFeatureFound) {
                                // create feature if there is no such feature
                                var finalFeature = new Array();
                                finalFeature.name = feature.name;
                                finalFeature.availability = new Array();
                                $scope.featureList.features.push(finalFeature);

                                var finalDeviceAvailInfo = new Object();
                                finalDeviceAvailInfo.oemName = oem.name;
                                finalDeviceAvailInfo.name = device.name;
                                finalDeviceAvailInfo.bug = feature.bug;
                                finalDeviceAvailInfo.availability = feature.suppotStatus;

                                finalFeature.availability.push(finalDeviceAvailInfo);
                            }
                        }
                    }
                }
            }

            function _manipulateAllSorting() {
                $scope.oemList.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
                for(var cnt = 0; cnt < $scope.oemList.length; cnt++) {
                    var oem = $scope.oemList[cnt];
                    oem.deviceList.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
                    for(var cntDevice = 0; cntDevice < oem.deviceList.length; cntDevice++) {
                        var device = oem.deviceList[cntDevice];
                        device.featureList.sort(sort_by('name', false, function(a){return a.toUpperCase()}));
                    }
                }
            }

            function _manipulateAddingFeatureToDeviceList() {
                for(var oemCnt = 0; oemCnt < $scope.oemList.length; oemCnt++) {
                    var oem = $scope.oemList[oemCnt];
                    for(var deviceCnt = 0; deviceCnt < oem.deviceList.length; deviceCnt++) {
                        var device = oem.deviceList[deviceCnt];
                        device.featureList = [];
                        for(var featureCnt = 0; featureCnt < $scope.featureList.features.length; featureCnt++) {
                            var feature = $scope.featureList.features[featureCnt];
                            for(var availCnt = 0; availCnt < feature.availability.length; availCnt++) {
                                var availability = feature.availability[availCnt];
                                if(availability.oemName === oem.name && availability.name === device.name) {
                                    var featrueAndAvailability = new Object();
                                    featrueAndAvailability.name = feature.name;
                                    featrueAndAvailability.bug = availability.bug;
                                    featrueAndAvailability.deviceName = availability.name;
                                    featrueAndAvailability.oemName = availability.oemName;
                                    featrueAndAvailability.suppotStatus = availability.availability;

                                    device.featureList.push(featrueAndAvailability);
                                }
                            }
                        }
                    }
                }
            }

            function _manipulateAddingDeviceListToOemList() {
             for(var cnt = 0; cnt < $scope.oemList.length; cnt++) {
                 var oem = $scope.oemList[cnt];
                 oem.deviceList = [];
                 for(var i = 0; i < $scope.deviceList.length; i++) {
                     if($scope.deviceList[i].oemName === oem.name) {
                         oem.deviceList.push($scope.deviceList[i]);
                     }
                 }
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

            function _manipulateOemColno() {
                for (var j = 0; j < $scope.oemList.length; j++) {
                    $scope.oemList[j].colno = $scope.oemList[j].colno/_featureCount;
                }
            }

            function _manipulateIssueDetails(issues) {

                bugId = issues.issue.issueId;
                title = issues.issue.issueState.title;

                isSupportStatusFound = false;

                for(var cnt = 0; cnt < issues.issue.issueState.customFields.length; cnt++) {
                    switch(issues.issue.issueState.customFields[cnt].customFieldId)  {
                        case '83961':// release version
                        case '85051':
                            releaseVer = issues.issue.issueState.customFields[cnt].enumValue;
                            break;
                        case '83970':// project lead
                        case '85108':
                            projectLead = issues.issue.issueState.customFields[cnt].textValue;
                            break;
                        case '83966': // feature name
                        case '85112':
                            featureName = issues.issue.issueState.customFields[cnt].enumValue;
                            break;
                        case '83965': // OEM name
                        case '85120':
                            oemName = issues.issue.issueState.customFields[cnt].enumValue;
                            break;
                        case '83871': // region
                        case '85121':
                            region = issues.issue.issueState.customFields[cnt].enumValue;
                            break;
                        case '83872': // marketing product name
                        case '85125':
                            marketingProductName = issues.issue.issueState.customFields[cnt].enumValue;
                            break;
                        case '83929': // supporting status
                        case '85113':
                            supportingStatus = issues.issue.issueState.customFields[cnt].enumValue;
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

            function _manipulateFeatures(featureName, oemName, marketingProductName,bugId,supportingStatus) {
                // make all other memory structures here.
                var bfeatureFound = false;
                for (var j = 0; j < _features.length; j++) {
                    if(_features[j].name === featureName) { // feature already created, just add deviceAvailInfo
                        bfeatureFound = true;

                        // add deviceAvailInfo
                        var deviceAvailInfo = new Object();
                        deviceAvailInfo.oemName = oemName;
                        deviceAvailInfo.name = marketingProductName;
                        deviceAvailInfo.bug = bugId;
                        deviceAvailInfo.availability = supportingStatus;

                        //_features[_features.length-1].availability.push(deviceAvailInfo);
                        _features[j].availability.push(deviceAvailInfo);
                        break;
                    }
                }

                if(!bfeatureFound) { // new feature name found or this is the first feature from the list
                    var feature = new Array();
                    feature.name = featureName;
                    feature.availability = new Array();
                    _features.push(feature);

                    var deviceAvailInfo = new Object();
                    deviceAvailInfo.oemName = oemName;
                    deviceAvailInfo.name = marketingProductName;
                    deviceAvailInfo.bug = bugId;
                    deviceAvailInfo.availability = supportingStatus;

                    feature.availability.push(deviceAvailInfo);

                    _featureCount += 1;
                }
            }

            function _manipulateOemNameAndColCount(name) {
                var bOEMFound = false;

                for (var j = 0; j < $scope.oemList.length; j++) {
                    if ($scope.oemList[j].name === name) {
                        $scope.oemList[j].colno += 1;
                        bOEMFound = true;
                        break;
                    }
                }

                if (!bOEMFound) { // first found. Add OEM name with colno = 1;
                    // {name:'Huawei', colno:6},
                    var oem = new Object();
                    oem.name = name;
                    oem.colno = 1;
                    $scope.oemList.push(oem);
                }
            }

            function _manipulateDeviceList(oemName,name,launchversion) {
                var bDeviceFound = false;

                for(var j = 0; j < $scope.deviceList.length; j++) {
                    if($scope.deviceList[j].name === name) {
                        bDeviceFound = true;
                        break;
                    }
                }

                if(!bDeviceFound) {
                    var deviceName = new Object();
                    deviceName.name = name;
                    deviceName.launchversion = launchversion;
                    deviceName.oemName = oemName;
                    $scope.deviceList.push(deviceName);
                }
            }
        });
})(window.angular);
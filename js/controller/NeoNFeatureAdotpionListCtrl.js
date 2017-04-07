
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .controller('ngNeoNFeatureAdoptionListCtrl', function($scope, buganizerF, RESOURCE) {

            $scope.deviceList = [];
            $scope.oemList = [];
            $scope.featureList = [];
            $scope.appTitle = RESOURCE.APP_TITLE;

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

                var region,marketingProductName,supportingStatus,releaseVer,oemName,featureName,projectLead,isSupportStatusFound;

                for(var i = 0; i < response.hotlistEntries.length; i++)  {
                    isSupportStatusFound = false;

                    var issues = response.hotlistEntries[i];
                    var bugId = issues.issue.issueId;
                    var title = issues.issue.issueState.title;

                    for(var cnt = 0; cnt < issues.issue.issueState.customFields.length; cnt++) {
                        switch(issues.issue.issueState.customFields[cnt].customFieldId)  {
                            case '85051':// release version
                                releaseVer = issues.issue.issueState.customFields[cnt].enumValue;
                                break;
                            case '85108': // project lead
                                projectLead = issues.issue.issueState.customFields[cnt].textValue;
                                break;
                            case '85112': // feature name
                                featureName = issues.issue.issueState.customFields[cnt].enumValue;
                                break;
                            case '85120': // OEM name
                                oemName = issues.issue.issueState.customFields[cnt].enumValue;
                                break;
                            case '85121': // region
                                region = issues.issue.issueState.customFields[cnt].enumValue;
                                break;
                            case '85125': // marketing product name
                                marketingProductName = issues.issue.issueState.customFields[cnt].enumValue;
                                break;
                            case '83929': // supporting status
                                supportingStatus = issues.issue.issueState.customFields[cnt].enumValue;
                                isSupportStatusFound = true;
                                break;
                        }
                    }

                    // if there was no customFiled for supporting status, it means supporting status is not yet determined.
                    if(!isSupportStatusFound)
                        supportingStatus = 'TBD';

                    // set devicelist and OEM/its column count
                    _manipulateDeviceList(marketingProductName,releaseVer);
                    _manipulateOemNameAndColCount(oemName);

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

                            _features[_features.length-1].availability.push(deviceAvailInfo);
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
                $scope.featureList.features = _features;
            }

            function _manipulateDeviceList(name,launchversion) {
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
                    $scope.deviceList.push(deviceName);
                }
            }

            function _manipulateOemNameAndColCount(name) {
                if(_featureCount != 1)
                    return;

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

        });
})(window.angular);
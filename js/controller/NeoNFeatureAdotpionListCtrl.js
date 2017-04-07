
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .controller('ngNeoNFeatureAdoptionListCtrl', function($scope, buganizerF, RESOURCE) {

            $scope.appTitle = RESOURCE.APP_TITLE;
            $scope.deviceList = [];
            $scope.oemList = [];

            var _featureCount = 0;

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

                    var bugId = issues.issue.issueId;
                    var title = issues.issue.issueState.title;
                    var version = issues.issue.issueState.customFields[0].enumValue;
                    var projectLead = issues.issue.issueState.customFields[1].textValue;
                    var featureName = issues.issue.issueState.customFields[2].enumValue;
                    var oem = issues.issue.issueState.customFields[3].enumValue;
                    var region = issues.issue.issueState.customFields[4].enumValue;
                    var marketingProductName = issues.issue.issueState.customFields[5].enumValue;

                    _manipulateDeviceList(marketingProductName,version);
                    _manipulateOemNameAndColCount(oem);
                }

                var st = 'test';
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

(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
    .controller('ngNFeatureAdoptionListCtrl', function($scope, $http, $interval, dremelF,CONST,RESOURCE) {

        $scope.appTitle = RESOURCE.APP_TITLE;
        $scope.jsonFeatureAdoptionList = [];

        $scope.oemList = [];
        $scope.deviceList = [];
        $scope.featureNameList = [];
        $scope.featureList = [];
        $scope.buganizerdate = '';

        var featureCount = 0;
        var _featureCount = 0;
        var _features = [];

        $scope.init = function () {
            var yesterday = new Date(Date.now() - 86400000);
            var dd = yesterday.getDate();
            var mm = yesterday.getMonth() + 1;
            var yyyy = yesterday.getFullYear();

            $scope.buganizerdate = mm+'/'+dd+'/'+yyyy+'.';
        }

        angular.element(document).ready(function () {
            dremelF.executeSQL('NFeature').then(
                // success function
                function(jsonData) {
                    $scope.jsonFeatureAdoptionList = jsonData;

                    if(_validateJsonData($scope.jsonFeatureAdoptionList) === false) {
                        console.log("Data Not Retrieved. Maybe SQL statement error or something else");
                    } else {
                        console.log("Date Retrieved. Good Job,Boy");
                        _parseData();
                    }
                },
                // error function
                function(e) {
                    _onDataError(e);  // Failed to retrieve Market List data (Welcome.html)

                    if(e.statusCode === 'PERMISSION_DENIED')
                        console.log("Data Retrieved failed. Permission denied");
                    else
                        console.log("Data Retrieved failed. No resaon found.");
                }
            );
        });

        function _parseData() {
            for(var i = 0; i < $scope.jsonFeatureAdoptionList.length; i++) {
                var featureAdoption = $scope.jsonFeatureAdoptionList[i];

                _manipulateDeviceList(featureAdoption.product_marketing_name, featureAdoption.launch_version);
                _manipulateOemNameAndColCount(featureAdoption.oem_name);

                var bfeatureFound = false;
                for (var j = 0; j < _features.length; j++) {
                    if(_features[j].name === featureAdoption.feature_name) { // feature already created, just add deviceAvailInfo
                        bfeatureFound = true;

                        // add deviceAvailInfo
                        var deviceAvailInfo = new Object();
                        deviceAvailInfo.name = featureAdoption.product_marketing_name;
                        deviceAvailInfo.bug = featureAdoption.bug_id;

                        if(featureAdoption.support_status === "Yes" || featureAdoption.support_status === "No")
                            deviceAvailInfo.availability = featureAdoption.support_status;
                        else
                            deviceAvailInfo.availability = "TBD";

                        _features[_features.length-1].availability.push(deviceAvailInfo);
                        break;
                    }
                }

                if(!bfeatureFound) { // new feature name found or this is the first feature from the list
                    var feature = new Array();
                    feature.name = featureAdoption.feature_name;
                    feature.availability = new Array();
                    _features.push(feature);

                    var deviceAvailInfo = new Object();
                    deviceAvailInfo.name = featureAdoption.product_marketing_name;
                    deviceAvailInfo.bug = featureAdoption.bug_id;

                    if(featureAdoption.support_status === "Yes" || featureAdoption.support_status === "No")
                        deviceAvailInfo.availability = featureAdoption.support_status;
                    else
                        deviceAvailInfo.availability = "TBD";

                    feature.availability.push(deviceAvailInfo);

                    _featureCount += 1;
                }
            }
            $scope.featureList.features = _features;
        }

        function _manipulateFeatureName(name) {
            // filling in feature list
            var bFeatureNameFound = false;

            for(var j = 0; j < $scope.featureNameList.length; j++) {
                if($scope.featureNameList[j].name === name) {
                    bFeatureNameFound = true;
                    break;
                }
            }

            if(!bFeatureNameFound) {
                var featureName = new Object();
                featureName.name = name;
                $scope.featureNameList.push(featureName);
                _featureCount += 1;
            }
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

        function _validateJsonData(json) {
            if(json === null || json === undefined || json.length <= 0)
                return false;

            return true;
        }

        function _onDataError(e) {
            if (e.getStatusText)
                console.log(e.getStatusText());
            else
                console.log(e);
        }
    });
})(window.angular);


/*
 $scope.oemList = [
 {name:'HTC', colno:3},
 {name:'Huawei', colno:6},
 {name:'LG', colno:2},
 {name:'Moto', colno:2},
 {name:'Samsung', colno:2},
 {name:'Sharp', colno:2},
 {name:'Sony', colno:3},
 {name:'Xiaomi', colno:1}
 ];

 $scope.deviceList = [
 {name: 'HTC 10', launchversion: '7.0' },
 {name: 'U'},
 {name: 'U Lite'},
 {name: 'Mate 9'},
 {name: 'P10'},
 {name: 'P10 Plus'},
 {name: 'Mate 9Pro'},
 {name: 'Mate 10'},
 {name: 'Mate 10 Pro'},
 {name: 'G6'},
 {name: 'V30'},
 {name: 'Moto Z Droid 2017'},
 {name: 'Moto X 2017'},
 {name: 'GS8'},
 {name: 'Note8'},
 {name: 'SH-03J'},
 {name: 'A1 ROme(S3)'},
 {name: 'Xperia XZs'},
 {name: 'Xperia XZ Premium'},
 {name: 'Xperia (TBD)'},
 {name: 'Mi 6'}
 ];
 $scope.featureNameList = [
 {name : 'AB Updates'} ,
 {name : 'FBE/DirectBoot'},
 {name : 'ART/JIT'},
 {name : 'Google attestation key provisioning'},
 {name : 'Multi-Window'},
 {name : 'Vulkan'},
 {name : 'PAI'}
 ];

 $scope.featureList = {
 "features": [
 {
 "name": "AB Updates",
 "availability": [
 {"name": "HTC 10", "availability":"Yes", "bug":"12345"},{"name": "U", "availability":"No", "bug":"12345"},{"name": "U Lite", "availability":"Yes", "bug":"12345"},{"name": "Mate 9", "availability":"No", "bug":"12345"},{"name": "P10", "availability":"No", "bug":"12345"},
 {"name": "P10 Plus", "availability":"No", "bug":"12345"},{"name": "Mate 9Pro", "availability":"TBD", "bug":"12345"},{"name": "Mate 10", "availability":"No", "bug":"12345"},{"name": "Mate 10 Pro", "availability":"No", "bug":"12345"},{"name": "G6", "availability":"No", "bug":"12345"},
 {"name": "V30", "availability":"No", "bug":"12345"},{"name": "Moto Z Droid 2017", "availability":"Yes", "bug":"12345"},{"name": "Moto X 2017", "availability":"Yes", "bug":"12345"},{"name": "GS8", "availability":"No", "bug":"12345"},{"name": "Note8", "availability":"Yes", "bug":"12345"},
 {"name": "SH-03J", "availability":"Yes", "bug":"12345"},{"name": "A1 ROme(S3)", "availability":"No"},{"name": "Xperia XZs", "availability":"TBD", "bug":"12345"},{"name": "Xperia XZ Premium", "availability":"Yes", "bug":"12345"},{"name": "Xperia (TBD)", "availability":"Yes", "bug":"12345"},
 {"name": "Mi 6", "availability":"TBD", "bug":"12345"}
 ]
 },
 {
 "name": "FBE/DirectBoot",
 "availability": [
 {"name": "HTC 10", "availability":"Yes", "bug":"12345"},{"name": "U", "availability":"No", "bug":"12345"},{"name": "U Lite", "availability":"Yes", "bug":"12345"},{"name": "Mate 9", "availability":"No", "bug":"12345"},{"name": "P10", "availability":"No", "bug":"12345"},
 {"name": "P10 Plus", "availability":"No", "bug":"12345"},{"name": "Mate 9Pro", "availability":"TBD", "bug":"12345"},{"name": "Mate 10", "availability":"No", "bug":"12345"},{"name": "Mate 10 Pro", "availability":"No", "bug":"12345"},{"name": "G6", "availability":"No", "bug":"12345"},
 {"name": "V30", "availability":"No", "bug":"12345"},{"name": "Moto Z Droid 2017", "availability":"Yes", "bug":"12345"},{"name": "Moto X 2017", "availability":"Yes", "bug":"12345"},{"name": "GS8", "availability":"No", "bug":"12345"},{"name": "Note8", "availability":"Yes", "bug":"12345"},
 {"name": "SH-03J", "availability":"Yes", "bug":"12345"},{"name": "A1 ROme(S3)", "availability":"No"},{"name": "Xperia XZs", "availability":"TBD", "bug":"12345"},{"name": "Xperia XZ Premium", "availability":"Yes", "bug":"12345"},{"name": "Xperia (TBD)", "availability":"Yes", "bug":"12345"},
 {"name": "Mi 6", "availability":"TBD", "bug":"12345"}
 ]
 },
 {
 "name": "ART/JIT",
 "availability": [
 {"name": "HTC 10", "availability":"Yes", "bug":"12345"},{"name": "U", "availability":"No", "bug":"12345"},{"name": "U Lite", "availability":"Yes", "bug":"12345"},{"name": "Mate 9", "availability":"No", "bug":"12345"},{"name": "P10", "availability":"No", "bug":"12345"},
 {"name": "P10 Plus", "availability":"No", "bug":"12345"},{"name": "Mate 9Pro", "availability":"TBD", "bug":"12345"},{"name": "Mate 10", "availability":"No", "bug":"12345"},{"name": "Mate 10 Pro", "availability":"No", "bug":"12345"},{"name": "G6", "availability":"No", "bug":"12345"},
 {"name": "V30", "availability":"No", "bug":"12345"},{"name": "Moto Z Droid 2017", "availability":"Yes", "bug":"12345"},{"name": "Moto X 2017", "availability":"Yes", "bug":"12345"},{"name": "GS8", "availability":"No", "bug":"12345"},{"name": "Note8", "availability":"Yes", "bug":"12345"},
 {"name": "SH-03J", "availability":"Yes", "bug":"12345"},{"name": "A1 ROme(S3)", "availability":"No"},{"name": "Xperia XZs", "availability":"TBD", "bug":"12345"},{"name": "Xperia XZ Premium", "availability":"Yes", "bug":"12345"},{"name": "Xperia (TBD)", "availability":"Yes", "bug":"12345"},
 {"name": "Mi 6", "availability":"TBD", "bug":"12345"}
 ]
 },
 {
 "name": "Google attestation key provisioning",
 "availability": [
 {"name": "HTC 10", "availability":"Yes", "bug":"12345"},{"name": "U", "availability":"No", "bug":"12345"},{"name": "U Lite", "availability":"Yes", "bug":"12345"},{"name": "Mate 9", "availability":"No", "bug":"12345"},{"name": "P10", "availability":"No", "bug":"12345"},
 {"name": "P10 Plus", "availability":"No", "bug":"12345"},{"name": "Mate 9Pro", "availability":"TBD", "bug":"12345"},{"name": "Mate 10", "availability":"No", "bug":"12345"},{"name": "Mate 10 Pro", "availability":"No", "bug":"12345"},{"name": "G6", "availability":"No", "bug":"12345"},
 {"name": "V30", "availability":"No", "bug":"12345"},{"name": "Moto Z Droid 2017", "availability":"Yes", "bug":"12345"},{"name": "Moto X 2017", "availability":"Yes", "bug":"12345"},{"name": "GS8", "availability":"No", "bug":"12345"},{"name": "Note8", "availability":"Yes", "bug":"12345"},
 {"name": "SH-03J", "availability":"Yes", "bug":"12345"},{"name": "A1 ROme(S3)", "availability":"No"},{"name": "Xperia XZs", "availability":"TBD", "bug":"12345"},{"name": "Xperia XZ Premium", "availability":"Yes", "bug":"12345"},{"name": "Xperia (TBD)", "availability":"Yes", "bug":"12345"},
 {"name": "Mi 6", "availability":"TBD", "bug":"12345"}
 ]
 },
 {
 "name": "Multi-Window",
 "availability": [
 {"name": "HTC 10", "availability":"Yes", "bug":"12345"},{"name": "U", "availability":"No", "bug":"12345"},{"name": "U Lite", "availability":"Yes", "bug":"12345"},{"name": "Mate 9", "availability":"No", "bug":"12345"},{"name": "P10", "availability":"No", "bug":"12345"},
 {"name": "P10 Plus", "availability":"No", "bug":"12345"},{"name": "Mate 9Pro", "availability":"TBD", "bug":"12345"},{"name": "Mate 10", "availability":"No", "bug":"12345"},{"name": "Mate 10 Pro", "availability":"No", "bug":"12345"},{"name": "G6", "availability":"No", "bug":"12345"},
 {"name": "V30", "availability":"No", "bug":"12345"},{"name": "Moto Z Droid 2017", "availability":"Yes", "bug":"12345"},{"name": "Moto X 2017", "availability":"Yes", "bug":"12345"},{"name": "GS8", "availability":"No", "bug":"12345"},{"name": "Note8", "availability":"Yes", "bug":"12345"},
 {"name": "SH-03J", "availability":"Yes", "bug":"12345"},{"name": "A1 ROme(S3)", "availability":"No"},{"name": "Xperia XZs", "availability":"TBD", "bug":"12345"},{"name": "Xperia XZ Premium", "availability":"Yes", "bug":"12345"},{"name": "Xperia (TBD)", "availability":"Yes", "bug":"12345"},
 {"name": "Mi 6", "availability":"TBD", "bug":"12345"}
 ]
 },
 {
 "name": "Vulkan",
 "availability": [
 {"name": "HTC 10", "availability":"Yes", "bug":"12345"},{"name": "U", "availability":"No", "bug":"12345"},{"name": "U Lite", "availability":"Yes", "bug":"12345"},{"name": "Mate 9", "availability":"No", "bug":"12345"},{"name": "P10", "availability":"No", "bug":"12345"},
 {"name": "P10 Plus", "availability":"No", "bug":"12345"},{"name": "Mate 9Pro", "availability":"TBD", "bug":"12345"},{"name": "Mate 10", "availability":"No", "bug":"12345"},{"name": "Mate 10 Pro", "availability":"No", "bug":"12345"},{"name": "G6", "availability":"No", "bug":"12345"},
 {"name": "V30", "availability":"No", "bug":"12345"},{"name": "Moto Z Droid 2017", "availability":"Yes", "bug":"12345"},{"name": "Moto X 2017", "availability":"Yes", "bug":"12345"},{"name": "GS8", "availability":"No", "bug":"12345"},{"name": "Note8", "availability":"Yes", "bug":"12345"},
 {"name": "SH-03J", "availability":"Yes", "bug":"12345"},{"name": "A1 ROme(S3)", "availability":"No"},{"name": "Xperia XZs", "availability":"TBD", "bug":"12345"},{"name": "Xperia XZ Premium", "availability":"Yes", "bug":"12345"},{"name": "Xperia (TBD)", "availability":"Yes", "bug":"12345"},
 {"name": "Mi 6", "availability":"TBD", "bug":"12345"}
 ]
 },
 {
 "name": "PAI",
 "availability": [
 {"name": "HTC 10", "availability":"Yes", "bug":"12345"},{"name": "U", "availability":"No", "bug":"12345"},{"name": "U Lite", "availability":"Yes", "bug":"12345"},{"name": "Mate 9", "availability":"No", "bug":"12345"},{"name": "P10", "availability":"No", "bug":"12345"},
 {"name": "P10 Plus", "availability":"No", "bug":"12345"},{"name": "Mate 9Pro", "availability":"TBD", "bug":"12345"},{"name": "Mate 10", "availability":"No", "bug":"12345"},{"name": "Mate 10 Pro", "availability":"No", "bug":"12345"},{"name": "G6", "availability":"No", "bug":"12345"},
 {"name": "V30", "availability":"No", "bug":"12345"},{"name": "Moto Z Droid 2017", "availability":"Yes", "bug":"12345"},{"name": "Moto X 2017", "availability":"Yes", "bug":"12345"},{"name": "GS8", "availability":"No", "bug":"12345"},{"name": "Note8", "availability":"Yes", "bug":"12345"},
 {"name": "SH-03J", "availability":"Yes", "bug":"12345"},{"name": "A1 ROme(S3)", "availability":"No"},{"name": "Xperia XZs", "availability":"TBD", "bug":"12345"},{"name": "Xperia XZ Premium", "availability":"Yes", "bug":"12345"},{"name": "Xperia (TBD)", "availability":"Yes", "bug":"12345"},
 {"name": "Mi 6", "availability":"TBD", "bug":"12345"}
 ]
 }
 ]
 }
 */
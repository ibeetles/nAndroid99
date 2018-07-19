
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .controller('ngOfeatureTrixCtrl', function($scope, sheetF) {

            $scope.deviceList = [];
            $scope.oemList = [];
            $scope.featureList = [];
            $scope.featureGroupList = [];
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

              sheetF.initSheetAPI().then(
                  // success function
                  function(authResult) {
                    console.log("ACK_API_INITIALIZING(Sheet API)");
                    // call function to retrieve bugs by hotlist
                    sheetF.getTrixEntries('O').then(
                        //success function
                        function(response) {
                          sheetF.getTrixMetaData('O').then(
                              function(metaResponse) {
                                _parseDataEx(response,metaResponse);
                              },
                              function(metaMsg) {
                                console.log('ERR_NO_METADATA');
                                _parseData(response);
                              });
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
                    }
                  }
              );
            });

            function _parseDataEx(response,metaResponse) {

              if(!response || !metaResponse) {
                console.log('ERR_BAD_QUERY');
                return;
              }

              if(response.result.values.length <= 0) {
                console.log('ERR_NO_DATA_FOUND_OR_CONNECTION_NOT_ESTABLISHED');
                return;
              }
              // generate deviceList
              _getDeviceListEx(response.result.values[0],response.result.values[1], response.result.values[2]);

              // generate OEM List and number of Device per OEM
              _getOemListNDeviceNoEx(response.result.values[0]);

              // generate feature list with feature category
              _getFeatureListEx(response.result.values);
              _generateAdoptionMatrix();
              //_updateBugIdNSupportStatusEx(response);
              _updateBugIdNSupportStatusEx2(response,metaResponse);
            }

            function _getMetadataRow(metaData, metadataKey) {
              for(var i = 0; i < metaData.result.matchedDeveloperMetadata.length; i++) {
                var metadataRow = metaData.result.matchedDeveloperMetadata[i];
                if(metadataRow.developerMetadata.metadataKey === metadataKey)
                  return metadataRow.developerMetadata.metadataValue;
              }
              return 'NOT_FOUND';
            }

            function _generateMetadataRowArray(metadataValue) {
              // 36649528,36650869,36650022,36649529,36648395,36648980,36648287,36651857,36651160,36649428,72450983,36648343,36649430,36651111,36648533,36850736,110573265,36852439,110568754,36648192,36648394,36649321,36649527,36649320,36648233
              if(metadataValue === 'NOT_FOUND')
                return;

              var metadataArray = [];
              var nStartPos = 0;
              var bugId = "";

              while (true) {
                var nPos = metadataValue.indexOf(',', nStartPos);
                if(nPos === -1)
                {
                  // let's find what is the last bug ID
                  if(nStartPos > 0 )  {
                    bugId = metadataValue.slice(nStartPos);
                    metadataArray.push(bugId);
                  }
                  break;
                }
                bugId = metadataValue.slice(nStartPos,nPos);
                metadataArray.push(bugId);
                nStartPos = nPos + 1;
              }
              return metadataArray;
            }

            function _updateBugIdNSupportStatusEx2(response,metaResponse) {

              for(var featureCnt = 0; featureCnt < $scope.featureList.features.length; featureCnt++) {
                var feature = $scope.featureList.features[featureCnt];

                // lookup metaData by metadataKey - N:{feature.name}
                var metadataKey = 'O:' + feature.name;
                var metadataValue = _getMetadataRow(metaResponse, metadataKey);
                var metadataValueArray = _generateMetadataRowArray(metadataValue);

                for(var j = 0; j < feature.availability.length; j++) {
                  var data = response.result.values[featureCnt+3][j+2];

                  if(data === 'O')
                    data = 'Yes';
                  else if (data === 'X')
                    data = 'No';
                  else
                    data = 'TBD';

                  feature.availability[j].availability = data;
                  // we should add bug number here
                  // availability.bug = bugId;
                  if(metadataValue != 'NOT_FOUND')
                    feature.availability[j].bug = metadataValueArray[j];
                }
              }
            }

            function _parseData(response) {

                if(!response) {
                  console.log('ERR_BAD_QUERY');
                    return;
                }

                if(response.result.values.length <= 0) {
                    console.log('ERR_NO_DATA_FOUND_OR_CONNECTION_NOT_ESTABLISHED');
                    return;
                }
                // generate deviceList
                _getDeviceListEx(response.result.values[0],response.result.values[1], response.result.values[2]);

                // generate OEM List and number of Device per OEM
                _getOemListNDeviceNoEx(response.result.values[0]);


                // generate feature list with feature category
                _getFeatureListEx(response.result.values);
                _generateAdoptionMatrix();
                _updateBugIdNSupportStatusEx(response);
            }

            function _getOemListNDeviceNoEx (oemNameList) {
              for(var i = 2; i < oemNameList.length; i++) {
                _getOemListNDeviceNoInnerEx(oemNameList[i]);
              }
            }

          function _getOemListNDeviceNoInnerEx(oemName) {
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

          function _updateBugIdNSupportStatusEx(response) {

            for(var featureCnt = 0; featureCnt < $scope.featureList.features.length; featureCnt++) {
              var feature = $scope.featureList.features[featureCnt];
              for(var j = 0; j < feature.availability.length; j++) {
                var data = response.result.values[featureCnt+3][j+2];

                if(data === 'O')
                  data = 'Yes';
                else if (data === 'X')
                  data = 'No';
                else
                  data = 'TBD';

                feature.availability[j].availability = data;
                // we should add bug number here
                // availability.bug = bugId;
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

            function _getFeatureGroupNNumberEx(featureGroupName) {
              var bFeatureGroupFound = false;
              for (var j = 0; j < $scope.featureGroupList.length; j++) {
                if ($scope.featureGroupList[j].name === featureGroupName) {
                  $scope.featureGroupList[j].rowno += 1;
                  bFeatureGroupFound = true;
                  break;
                }
              }

              if (!bFeatureGroupFound) { // first found. Add Feature Group name with rowno = 1;
                var featureGroup = new Object();
                featureGroup.name = featureGroupName;
                featureGroup.colno = 1;
                $scope.featureGroupList.push(featureGroup);
              }
            }


            function _getFeatureListEx(responseResults) {
              var featureGroupName = 'unknown';

              for(var i = 3; i < responseResults.length; i++) {
                var feature = new Array();
                feature.name = responseResults[i][1]; // feature name
                feature.group = responseResults[i][0]; // feature group
                if(featureGroupName != feature.group)
                  feature.newGroup = true;
                featureGroupName = feature.group;

                $scope.featureList.features.push(feature);

                _getFeatureGroupNNumberEx(feature.group);
              }
            }
            /*

          function _getFeatureListEx(responseResults) {
            for(var i = 3; i < responseResults.length; i++) {
              var feature = new Array();
              feature.name = responseResults[i][1]; // feature name
              feature.group = responseResults[i][0]; // feature group
              $scope.featureList.features.push(feature);

              _getFeatureGroupNNumberEx(feature.group);
            }
          }

          */
          function _getDeviceListEx(oemListData,deviceListData,deviceVersionListData) {
              for(var i = 2; i < deviceListData.length; i++){

                var deviceName = new Object();
                deviceName.name = deviceListData[i];
                deviceName.launchversion = deviceVersionListData[i];
                deviceName.oemName = oemListData[i];
                $scope.deviceList.push(deviceName);
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
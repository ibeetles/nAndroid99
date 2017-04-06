
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .controller('ngNeoNFeatureAdoptionListCtrl', function($scope, buganizerF, RESOURCE) {

            $scope.appTitle = RESOURCE.APP_TITLE;

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
                response.hotlistEntries.forEach(function(hotlistEntries) {
                    var issue = hotlistEntries;
                });
            }
        });
})(window.angular);
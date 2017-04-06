
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .controller('ngNeoNFeatureAdoptionListCtrl', function($scope) {

            /**
             * The root URL for the Issue Tracker API.
             * This API talks to the same backend as http://buganizer
             * This is the Buganizer production datastore.
             */
            var ISSUE_TRACKER_API_ROOT = 'https://issuetracker.corp.googleapis.com';

            /**
             * The root URL for the QA Issue Tracker API.
             * This API talks to the same backend as http://buganizer-qa.
             * Feel free to use this as a sandbox.
             */
            var ISSUE_TRACKER_QA_API_ROOT = 'https://test-issuetracker.corp.googleapis.com';

            /**
             * Discovery file path.
             */
            var DISCOVERY_PATH = '/$discovery/rest';

            /**
             * The version of the Issue Tracker API.
             */
            var ISSUE_TRACKER_API_VERSION = 'v1';

            /**
             * A client ID for a web application from the Google Developers Console.
             */
            var CLIENT_ID =
                '679229101304-vljrfd0euv7k4lusujrfm9e55n6iuvp0.apps.googleusercontent.com';

            /**
             * The space-delimited list of scopes to authorize
             */
            var SCOPES = 'https://www.googleapis.com/auth/buganizer';

            angular.element(document).ready(function () {

                console.log('lets start');
                /*buganizerF.initIssueTrackerAPI().then(
                    // success function
                    function(msg) {
                        // call function to retrieve bugs by hotlist
                        buganizerF.getHotlistEntries(AndroidNFeatureAdoption).then(
                            //success function
                            function(response) {
                                // check if response has list of bugs
                                var buglist = response;
                            },
                            //error function
                            function (msg) {
                                console.log(msg);
                            }
                        );
                    },
                    //error function
                    function(msg) {
                        console.log(msg);
                    }
                );*/
            });

            /**
             * Called as soon the gapi script is loaded, since the script tag we used had
             * the name of this function on the onload parameter:
             *  <script src="//apis.google.com/js/client.js?onload=handleClientLoad">
             */
            $scope.handleClientLoad = function () {
                /*
                 * Sends an Auth call with immediate mode on, which attempts to refresh
                 * the token behind the scenes, without showing any UI to the user.
                 */
                //gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true},
//                    handleAuthResult);
                console.log('handleClientLoad');
            };

            /**
             * Callback for authorization calls which, on success, hides the auth
             * button and shows the content div, else it makes sure the auth button
             * is visible and with the correct callback.
             *
             * @param {?Object} authResult Contains the authentication result info.
             */
            function handleAuthResult(authResult) {
                if (authResult && !authResult.error) {
                    console.log('succeeded in loading the issue tracker API');
                } else {
                    console.log('failed in loading the issue tracker API');
                }
            }

        });
})(window.angular);
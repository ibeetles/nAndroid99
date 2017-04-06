
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .service('buganizerF', function($q) {

            var deferred = $q.defer();;
            var isAPILoaded = false;

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

            /*
             * Sends an Auth call with immediate mode on, which attempts to refresh
             * the token behind the scenes, without showing any UI to the user.
             *//*
            this.initIssueTrackerAPI = function() {
                deferred = $q.defer();
                gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true},function(handleAuthResult) {
                    if (authResult && !authResult.error) {
                        console.log('succeeded in loading the issue tracker API');

                        $scope.isAPILoaded = true;
                        deferred.resolve(authResult);
                    } else {
                        console.log('failed in loading the issue tracker API');

                        $scope.isAPILoaded = false;
                        deferred.reject(authResult);
                    }
                    return deferred.promise;
                });
            };
*/
            this.initIssueTrackerAPI = function() {
                gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true},handleAuthResult);
            };

            /**
             * Called as soon the gapi script is loaded, since the script tag we used had
             * the name of this function on the onload parameter:
             *  <script src="//apis.google.com/js/client.js?onload=handleClientLoad">
             */
            function handleAuthResult(authResult) {
                if (authResult && !authResult.error) {
                    console.log('succeeded in loading the issue tracker API');

                    $scope.isAPILoaded = true;
                    deferred.resolve(authResult);
                } else {
                    console.log('failed in loading the issue tracker API');

                    $scope.isAPILoaded = false;
                    deferred.reject(authResult);
                }
                return deferred.promise;
            }

            this.getHotlistEntries = function(hotlistName) {

                var hotlistId;
                deferred = $q.defer();

                // if API is not initialized, return false
                if(!$scope.isAPILoaded) {
                    deferred.reject('API is not initialized');
                    return deferred.promise;
                }

                if(hotlistName === 'AndroidNFeatureAdoption') {
                    hotlistId = CONST.AndroidNFeatureAdoption;
                }
                else if(hostlistName === 'AndroidOFeatureAdoption') {
                    hotlistId = CONST.AndroidOFeatureAdoption;
                }
                else {
                    deferred.reject('Wrong Hotlist Name');
                    return deferred.promise;
                }

                // Load correct version and make call to find assigned issues.
                gapi.client.load(
                    ISSUE_TRACKER_API_ROOT + DISCOVERY_PATH,
                    ISSUE_TRACKER_API_VERSION,
                    function() {
                        var request = gapi.client.corp_issuetracker.hotlists.entries.list (
                            {'hotlistId':'466180'},
                            {'pageSize' : '500'},
                            {'orderBy' : 'title,custom_field:83966,custom_field:83965,custom_field:83872'}
                        );
                        request.execute(handleResponse);
                    });
            };

            function handleResponse(response) {
                // Something went wrong.
                if (!response) {
                    deferred.reject('A bad request was made');
                    return deferred.promise;
                }

                if (!response['issues']) {
                    consolde.log('issues are retrieved');
                    // elem('#issues').append(document.createTextNode('No issues found.'));
                } else {
                    consolde.log('issues are retrieved');
                    /*
                     response.issues.forEach(function(issue) {
                     var issueUrl = 'http://b/' + issue.issueId;
                     var anchor = document.createElement('a');
                     var item = document.createElement('li');
                     anchor.href = issueUrl;
                     anchor.target = '_blank';
                     anchor.appendChild(document.createTextNode(issueUrl));

                     item.appendChild(anchor);
                     item.appendChild(document.createTextNode(' ' + issue.issueState.title));
                     elem('#issues').append(item);
                     });
                     */
                }
            }

        });

})(window.angular);
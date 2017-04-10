
(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .service('buganizerF', function($q, CONST) {

            var deferred;
            var isAPILoaded = false;

            var ISSUE_TRACKER_API_ROOT = CONST.ISSUE_TRACKER_API_ROOT;
            var ISSUE_TRACKER_QA_API_ROOT = CONST.ISSUE_TRACKER_QA_API_ROOT;
            var DISCOVERY_PATH = CONST.DISCOVERY_PATH;
            var ISSUE_TRACKER_API_VERSION = CONST.ISSUE_TRACKER_API_VERSION;
            var CLIENT_ID = CONST.CLIENT_ID;
            var SCOPES = CONST.SCOPES;

            /*
             * Sends an Auth call with immediate mode on, which attempts to refresh
             * the token behind the scenes, without showing any UI to the user.
             */
            this.initIssueTrackerAPI = function() {
                deferred = $q.defer();
                gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true},function handleAuthResult(authResult) {
                    if (authResult && !authResult.error) {
                        console.log('succeeded in loading the issue tracker API');

                        isAPILoaded = true;
                        deferred.resolve(authResult);
                    } else {
                        console.log('failed in loading the issue tracker API');

                        isAPILoaded = false;
                        deferred.reject(authResult);
                    }
                    return deferred.promise;
                });

                return deferred.promise;
            };

            this.initIssueTrackerAPI2 = function() {
                deferred = $q.defer();
                gapi.load('client', init2);
                return deferred.promise;
            }

            function init2() {
                gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true},function handleAuthResult(authResult) {
                    if (authResult && !authResult.error) {
                        console.log('succeeded in loading the issue tracker API');

                        isAPILoaded = true;
                        deferred.resolve(authResult);
                    } else {
                        console.log('failed in loading the issue tracker API');

                        isAPILoaded = false;
                        deferred.reject(authResult);
                    }
                    return deferred.promise;
                });
                return deferred.promise;
            }

            this.getHotlistEntries = function(hotlistName) {

                var hotlistId;
                deferred = $q.defer();

                // if API is not initialized, return false
                if(!isAPILoaded) {
                    deferred.reject('API is not initialized - getHotlistEntries');
                    return deferred.promise;
                }

                if(hotlistName === 'AndroidNFeatureAdoption') {
                    hotlistId = CONST.AndroidNFeatureAdoption;
                }
                else if(hostlistName === 'AndroidOFeatureAdoption') {
                    hotlistId = CONST.AndroidOFeatureAdoption;
                }
                else {
                    deferred.reject('Wrong Hotlist Name - getHotlistEntries');
                    return deferred.promise;
                }

                // Load correct version and make call to find assigned issues.
                gapi.client.load(
                    ISSUE_TRACKER_API_ROOT + DISCOVERY_PATH,
                    ISSUE_TRACKER_API_VERSION,
                    function() {
                        var request = gapi.client.corp_issuetracker.hotlists.entries.list (
                            {'hotlistId':'466180'},
                            {'pageSize' : '500'}
                        );
                        request.execute(handleResponse);
                    });

                return deferred.promise;
            };

            function handleResponse(response) {
                // Something went wrong.
                if (!response) {
                    deferred.reject('A bad request was made - getHotlistEntries');
                    return deferred.promise;
                }

                if(!response['hotlistEntries']) {
                    console.log('BugList Not Retrieved - getHotlistEntries');
                    deferred.resolve(response);
                }else{
                    console.log('BugList Retrieved - getHotlistEntries');
                    deferred.resolve(response);
                }
                return deferred.promise;
            }
        });
})(window.angular);
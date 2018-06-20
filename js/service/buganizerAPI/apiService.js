
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
            var API_KEY = CONST.API_KEY_ISSUE_TRACKER;
            var DISCOVERY_FULL_PATH = CONST.DISCOVERY_PATH_FULL_ISSUE_TRACKER;

            /*
             * Sends an Auth call with immediate mode on, which attempts to refresh
             * the token behind the scenes, without showing any UI to the user.
             */
            this.initIssueTrackerAPI = function() {
                deferred = $q.defer();
                //gapi.load('client', init);
                gapi.load('client:auth2', init);
                return deferred.promise;
            }

            function isAuthorizedUserSignedIn() {
              var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
              var email = profile.getEmail();
              var pos = email.search('@');
              var emailDomain = email.slice(pos+1);

              if(emailDomain === 'google.com')
                return true;
              return false;
            }

          /*            function init() {


          gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: [DISCOVERY_FULL_PATH],
                clientId: CLIENT_ID,
                scope: SCOPES
              })
              .then(
                function () {
                  // Listen for sign-in state changes.
                  gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                  if(gapi.auth2.getAuthInstance().isSignedIn.get() === false){
                    isAPILoaded = false;
                    deferred.reject('Not yet signed in');
                    gapi.auth2.getAuthInstance().signIn();
                  } else {
                    if(!isAuthorizedUserSignedIn()) {
                      isAPILoaded = false;
                      deferred.reject('Unauthorized user has signed in');
                      gapi.auth2.getAuthInstance().signOut();
                      window.location.reload(true);
                    } else {
                      isAPILoaded = true;
                      deferred.resolve('succeed in API loading');
                    }
                  }
                },
                function(reason) {
                  console.log('failed to load the issue tracker API - ' + reason.message);

                  isAPILoaded = false;
                  deferred.reject('failed to load API');
                }
              );

          return deferred.promise;
        }
        */

          function init() {

            gapi.client.init({
              apiKey: API_KEY,
              discoveryDocs: [DISCOVERY_FULL_PATH],
              clientId: CLIENT_ID,
              scope: SCOPES
            }).then(function () {
              // Listen for sign-in state changes.
              gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

              if(!gapi.auth2.getAuthInstance().isSignedIn.get()){
                gapi.auth2.getAuthInstance().signIn();

                isAPILoaded = false;
                deferred.reject('ERR_NOT_SIGNED_IN');
                return deferred.promise;
              }

              if(!isAuthorizedUserSignedIn()) {
                isAPILoaded = false;
                deferred.reject('ERR_UNAUTHORIZED_USER_SIGNED_IN');
                return deferred.promise;
              }

              isAPILoaded = true;
              deferred.resolve('ACK_SUCCESS_SIGN_IN');
            }, function(reason) {
              console.log('ERR_GAPI_INITIALIZING_FAIL - ' + reason.error.message);

              isAPILoaded = false;
              deferred.reject('ERR_GAPI_INITIALIZING_FAIL');
            });

            return deferred.promise;

            /*
            gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: false},function handleAuthResult(authResult) {
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

            return deferred.promise;  */
          }

            this.getHotlistEntries = function(hotlistName) {

                var hotlistId;
                deferred = $q.defer();

                // if API is not initialized, return false
                if(!isAPILoaded) {
                    deferred.reject('ERR_GAPI_INITIALIZING_FAIL');
                    return deferred.promise;
                }

                if(hotlistName === 'AndroidNFeatureAdoption') {
                    hotlistId = CONST.AndroidNFeatureAdoption;
                }
                else if(hotlistName === 'AndroidOFeatureAdoption') {
                    hotlistId = CONST.AndroidOFeatureAdoption;
                } else if(hotlistName === 'AndroidPFeatureAdoption'){
                    hotlistId = CONST.AndroidPFeatureAdoption;
                }
                else {
                    deferred.reject('ERR_WRONG_HOTLIST_NAME');
                    return deferred.promise;
                }

                // Load correct version and make call to find assigned issues.
                gapi.client.load(
                    ISSUE_TRACKER_API_ROOT + DISCOVERY_PATH,
                    ISSUE_TRACKER_API_VERSION,
                    function() {

                        var request = gapi.client.corp_issuetracker.hotlists.entries.list (
                            //{'hotlistId':'466180'},
                            {'hotlistId':hotlistId},
                            {'pageSize' : '500'}
                        );
                        request.execute(handleResponse);
                    });

                return deferred.promise;
            };

            function handleResponse(response) {
                // Something went wrong.
                if (!response) {
                    deferred.reject('ERR_BAD_QUERY_REQUEST');
                    return deferred.promise;
                }

                if(!response['hotlistEntries']) {
                    console.log('ERR_EMPTY_RETURNED_VALUE');
                    deferred.resolve(response);
                }else{
                    console.log('ACK_BUG_LIST_RETURNED');
                    deferred.resolve(response);
                }
                return deferred.promise;
            }

            function updateSigninStatus(isSignedIn) {
              // When signin status changes, this function is called.
              // If the signin status is changed to signedIn, we make an API call.
              if (isSignedIn ) {
                  window.location.reload(true);
                }
            }

        });
})(window.angular);

(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .service('sheetF', function($q, CONST) {

            var deferred;
            var isAPILoaded = false;

            /*
            var ISSUE_TRACKER_API_ROOT = CONST.ISSUE_TRACKER_API_ROOT;
            var ISSUE_TRACKER_QA_API_ROOT = CONST.ISSUE_TRACKER_QA_API_ROOT;
            var DISCOVERY_PATH = CONST.DISCOVERY_PATH;
            var ISSUE_TRACKER_API_VERSION = CONST.ISSUE_TRACKER_API_VERSION;
            */


            var CLIENT_ID = CONST.CLIENT_ID;
            var SCOPES = CONST.SCOPES_SHEET_API;
            var API_KEY = CONST.API_KEY_ISSUE_TRACKER;
            var DISCOVERY_FULL_PATH = CONST.DISCOVERY_PATH_SHEET_API;

            function isAuthorizedUserSignedIn() {
              var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
              var email = profile.getEmail();
              var pos = email.search('@');
              var emailDomain = email.slice(pos+1);

              if(emailDomain === 'google.com')
                return true;
              return false;
            }


            /*
             * Sends an Auth call with immediate mode on, which attempts to refresh
             * the token behind the scenes, without showing any UI to the user.
             */
            this.initSheetAPI = function() {
                deferred = $q.defer();
                gapi.load('client:auth2', init);
                return deferred.promise;
            }

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
            }

            this.getTrixMetaData = function(targetRelease) {
              var trixId;
              var spreadSheetRange;

              deferred = $q.defer();

              // if API is not initialized, return false
              if(!isAPILoaded) {
                deferred.reject('ERR_GAPI_INITIALIZING_FAIL');
                return deferred.promise;
              }

              if(targetRelease === 'P'){
                trixId = CONST.AndroidPFeatureAdoptionSheetId;
                spreadSheetRange = CONST.AndroidPSheetRange;
              } else if (targetRelease === 'O') {
                trixId = CONST.AndroidOFeatureAdoptionSheetId;
                spreadSheetRange = CONST.AndroidOSheetRange;
              } else if (targetRelease === 'N') {
                trixId = CONST.AndroidNFeatureAdoptionSheetId;
                spreadSheetRange = CONST.AndroidNSheetRange;
              } else {
                deferred.reject('ERR_WRONG_HOTLIST_NAME');
                return deferred.promise;
              }

              //
              gapi.client.sheets.spreadsheets.developerMetadata.search(
                  {dataFilters:[{developerMetadataLookup: {visibility: 'DOCUMENT'}}], spreadsheetId : trixId}
              ).then(function(response) {
                var range = response.result.matchedDeveloperMetadata;

                if(typeof range === 'undefined') {
                  deferred.reject('ERR_BAD_QUERY_REQUEST');
                  return deferred.promise;
                }

                if (range.length > 0) {
                  console.log('ACK_METADATA_RETURNED');
                  deferred.resolve(response);
                } else {
                  //appendPre('No data found.');
                  console.log('ERR_EMPTY_RETURNED_VALUE');
                  deferred.resolve(response);
                }
              }, function(response){
                //appendPre('Error: ' + response.result.error.message);
                // Something went wrong.
                deferred.reject('ERR_BAD_QUERY_REQUEST');
                return deferred.promise;
              });

              return deferred.promise;
              //
            }

            this.getTrixBugData = function(targetRelease) {
              var trixId;
              var spreadSheetRange;

              deferred = $q.defer();

              // if API is not initialized, return false
              if(!isAPILoaded) {
                deferred.reject('ERR_GAPI_INITIALIZING_FAIL');
                return deferred.promise;
              }

              if(targetRelease === 'P'){
                trixId = CONST.AndroidPFeatureAdoptionSheetId;
                spreadSheetRange = CONST.AndroidPBugSheetRange;
              } else if (targetRelease === 'O') {
                trixId = CONST.AndroidOFeatureAdoptionSheetId;
                spreadSheetRange = CONST.AndroidOBugSheetRange;
              } else if (targetRelease === 'N') {
                trixId = CONST.AndroidNFeatureAdoptionSheetId;
                spreadSheetRange = CONST.AndroidNBugSheetRange;
              } else {
                deferred.reject('ERR_WRONG_HOTLIST_NAME');
                return deferred.promise;
              }

            //
              gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: trixId,
                range: spreadSheetRange,
              }).then(function(response) {
                var range = response.result;
                if (range.values.length > 0) {
                  console.log('ACK_BUG_LIST_RETURNED');
                  deferred.resolve(response);
                } else {
                  //appendPre('No data found.');
                  console.log('ERR_EMPTY_RETURNED_VALUE');
                  deferred.resolve(response);
                }
              }, function(response) {
                //appendPre('Error: ' + response.result.error.message);
                // Something went wrong.
                deferred.reject('ERR_BAD_QUERY_REQUEST');
                return deferred.promise;
              });

              return deferred.promise;
              //
            };


            this.getTrixEntries = function(targetRelease) {
              var trixId;
              var spreadSheetRange;

              deferred = $q.defer();

              // if API is not initialized, return false
              if(!isAPILoaded) {
                deferred.reject('ERR_GAPI_INITIALIZING_FAIL');
                return deferred.promise;
              }

              if(targetRelease === 'P'){
                trixId = CONST.AndroidPFeatureAdoptionSheetId;
                spreadSheetRange = CONST.AndroidPSheetRange;
              } else if (targetRelease === 'O') {
                trixId = CONST.AndroidOFeatureAdoptionSheetId;
                spreadSheetRange = CONST.AndroidOSheetRange;
              } else if (targetRelease === 'N') {
                trixId = CONST.AndroidNFeatureAdoptionSheetId;
                spreadSheetRange = CONST.AndroidNSheetRange;
              } else {
                deferred.reject('ERR_WRONG_HOTLIST_NAME');
                return deferred.promise;
              }

              //
              gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: trixId,
                range: spreadSheetRange,
              }).then(function(response) {
                var range = response.result;
                if (range.values.length > 0) {
                  console.log('ACK_FEATURE_ADOPTION_LIST_RETURNED');
                  deferred.resolve(response);
                } else {
                  //appendPre('No data found.');
                  console.log('ERR_EMPTY_RETURNED_VALUE');
                  deferred.resolve(response);
                }
              }, function(response) {
                //appendPre('Error: ' + response.result.error.message);
                // Something went wrong.
                deferred.reject('ERR_BAD_QUERY_REQUEST');
                return deferred.promise;
              });

              return deferred.promise;
              //
            };


            function updateSigninStatus(isSignedIn) {
              // When signin status changes, this function is called.
              // If the signin status is changed to signedIn, we make an API call.
              if (isSignedIn ) {
                  window.location.reload(true);
                }
            }

        });
})(window.angular);
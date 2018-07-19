
(function(angular) {
    'use strict';
    // Codes will be hosted in x20/ which does not support http://. The only supporting protocol is https://
    angular.module('ngAndroidNext99')
        .constant('CONST', {
            'AndroidNFeatureAdoption'               : '466180',
            'AndroidOFeatureAdoption'               : '469088',
            'AndroidPFeatureAdoption'               : '932968',
            'AndroidPFeatureAdoptionSheetId'        : '1WyMbHURzdyxCYlmFTeFBQceJ08_F4_gIZx5YBWSRl5I',
            'AndroidOFeatureAdoptionSheetId'        : '1O0vKNFwsFfndn0R4WyLzFSsk0wzid39NmFnoO_E60A0',
            'AndroidNFeatureAdoptionSheetId'        : '1aCZMTR64ANHvHQVwdQTutuyej0fZrMD_DIGnllU5zg0',
            'AndroidPSheetRange'                    : "P release!A1:AA55",
            'AndroidOSheetRange'                    : "O release!A1:AA22",
            'AndroidNSheetRange'                    : "N release!A1:AB10",
            'AndroidPBugSheetRange'                 : "P release-BugId!B1:AA55",
            'AndroidOBugSheetRange'                 : "O release-BugId!B4:AA22",
            'AndroidNBugSheetRange'                 : "N release-BugId!B4:AB10",
            'ISSUE_TRACKER_API_ROOT'                : 'https://issuetracker.corp.googleapis.com',
            'ISSUE_TRACKER_QA_API_ROOT'             : 'https://test-issuetracker.corp.googleapis.com',
            'DISCOVERY_PATH'                        : '/$discovery/rest',
            'DISCOVERY_PATH_FULL_ISSUE_TRACKER'     : 'https://issuetracker.corp.googleapis.com/$discovery/rest',
            'ISSUE_TRACKER_API_VERSION'             : 'v1',
            'CLIENT_ID'                             : '679229101304-vljrfd0euv7k4lusujrfm9e55n6iuvp0.apps.googleusercontent.com',
            'API_KEY_ISSUE_TRACKER'                 : 'AIzaSyDWav-PE7EjDxzAHPUWbjyg3W2-UqxX4UI',
            'SCOPES'                                : 'https://www.googleapis.com/auth/buganizer',
            'CLIENT_ID_PLX'                         : '153836130898-4kdgg79r7r4pul1mf3rcf49kddcv7qkk.apps.googleusercontent.com',
            'CLIENT_SECRET_PLX'                     : 'm25mQY9I3x6CoFcL_HmqAhZm',
            'SCOPES_PLX'                            : 'https://www.googleapis.com/auth/plx',
             // These are for Sheet API
             'DISCOVERY_PATH_SHEET_API'             : 'https://sheets.googleapis.com/$discovery/rest?version=v4',
             'SCOPES_SHEET_API'                     : 'https://www.googleapis.com/auth/spreadsheets.readonly'
        })
})(window.angular);

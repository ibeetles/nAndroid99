
(function(angular) {
    'use strict';
    // Codes will be hosted in x20/ which does not support http://. The only supporting protocol is https://
    angular.module('ngAndroidNext99')
        .constant('CONST', {
            'AndroidNFeatureAdoption'           : '466180',
            'AndroidOFeatureAdoption'           : '469088',
            'AndroidPFeatureAdoption'           : '932968',
            'ISSUE_TRACKER_API_ROOT'            : 'https://issuetracker.corp.googleapis.com',
            'ISSUE_TRACKER_QA_API_ROOT'         : 'https://test-issuetracker.corp.googleapis.com',
            'DISCOVERY_PATH'                    : '/$discovery/rest',
            'DISCOVERY_PATH_FULL_ISSUE_TRACKER' : 'https://issuetracker.corp.googleapis.com/$discovery/rest',
            'ISSUE_TRACKER_API_VERSION'         : 'v1',
            'CLIENT_ID'                         : '679229101304-vljrfd0euv7k4lusujrfm9e55n6iuvp0.apps.googleusercontent.com',
            'API_KEY_ISSUE_TRACKER'             : 'AIzaSyCZsUBkbwcW7dF4nz08eAMUn768stsCv-M',
            'SCOPES'                            : 'https://www.googleapis.com/auth/buganizer',
            'CLIENT_ID_PLX'                     : '153836130898-4kdgg79r7r4pul1mf3rcf49kddcv7qkk.apps.googleusercontent.com',
            'CLIENT_SECRET_PLX'                 : 'm25mQY9I3x6CoFcL_HmqAhZm',
            'SCOPES_PLX'                        : 'https://www.googleapis.com/auth/plx'
        })
})(window.angular);

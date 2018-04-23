
(function(angular) {
    'use strict';
    // Codes will be hosted in x20/ which does not support http://. The only supporting protocol is https://
    angular.module('ngAndroidNext99')
        .constant('CONST', {
            'AndroidNFeatureAdoption'   : '466180',
            'AndroidOFeatureAdoption'   : '469088',
            'AndroidPFeatureAdoption'   : '932968',
            'ISSUE_TRACKER_API_ROOT'    : 'https://issuetracker.corp.googleapis.com',
            'ISSUE_TRACKER_QA_API_ROOT' : 'https://test-issuetracker.corp.googleapis.com',
            'DISCOVERY_PATH'            : '/$discovery/rest',
            'ISSUE_TRACKER_API_VERSION' : 'v1',
            'CLIENT_ID'                 : '679229101304-vljrfd0euv7k4lusujrfm9e55n6iuvp0.apps.googleusercontent.com',
            'SCOPES'                    : 'https://www.googleapis.com/auth/buganizer'
        })
})(window.angular);

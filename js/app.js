
(function(angular) {
  'use strict';

  angular.module('ngAndroidNext99', ['smart-table'])
      .filter('featureName', function() {
        return function (items, letter) {
          var filtered = [];
          var letterMatch = new RegExp(letter, 'i');
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            //if (letterMatch.test(item.name.substring(0, 1))) {
            if (letterMatch.test(item.name)) {
              filtered.push(item);
            }
          }
          return filtered;
        }
      }).filter('featureGroup', function(){
    return function (items, letter) {
      var filtered = [];
      var letterMatch = new RegExp(letter, 'i');
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        //if (letterMatch.test(item.group.substring(0, 1))) {
        if (letterMatch.test(item.group)) {
          filtered.push(item);
        }
      }
      return filtered;
    }
  });
})(window.angular);

(function(angular) {
    'use strict';

    angular.module('ngAndroidNext99')
        .service('dremelF', function($q) {

        var deferred;

        var sqlAndroidFAdoption = function(version) {
            // We will indentify Android version by Hotlist (N:AndroidNFeatureAdoption, O:AndroidOFeatureAdoption)
            var hotlist_ids = '';
            if(version === 'NFeature')
                hotlist_ids = '466180'; // AndroidNFeatureAdoption   --> N feature survey hotlist name
            else if(version === 'OFeature')
                hotlist_ids = '469088'; // AndroidOFeatureAdoption   --> O feature survey hotlist name
            else
                hotlist_ids = '932968'; // AndroidPFeatureAdoption   --> P feature survey hotlist name

            return  "SET sql_dialect GoogleSQL; " +
                    "SELECT  a.bug_id as bug_id, " +
                            "a.priority_id as priority, " +
                            "a.type_id as type, " +
                            "a.summary as title, " +
                            "a.component_path as component_path, " +
                            "a.status_id as status, " +
                            "(SELECT li.value FROM a.Custom_fields AS li WHERE li.field_name LIKE '%Region%') AS region, " +
                            "(SELECT li.value FROM a.Custom_fields AS li WHERE li.field_name LIKE '%Feature Name%') AS feature_name," +
                            "(SELECT li.value FROM a.Custom_fields AS li WHERE li.field_name LIKE '%OEM name%') AS oem_name," +
                            "(SELECT li.value FROM a.Custom_fields AS li WHERE li.field_name LIKE '%Supporting Status%') AS support_status," +
                            "(SELECT li.value FROM a.Custom_fields AS li WHERE li.field_name LIKE '%Product Marketing Name%') AS product_marketing_name, " +
                            "(SELECT li.value FROM a.Custom_fields AS li WHERE li.field_name LIKE '%Launch Version%') AS launch_version " +
                "FROM buganizer.metadata.latest AS a " +
                "WHERE '" + hotlist_ids + "' IN UNNEST(a.hotlist_ids)" +
                "ORDER BY a.component_path, feature_name, oem_name, product_marketing_name;"
        };

        function onDataError(e) {
            if (e.getStatusText) {
                console.log(e.getStatusText());
            } else {
                console.log(e);
            }
            deferred.reject(e);
        }

        this.executeSQL = function(version) {
            // checked if aplos object is intialized which means user has access to corpnet
            deferred = $q.defer();

            var sql = sqlAndroidFAdoption(version);

            try {
                var dataLoader = aplos.data.loader
                    .Builder
                    .fromSql(sql)
                    .build();

                var dataSet = new aplos.data.DataSet()
                    .dataLoader(dataLoader);
            }catch(err) {
                console.log('catch statement');
                deferred.reject(err);
                return deferred.promise;
            }

            dataSet.fetch(new aplos.data.Projection()).then(function(d) {
                deferred.resolve(d[0].data);
            }, onDataError);

            return deferred.promise;
        };
    });

})(window.angular);
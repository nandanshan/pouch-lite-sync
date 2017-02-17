(function() {
  angular.module('offline')
    .factory("service",['$q','$http',service])

    function service($q,$http){
      var ob = {};

      ob.makeRequest = function(method, url, params, data) {
            console.log("coming");
            var deferred = $q.defer();
            var settings = {
                method: method,
                url: url,
            };
            if(params) {
                settings.params = params;
            }
            if(data) {
                settings.data = data;
            }
            $http(settings)
                .success(function(result) {
                    deferred.resolve(result);
                })
                .error(function(error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

      return ob;
    }

  

})();

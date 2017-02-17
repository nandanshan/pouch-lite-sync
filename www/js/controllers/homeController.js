(function() {
  angular.module('offline')
    .controller("homeController", ["$scope","$rootScope","$q","$http","$ionicPlatform","$couchbase","$ionicPopup", homeController])

  function homeController($scope,$rootScope,$q,$http, $ionicPlatform,$couchbase,$ionicPopup) {
           var scope = $scope;

           scope.replicate = function(remote){
            if(remote){
            console.log(remote);
            client.server.post_replicate({db: 'sk', body:{source:"http://"+remote+"/sk",target:"sk",continuous: true}})
                .then(function(res){
                  console.log("Replicate request sent",res);
                },function(err){
                  console.log(err);
                });
              }
           };

           scope.add = function(arg){
            if(arg){
            console.log(arg)
            client.document.post({db: 'sk', body:{"type":"category",displayName:arg}})
            .then(function(res){
              console.log("document added",res);
            },function(err){console.log(err)});
          }
        };
             
  }
      

})();

(function() {
  angular.module('offline')
    .controller("todosController", ["$scope","$http","$couchbase","service", todosController])

  function todosController($scope,$http,$couchbase,service) {
    var scope = $scope;
    scope.categories = [];

    
    function getCategories(_key){
       client.query.get_db_design_ddoc_view_view({db: 'sk', ddoc: 'category',view:'type',key:'"'+_key+'"',include_docs:true})
          .then(function(res){
            console.log("categories",res);
            $scope.$apply(function(){
              scope.categories = res.obj.rows;
            });
            
          },function(err){console.log(err);})
      }

       getCategories("category");

     

  }

})();

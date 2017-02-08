(function() {
  angular.module('offline')
    .controller("todosController", ["$scope","$rootScope","$q","$http","$ionicPlatform","$couchbase","$ionicPopup", todosController])

  function todosController($scope,$rootScope,$q,$http, $ionicPlatform,$couchbase,$ionicPopup) {
    var scope = $scope;
    console.log(todoDatabase);
      scope.lists = {};
      scope.url = null;

      todoDatabase.getAllDocuments().then(function(result) {
        console.log("All Docs",result);
          for(var i = 0; i < result.rows.length; i++) {
            todoDatabase.getDocument(result.rows[i].id).then(function(result) {
                    scope.lists[result._id] = result;
            });
          }
      }, function(error) {
          console.log("ERROR QUERYING VIEW -> " + JSON.stringify(error));
      });


    scope.insert = function() {
        $ionicPopup.prompt({
            title: 'Enter a new TODO list',
            inputType: 'text'
        })
        .then(function(result) {
            if(result != "") {
                var obj = {
                    task: result
                };
                todoDatabase.createDocument(obj).then(function(result) {
                    console.log("Document created!",result);
                }, function(error) {
                    console.log("ERROR: " + JSON.stringify(error));
                });
            }
        });
    };

    scope.delete = function(list) {
      var listId = list._id;
      todoDatabase.deleteDocument(list._id, list._rev).then(function(result) {
        console.log(result);
      }, function(error) {
          console.log("ERROR -> " + JSON.stringify(error));
      });
  };

    scope.replicate = function(ip){
      console.log(ip);
      // todoDatabase.replicate("todo", "http://"+ip+":5984/todo", false)
      //   .then(function(result) {
      //     todoDatabase.replicate("http://"+ip+":5984/todo", "todo", false)
      //       .then(function(result) {
      //         console.log(result);
      //         }, function(error) {
      //             console.error("ERROR -> " + JSON.stringify(error));
      //         });
      // }, function(error) {
      //     console.error("ERROR -> " + JSON.stringify(error));
      // });

      $http.post("http://localhost:4984/_replicate",{
                source: 'http://'+ip+':4984/todos/',
                target: 'todos',
                continuous: false
        })
          .then(function(result) {
            console.log(result);
          })
          .catch(function(error) {
            console.log(error);
          });
    };

    $rootScope.$on("couchbase:change", function(event, args) {
      console.log(args);
      for(var i = 0; i < args.results.length; i++) {
          if(args.results[i].hasOwnProperty("deleted") && args.results[i].deleted === true) {
              delete $scope.lists[args.results[i].id];
          } else {
                  todoDatabase.getDocument(args.results[i].id).then(function(result) {
                          $scope.lists[result._id] = result;
                  });
          }
      }
      console.log("lists",$scope.lists);
  });


  }

})();

(function() {
  angular.module('offline')
    .controller("todosController", ["$scope","$rootScope","$q","$http","$ionicPlatform","$couchbase","$ionicPopup", todosController])

  function todosController($scope,$rootScope,$q,$http, $ionicPlatform,$couchbase,$ionicPopup) {
    var scope = $scope;
    var todoDatabase = null;
      scope.lists = {};
      scope.url = null;

    $ionicPlatform.ready(function() {
      if (window.cblite) {
        window.cblite.getURL(function(err, url) {
          if (err) {
            console.log("error launching Couchbase Lite: " + err)
          } else {
            console.log("Couchbase Lite running at " + url);
            scope.url = url;
            console.log(scope.url);
            todoDatabase = new $couchbase(url, "todo");
            todoDatabase.createDatabase().then(function(result) {
                var todoViews = {
                    lists: {
                        map: function(doc) {
                            if(doc.type == "list" && doc.title) {
                                emit(doc._id, {title: doc.title, rev: doc._rev})
                            }
                        }.toString()
                    },
                    tasks: {
                        map: function(doc) {
                            if(doc.type == "task" && doc.title && doc.list_id) {
                                emit(doc.list_id, {title: doc.title, list_id: doc.list_id, rev: doc._rev})
                            }
                        }.toString()
                    }
                };
                todoDatabase.createDesignDocument("_design/todo", todoViews);
                todoDatabase.listen();
            }, function(error) {
                console.error(JSON.stringify(error));
            });

          }
        });
      } else {
        console.log("error, Couchbase Lite plugin not found.")
      }

    });

    scope.insert = function() {
        $ionicPopup.prompt({
            title: 'Enter a new TODO list',
            inputType: 'text'
        })
        .then(function(result) {
            if(result != "") {
                var obj = {
                    title: result,
                    type: "list",
                    owner: "guest"
                };
                todoDatabase.createDocument(obj).then(function(result) {
                    console.log("Document created!",result);
                }, function(error) {
                    console.log("ERROR: " + JSON.stringify(error));
                });
            }
        });
    };

    scope.replicate = function(){
      // todoDatabase.replicate("todo", "http://192.168.43.249:4984/todo", true).then(function(result) {
      //   console.log(result);
      //     todoDatabase.replicate("http://192.168.43.249:4984/todo", "todo", true).then(function(result) {
      //       console.log(result);
      //     }, function(error) {
      //         console.error("ERROR -> " + JSON.stringify(error));
      //     });
      // }, function(error) {
      //     console.error("ERROR -> " + JSON.stringify(error));
      // });
      var deferred = $q.defer();

      $http.post("http://localhost:5984/_replicate",{
                source: 'todo',
                target: 'http://192.168.43.249:5984/todo',
                continuous: true
        })
          .then(function(result) {
            console.log(result);
              deferred.resolve(result);
          })
          .catch(function(error) {
              deferred.reject(error);
          });
      return deferred.promise;
    };

    $rootScope.$on("couchbase:change", function(event, args) {
      console.log(args);
      for(var i = 0; i < args.results.length; i++) {
          if(args.results[i].hasOwnProperty("deleted") && args.results[i].deleted === true) {
              delete $scope.lists[args.results[i].id];
          } else {
              if(args.results[i].id.indexOf("_design") === -1) {
                  todoDatabase.getDocument(args.results[i].id).then(function(result) {
                    console.log(result);
                      if(result.type === "list") {
                          $scope.lists[result._id] = result;
                      }
                  });
              }
          }
      }
  });


  }

})();

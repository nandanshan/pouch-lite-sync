(function() {
  angular.module('offline')
    .controller("homeController", ["$scope","$rootScope","$q","$http","$ionicPlatform","$couchbase","$ionicPopup", homeController])

  function homeController($scope,$rootScope,$q,$http, $ionicPlatform,$couchbase,$ionicPopup) {
           var scope = $scope;

           scope.replicate = function(remote){
            if(remote){
            console.log(remote);
            client.server.post_replicate({db: 'sk', body:{target:"sk",source:"http://"+remote+"/sk",continuous: true}})
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
             
    

    
  //   var scope = $scope;
  //   var todoDatabase = null;
  //     scope.lists = {};
  //     scope.url = null;

  //   $ionicPlatform.ready(function() {
  //     if (window.cblite) {
  //       window.cblite.getURL(function(err, url) {
  //         if (err) {
  //           console.log("error launching Couchbase Lite: " + err)
  //         } else {
  //           console.log("Couchbase Lite running at " + url);
  //           scope.url = url;
  //           // console.log(scope.url);
  //           createDB(url);
  //         }
  //       });
  //     } else {
  //       console.log("error, Couchbase Lite plugin not found.")
  //     }

  //   });

  //   function createDB(url) {
  //     todoDatabase = new $couchbase(url, "todo");
  //     todoDatabase.createDatabase().then(function(result) {
  //         var todoViews = {
  //             lists: {
  //                 map: function(doc) {
  //                     if(doc.type == "list" && doc.title) {
  //                         emit(doc._id, {title: doc.title, rev: doc._rev})
  //                     }
  //                 }.toString()
  //             },
  //             tasks: {
  //                 map: function(doc) {
  //                     if(doc.type == "task" && doc.title && doc.list_id) {
  //                         emit(doc.list_id, {title: doc.title, list_id: doc.list_id, rev: doc._rev})
  //                     }
  //                 }.toString()
  //             }
  //         };
  //         todoDatabase.createDesignDocument("_design/todo", todoViews);
  //         todoDatabase.listen();
  //     }, function(error) {
  //         console.error(JSON.stringify(error));
  //         // fetch(url + "todo", {
  //         //     method: 'delete'
  //         // }).then(function(res) {
  //         //     return res.json();
  //         // }).then(function(res) {
  //         //     createDB(url);
  //         // });
  //     });
  //   }

  //   scope.insert = function() {
  //       $ionicPopup.prompt({
  //           title: 'Enter a new TODO list',
  //           inputType: 'text'
  //       })
  //       .then(function(result) {
  //           if(result != "") {
  //               var obj = {
  //                   title: result,
  //                   type: "list",
  //                   owner: "guest"
  //               };
  //               todoDatabase.createDocument(obj).then(function(result) {
  //                   console.log("Document created!",result);
  //               }, function(error) {
  //                   console.log("ERROR: " + JSON.stringify(error));
  //               });
  //           }
  //       });
  //   };

  //   scope.replicate = function(ip){
  //     console.log(ip);
  //     // todoDatabase.replicate("todo", "http://"+ip+":5984/todo", false)
  //     //   .then(function(result) {
  //     //     todoDatabase.replicate("http://"+ip+":5984/todo", "todo", false)
  //     //       .then(function(result) {
  //     //         console.log(result);
  //     //         }, function(error) {
  //     //             console.error("ERROR -> " + JSON.stringify(error));
  //     //         });
  //     // }, function(error) {
  //     //     console.error("ERROR -> " + JSON.stringify(error));
  //     // });

  //     $http.post("http://localhost:5984/_replicate",{
  //               source: 'http://'+ip+':5984/todo/',
  //               target: 'todo',
  //               continuous: false
  //       })
  //         .then(function(result) {
  //           console.log(result);
  //         })
  //         .catch(function(error) {
  //           console.log(error);
  //         });
  //   };

  //   $rootScope.$on("couchbase:change", function(event, args) {
  //     console.log(args);
  //     for(var i = 0; i < args.results.length; i++) {
  //         if(args.results[i].hasOwnProperty("deleted") && args.results[i].deleted === true) {
  //             delete $scope.lists[args.results[i].id];
  //         } else {
  //             if(args.results[i].id.indexOf("_design") === -1) {
  //                 todoDatabase.getDocument(args.results[i].id).then(function(result) {
  //                   console.log(result);
  //                     if(result.type === "list") {
  //                         $scope.lists[result._id] = result;
  //                     }
  //                 });
  //             }
  //         }
  //     }
  // });


  }
      

})();

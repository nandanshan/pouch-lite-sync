(function() {
  angular.module('offline')
    .controller("todosController", ["$scope", "$ionicPlatform", todosController])

  function todosController($scope, $ionicPlatform) {
    $ionicPlatform.ready(function() {
var a = null;
      if (window.cblite) {
        window.cblite.getURL(function(err, url) {
          if (err) {
            console.log("error launching Couchbase Lite: " + err)
          } else {
            console.log("Couchbase Lite running at " + url);

            var client = new SwaggerClient({
                spec: window.spec,
                usePromise: true,
              })
              .then(function(client) {
                client.setHost(url.split('/')[2]);
                client.server.get_all_dbs()
                  .then(function(res) {
                    var dbs = res.obj;
                    if (dbs.indexOf('todo') == -1) {
                      return client.database.put_db({
                        db: 'todo'
                      });
                    }
                    return client.database.get_db({
                      db: 'todo'
                    });
                  })
                  .then(function(res) {
                    return client.document.post({
                      db: 'todo',
                      body: {
                        task: 'Groceries'
                      }
                    });
                  })
                  .then(function(res) {
                    return client.query.get_db_all_docs({
                      db: 'todo'
                    });
                  })
                  .then(function(res) {
                    console.log(res.obj.rows.length + ' document(s) in the database');
                  })
                  .catch(function(err) {
                    console.log(err)
                  });
              });



          }
        });
      } else {
        console.log("error, Couchbase Lite plugin not found.")
      }



      // if(!window.cblite) {
      //     alert("Couchbase Lite is not installed!");
      // } else {
      //     cblite.getURL(function(err, url) {
      //         if(err) {
      //             alert("There was an error getting the database URL");
      //             return;
      //         }
      //         todoDatabase = new $couchbase(url, "todo");
      //         todoDatabase.createDatabase().then(function(result) {
      //             var todoViews = {
      //                 lists: {
      //                     map: function(doc) {
      //                         if(doc.type == "list" && doc.title) {
      //                             emit(doc._id, {title: doc.title, rev: doc._rev})
      //                         }
      //                     }.toString()
      //                 },
      //                 tasks: {
      //                     map: function(doc) {
      //                         if(doc.type == "task" && doc.title && doc.list_id) {
      //                             emit(doc.list_id, {title: doc.title, list_id: doc.list_id, rev: doc._rev})
      //                         }
      //                     }.toString()
      //                 }
      //             };
      //             todoDatabase.createDesignDocument("_design/todo", todoViews);
      //             todoDatabase.listen();
      //         }, function(error) {
      //             console.error(JSON.stringify(error));
      //         });
      //      });
      //  }

    });
  }

})();

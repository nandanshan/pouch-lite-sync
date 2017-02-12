// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var client = null;
angular.module('offline', ['ionic','ngCouchbaseLite'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    if (window.cblite) {
          window.cblite.getURL(function (err, url) {             
            if (err) {
              console.log("error launching Couchbase Lite: " + err)
            } else {
              console.log("Couchbase Lite running at " + url);

              new SwaggerClient({
                spec: window.spec,
                usePromise: true
              })
              .then(function (res) {
                  res.setHost("localhost:5984");
                  client = res;
                   client.server.get_all_dbs()
                    .then(function (res) {
                      var dbs = res.obj;
                      if (dbs.indexOf('sk') == -1) {
                        client.database.put_db({db: 'sk'})
                          .then(function(res){
                            console.log("SK Created");
                            var views = {
                            "views":{
                                "type": {
                                  map: function(doc) {
                                    if(doc.type) {
                                      emit(doc.type, null)
                                    }
                                  }.toString()
                                }
                            }
                          };

                          client.query.put_db_design_ddoc({db: 'sk',ddoc:'category',body:views})
                            .then(function(res){
                              console.log("Design doc created",res) ;
                              // replicate();
                              getChanges(0);
                            },function(err){console.log(err);})

                          },function(err){console.log(err);}) 
                      }else{
                       console.log("sk exists");
                       // replicate();
                       getChanges(0);
                      }

                      function replicate(){
                         client.server.post_replicate({db: 'sk', body:{source:"http://192.168.121.88:4984/sk",target:"sk",continuous: true}})
                        .then(function(res){
                          console.log("Replicate request sent",res);
                        },function(err){
                          console.log(err);
                        });
                      }

                      
                      function getChanges(seq) {
                        client.query.get_db_changes({db: 'sk', include_docs: true, since: seq, feed: 'longpoll'})
                        .then(function (res) {
                          console.log("changes",res);
                          getChanges(res.obj.last_seq);
                        })
                        .catch(function (err) {
                          console.log(err);
                        });
                      }

                      

                     

                    },function(err){console.log(err);})
              });

            }
          });
        } else {
          console.log("error, Couchbase Lite plugin not found.")
        }

    
    

  });
})

angular.module('offline')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("home", {
        url: "/home",
        templateUrl: "templates/home.html",
        controller: "homeController"
      })
      .state("todos", {
        // parent:"main",
        url: "/todos",
        templateUrl: "templates/todos.html",
        controller: "todosController"
      })
      .state("category", {
        // parent:"main",
        url: "/category",
        templateUrl: "templates/category.html",
        controller: "categoryController",
        params:{
          id:null
        }
      });
    // .state("todoLists", {
    //     url: "/todoLists",
    //     templateUrl: "templates/todolists.html",
    //     controller: "TodoListsController"
    // })
    // .state("tasks", {
    //     url: "/tasks/:listId",
    //     templateUrl: "templates/tasks.html",
    //     controller: "TaskController"
    // });
    $urlRouterProvider.otherwise("/home");
  });

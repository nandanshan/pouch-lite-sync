angular.module('offline')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("main", {
        url: "/main",
        templateUrl: "templates/main.html"
        // controller: "todosController"
      })
      .state("todos", {
        // parent:"main",
        url: "/todos",
        templateUrl: "templates/todos.html",
        controller: "todosController"
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
    $urlRouterProvider.otherwise("/main");
  });

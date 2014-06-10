var app = angular.module('dasborApp', ['ngRoute']).run(function($rootScope, $http) {
    update($rootScope, $http);
});

var update = function($rootScope, $http) {
    $http.get('/api/aplikasi').success(function(data) {
        $rootScope.applicationList = data;
    });

    $rootScope.applicationType = [{id: "node", name:"Node.js Instance (Executable app.js)"}];
}
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'app_static/home.html'})
                  .when('/createApp', {templateUrl: 'app_static/createApp.html'})
                  .when('/doCreateApp', {templateUrl: 'app_static/doCreate.html'})
                  .when('/monitor/:appName', {templateUrl: 'app_static/monitor.html'})
}]);

app.controller('dasborController', function($rootScope, $scope, $http) {
});

app.controller('createAppController', function($rootScope, $scope, $http, $location) {
    $scope.state = "form";
    $scope.newApp = {}
    $scope.newApp.applicationType = "node";
    $scope.createApp = function() {
        $scope.state = "create";
        $http.post('/api/aplikasi', $scope.newApp).success(function(result) {
            $scope.createdApp = result;
            console.log(result);
            update($rootScope, $http);
        });
    }
});

app.controller('monitorController', function($rootScope, $scope, $http,$location) {
});

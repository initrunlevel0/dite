var app = angular.module('dasborApp', ['ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'app_static/home.html'})
}]);

app.controller('dasborController', function($scope, $http) {
    $http.get('/api/aplikasi').success(function(daftarAplikasi) {
        $scope.daftarAplikasi = daftarAplikasi;
    });
});

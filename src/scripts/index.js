import '../styles/style.css';
import "angular";
import "angular-ui-router";
import NotesService from './notesServices'
import myCtrl from '../controllers/myCtrls';
import 'ng-idle';
var app = angular.module("angularPOC", ['ui.router', 'ngIdle']);

app.factory("NotesService", ["$http", NotesService]);
app.controller("myCtrl", ['$scope', 'NotesService', myCtrl]);
app.config(['$stateProvider', '$locationProvider',
    function ($stateProvider, $locationProvider) {

  $stateProvider
    .state({
      name: 'about',
      url: '/',
      template: require('../views/partials/home.html')
    })

  $locationProvider.html5Mode(true);
}]);
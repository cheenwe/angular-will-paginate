/**
 * angular-will-paginate
 * @version v0.1.1 - 2013-12-21
 * @link https://github.com/heavysixer/angular-will-paginate
 * @author Mark Daggett <info@humansized.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (window, document, undefined) {
  'use strict';
  angular.module('willPaginate', []);
  angular.module('willPaginate').run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('template/will_paginate/paginator.html',
        '<ul class="{{options.paginationClass}}">'+
        '  <li class="first" ng-class="{true:\'disabled\'}[params.currentPage == 1]"><a ng-hide="params.currentPage == 1" ng-click="getPage(1)"> « </a> <span ng-show="params.currentPage == 1"> « </span></li>' + '  <li class="prev" ng-class="{true:\'disabled\'}[params.currentPage == 1]">'+ ' <a ng-hide="params.currentPage == 1" ng-click="getPage(params.currentPage - 1)">{{options.previousLabel}}</a>' + '<span ng-show="params.currentPage == 1">{{options.previousLabel}}</span></li>' + '  <li ng-class="{active:params.currentPage == page.value, disabled:page.kind == \'gap\' }" ng-repeat-start="page in collection">' + '    <span ng-show="params.currentPage == page.value || page.kind == \'gap\'">{{page.value}}</span>' + '    <a ng-hide="params.currentPage == page.value || page.kind == \'gap\'" ng-click="getPage(page.value)">{{page.value}}</a>' + '  </li>' + '  <li ng-repeat-end></li>' + '  <li class="next" ng-class="{true:\'disabled\'}[params.currentPage == params.totalPages]">' + '    <a ng-hide="params.currentPage == params.totalPages" ng-click="getPage(params.currentPage + 1)">{{options.nextLabel}}</a>' + '    <span ng-show="params.currentPage == params.totalPages">{{options.nextLabel}}</span>' + '  </li>' + '  <li class="last" ng-class="{true:\'disabled\'}[params.currentPage == params.totalPages]">' + '    <a ng-hide="params.currentPage == params.totalPages" ng-click="getPage(params.totalPages)"> » </a>' + '    <span ng-show="params.currentPage == params.totalPages"> » </span>' + '  </li>' +
        '  <span> &nbsp; {{options.total}} <a> {{params.totalEntries}} </a>  {{options.record}} </span>,' +
        '  <li class="page_more_info"> {{options.perPage}}  <select select-ui ng-model="params.perPage" ng-change="setPerPage(params.perPage)"><option value="15" selected="selected">15</option><option value="30">30</option><option value="50">50</option><option value="100">100</option></select> </li> {{options.record}}' +
        '  <li class="page_more_input_page" ><input ng-model="params.currentPage" style="background: transparent; width: 28px; padding: 9px 3px; padding-bottom: 0px; margin: 3px 0px 0px 3px; border: none; border-bottom: 1px solid #c1c5cf;"> {{options.page}} </input></li>' +
        '  <a style="cursor:pointer" ng-hide="params.currentPage == params.totalPages" ng-click="getPage(params.currentPage)">{{options.jump}}</a>' +
        '</ul>'  );
    }
  ]).directive('willPaginate', function () {
    return {
      restrict: 'ACE',
      templateUrl: 'template/will_paginate/paginator.html',
      scope: {
        params: '=',
        config: '=',
        onClick: '='
      },
      controller: [
        '$scope',
        function ($scope) {
          $scope.getPage = function (num) {
            if (num < 1) {
              console.log("page is more then the max")
              return
            }
            if ($scope.onClick) {
              $scope.onClick(num);
            }
          };
          $scope.setPerPage = function (num) {
            var per_page_params = "&per_page=" + num
            if (window.location.search.indexOf("per_page=") === -1) {
              window.location.search = window.location.search + per_page_params
            } else {
              var reg = /per_page=\d+/gi
              window.location.search = window.location.search.replace(reg, per_page_params)
            }
          };
        }
      ],
      link: function ($scope) {
        $scope.collection = [];
        $scope.defaults = {
          paginationClass: 'pagination',
          previousLabel: 'Previous',
          nextLabel: 'Next',
          total: 'Total',
          record: 'Record',
          perPage: 'Per Page',
          jump: 'Jump',
          page: 'Page',
          innerWindow: 1,
          outerWindow: 1,
          linkSeperator: ' ',
          paramName: 'page',
          params: {},
          pageLinks: true,
          container: true
        };
        $scope.windowedPageNumbers = function () {
          var left = [];
          var middle = [];
          var right = [];
          var x;
          var windowFrom = $scope.params.currentPage - $scope.options.innerWindow;
          var windowTo = $scope.params.currentPage + $scope.options.innerWindow;
          if (windowTo > $scope.params.totalPages) {
            windowFrom -= windowTo - $scope.params.totalPages;
            windowTo = $scope.params.totalPages;
          }
          if (windowFrom < 1) {
            windowTo += 1 - windowFrom;
            windowFrom = 1;
            if (windowTo > $scope.params.totalPages) {
              windowTo = $scope.params.totalPages;
            }
          }
          for (x = windowFrom; x < windowTo + 1; x++) {
            middle.push({ value: x });
          }
          if ($scope.options.outerWindow + 3 < middle[0].value) {
            for (x = 1; x < $scope.options.outerWindow + 1; x++) {
              left.push({ value: x });
            }
            left.push({
              value: '\u2026',
              kind: 'gap'
            });
          } else {
            for (x = 1; x < middle[0].value; x++) {
              left.push({ value: x });
            }
          }
          if ($scope.params.totalPages - $scope.options.outerWindow - 2 > middle[middle.length - 1].value) {
            right.push({
              value: '\u2026',
              kind: 'gap'
            });
            for (x = $scope.params.totalPages - $scope.options.outerWindow; x <= $scope.params.totalPages; x++) {
              right.push({ value: x });
            }
          } else {
            for (x = middle[middle.length - 1].value + 1; x <= $scope.params.totalPages; x++) {
              right.push({ value: x });
            }
          }
          return left.concat(middle.concat(right));
        };
        $scope.render = function () {
          $scope.collection = $scope.windowedPageNumbers();
        };
        $scope.$watch('config', function (newVal) {
          if (typeof newVal === 'undefined') {
            return;
          }
          $scope.options = angular.extend(angular.copy($scope.defaults, {}), angular.copy(newVal, {}));
          if ($scope.params.currentPage) {
            $scope.render();
          }
        });
        $scope.$watch('params', function (newVal) {
          if (typeof newVal === 'undefined') {
            return;
          }
          $scope.render();
        });
        $scope.$watch('params.currentPage', function (newVal) {
          if (typeof newVal === 'undefined') {
            return;
          }
          $scope.render();
        });
      }
    };
  });
}(window, document));

angular-will-paginate
---

This is a work in progress directive, mostly a functional sketch for now. This
is how i console myself that there are no tests yet. Anyway, the purpose of this
directive is to get willPaginate, Bootstrap and AngularJS to play nicely together.

This directive expects you to pass in a JSON representation of a will_paginate
collection and a callback method which will be triggered when someone clicks on
a link. You can also specify an optional config object that overrides some of the
default behavior.

*Simple Example*

![demo](https://user-images.githubusercontent.com/5643208/36955314-ad1f2d9e-2062-11e8-918b-7dfdadc11483.png)

*Note*: Be sure to inject the willPaginate module in your application definition.
Once included the directive will be available.

.. code-block:: javascript

  angular.module('angularApp', ['willPaginate'])
  .controller('MyCtrl', ['$scope', function($scope) {

      /*
        This is a sample collection but would typically be returned from a resource.
        NOTE: I am using camelcase instead of underscores for all the will_paginate
        variables (e.g. currentPage instead of current_page ).
      */
      $scope.willPaginateCollection = {
        currentPage : 1,
        perPage : 10,
        totalEntries : 50,
        totalPages : 5,
        offset : 0
      };

      /*
        Adding a config object lets you override some of the defaults used
        within the directive. This is totally optional.
      */
      $scope.willPaginateConfig = {
        previousLabel: 'Past',
        nextLabel: 'Future',
        nextLabel: 'Next',
        total: 'Total',
        record: 'Record',
        perPage: 'Per Page',
        jump: 'Jump',
        page: 'Page',
      };

      /*
        You must specify a callback function to handle click events from the
        paginator.
      */
      $scope.getPage = function(page){
        console.log(page);
      };
  ]);

Your HTML would look something like this:

.. code-block:: html

  <div class="willPaginate"
       data-params="willPaginateCollection"
       data-on-click="getPage"
       data-config="willPaginateConfig"></div>

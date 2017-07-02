//
// Таймер 3.0
// Контроллер "Хранилище"
//

angular.module("TimerwoodApp.controllers")
	.controller("ExportCtrl", ["$scope", "Storage", "$rootScope", function($scope, Storage, $rootScope) {
		// Записи Хранилища (показываем)
		$scope.entries = exportEntries(Storage.entries);

    $rootScope.$on('storage-batch-add', function (event, entries) {
      $scope.entries = exportEntries(entries);
    });

    function exportEntries (entries) {
      return JSON.stringify({
        entries: entries
      }, null, ' ');
    }
	}]);

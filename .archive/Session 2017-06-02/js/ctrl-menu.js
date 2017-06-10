//
// Таймер 3.0
// Контроллер "Меню"
//

angular.module("TimerwoodApp.controllers")
	.controller("MenuCtrl", ["$scope", "$rootScope", "PetrovStorage", "Storage", "$http", function($scope, $rootScope, PetrovStorage, Storage, $http) {
		$scope.recent = [
			{value: 1},
			{value: 2},
			{value: 3},
			{value: 4},
			{value: 5}
		];
		$scope.currencies = [
			{value: 0, title: "rur", name: "Рубль"},
			{value: 1, title: "usd", name: "Доллар"}
		];
		var settings = angular.fromJson(localStorage.getItem("Timerwood-Settings"));
		if(!settings) {
			$scope.settings = {
				dateRecent: $scope.recent[1],
				taskRecent: $scope.recent[1],
				monthRecent: $scope.recent[1],
				currency: $scope.currencies[0]
			}
		} else {
			$scope.settings = {
				dateRecent: $scope.recent[settings.dateRecent.value-1],
				taskRecent: $scope.recent[settings.taskRecent.value-1],
				monthRecent: $scope.recent[settings.monthRecent ? settings.monthRecent.value-1 : 1],
				currency: $scope.currencies[settings.currency ? settings.currency.value : 0]
			}
		}
		$scope.$watch("settings.dateRecent", function(newval, oldval) {
			$rootScope.dateRecent = newval.value;
			saveSettings();
		});
		$scope.$watch("settings.taskRecent", function(newval, oldval) {
			$rootScope.taskRecent = newval.value;
			saveSettings();
		});
		$scope.$watch("settings.monthRecent", function(newval, oldval) {
			$rootScope.monthRecent = newval.value;
			saveSettings();
		});
		$scope.$watch("settings.currency", function(newval, oldval) {
			$rootScope.currency = newval;
			// console.log($rootScope.price)
			// if (oldval.title == "rur" && newval.title == "usd") {
			// 	$rootScope.price.hour = $rootScope.price.hour / $rootScope.rate;
			// 	localStorage.setItem("Timerwood-price-hour", $rootScope.price.hour);
			// } else if (oldval.title == "usd" && newval.title == "rur") {
			// 	$rootScope.price.hour = $rootScope.price.hour * $rootScope.rate;
			// 	localStorage.setItem("Timerwood-price-hour", $rootScope.price.hour);
			// }
			saveSettings();

		});

		// $rootScope.rate = localStorage.getItem("Timerwood-Currency-Rate") ? parseInt(localStorage.getItem("Timerwood-Currency-Rate")) : 65;

		// $http.get("http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB,EURRUB%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys").then(function(result) {
		// 	$rootScope.rate = parseInt(result.data.query.results.rate[0].Rate);
		// 	localStorage.setItem("Timerwood-Currency-Rate", $rootScope.rate);
		// 	console.log($rootScope.rate, result.data.query.results.rate[0].Rate);
		// });

		// шорткаты
		$scope.$watch("menu", function(newval, oldval) {
			$rootScope.menu = newval;
		});
		$rootScope.$watch("menu", function(newval, oldval) {
			$scope.menu = newval;
		});
		$scope.$watch("help", function(newval, oldval) {
			$rootScope.help = newval;
		});
		$scope.$watch("notes", function(newval, oldval) {
			$rootScope.notes = newval;
		});
		$scope.$on("shortcut:H", function() { $scope.help = !$scope.help; });
		$scope.$on("shortcut:M", function() { $scope.menu = !$scope.menu; });
		$scope.$on("shortcut:N", function() { $scope.notes = !$scope.notes; });

		// синхронизация
		$scope.currentAccount = PetrovStorage.account ? PetrovStorage.account : "локальный";
		$rootScope.currentAccount = PetrovStorage.account;
		$scope.exportAccount = "";
		$scope.checkSubmit = function(event) {
			if(event.keyCode == 13) {
				exportCurrentData($scope.exportAccount);
			}
		}
		$scope.submitExport = function() {
			exportCurrentData($scope.exportAccount);
		}

		// попапы
		$scope.showPopup = false;

		function saveSettings() {
			localStorage.setItem("Timerwood-Settings", angular.toJson($scope.settings));
		}

		function exportCurrentData(account) {
			// очистить
			$scope.exportAccount = "";
			// проверяем чего понаписали
			if(account == PetrovStorage.account) {
				$scope.popupMessage = "Глупо экспортировать текущие даные в текущий же аккаунт...";
				$scope.cancelAction = "";
				$scope.okAction = "ладно";
				$scope.okCallback = function() {};
				$scope.showPopup = true;
			} else if(!account || account == "") {
				// хотим заменить локальный аккаунт
				// вывести предупреждение
				$scope.popupMessage = "Вы собираетесь заменить все записи 'локального' аккаунта записями аккаунта " + PetrovStorage.account + "?";
				$scope.cancelAction = "ошибочка вышла";
				$scope.okAction = "точняк";
				$scope.okCallback = function() {
					Storage.saveLocal(account);
					$scope.popupMessage = "Удача сопутствовала вам. Перейти в 'локальный' аккаунт?";
					$scope.cancelAction = "не надо";
					$scope.okAction = "да";
					$scope.okCallback = function() {
						location.href = location.href.split("?")[0] + (account ? ("?"+account) : "");
					};
					$scope.showPopup = true;
				}
				$scope.showPopup = true;
			} else {
				// хотим заменить удалённый аккаунт,
				// вывести предупреждение
				$scope.popupMessage = "Вы собираетесь заменить все записи аккаунта " + account +
					" записями " + (PetrovStorage.account ? "" : "'локального'") + " аккаунта " +
					(PetrovStorage.account ? PetrovStorage.account : "") + "?";
				$scope.cancelAction = "ошибочка вышла";
				$scope.okAction = "точняк";
				$scope.okCallback = function() {
					Storage.saveLocal(account);
					Storage.saveRemote(account).then(function() {
						$scope.popupMessage = "Успех благоволит вам. А не желаете ли сразу и перейти в аккаунт " + account + "?";
						$scope.cancelAction = "не стоит";
						$scope.okAction = "извольте";
						$scope.okCallback = function() {
							location.href = location.href.split("?")[0] + (account ? ("?"+account) : "");
						};
						$scope.showPopup = true;
					});
				}
				$scope.showPopup = true;
			}
		}

	}]);
//
// Timerwood 3.0
// сервис "дни"
//

angular.module("TimerwoodApp.services")
	.factory("Months", ["Storage", "$rootScope", function(Storage, $rootScope) {

		// Хронология задач, группированная по месяцам
		// Задача содержит список записей хранилища которые она группирует
		// (одинаковые имена задач за данный день)

		function Months() {
			this.months = [];
		}

		// при этом апдейт записи из хранилища сводится к удалению и повторной вставке через
		// наши парсеры

		// далее редактирование - если редактируем детали, то это одно. а время и длительность - другое

		// должны уметь парсить по одной задаче хранилища

		// поэтому понадобятся вспомогательные добавлялки и геттеры для UI

		// фильтры недавнего тоже нужны

		// как отображение и редактирование происходит? редактируем детали
		// и идёт команда переименовать все соотв. записи хранилища - батч едит

		// если длительность или... а зачем менять длительность? забыли включить? или переставить порядок
		// должны уметь удалить запись хранилища при необходимости (и добавить и заапдейтить))

		// то есть есть функции для юзера, а есть внутренние

		Months.prototype.restore = function(storage) {
			this.months = [];
			for(var i = 0; i < storage.entries.length; i++) {
				// но это добавление новой записи хранилища
				this.addStorageEntry(storage.entries[i]);
			}
			this.sort();
		}

		Months.prototype.addStorageEntry = function(entry) {
			var month = this.getMonth(entry.start);
			if(!month) {
				this.months.unshift(new Month(entry, this));
			} else {
				month.addStorageEntry(entry);
			}
			this.sort();
		}

		Months.prototype.removeStorageEntry = function(entry) {
			var month = this.getMonth(entry.start);
			if(month) {
				month.removeStorageEntry(entry);
			} else {
				console.log("months removeStorageEntry: month not found or already removed");
			}
		}

		Months.prototype.getMonth = function(date) {
			for(var i = 0; i < this.months.length; i++) {
				if(sameMonth(date, this.months[i].tasks[0].time[0].start)) {
					return this.months[i];
				}
			}
		}

		Months.prototype.removeMonth = function(month) {
			var id = this.months.indexOf(month);
			if(id > -1) {
				this.months.splice(id, 1);
			}
		}

		Months.prototype.sort = function() {
			this.months.sort(function(a,b) { return b.tasks[0].time[0].start - a.tasks[0].time[0].start; });
		}



		//
		// Day
		//

		function Month(obj, parent) {
			if(obj.constructor.name == "StorageEntry") {
				this.tasks = [new Task(obj, this)];
			} else {
				this.tasks = [];
			}
			if(parent.constructor.name == "Months") {
				this.parent = parent;
			} else {
				console.log("месяц без родителя-хронологии - оцтой");
			}
		}

		Month.prototype.addStorageEntry = function(entry) {
			var task = this.getTask(entry.details);
			if(!task) {
				this.tasks.unshift(new Task(entry, this));
			} else {
				task.addStorageEntry(entry);
			}
			this.sort();
		}

		Month.prototype.removeStorageEntry = function(entry) {
			var task = this.getTask(entry.details);
			if(task) {
				task.removeStorageEntry(entry);
				// если больше нет задач, удаляем
				if(this.tasks.length == 0) {
					this.parent.removeMonth(this);
				}
			} else {
				console.log("day removeStorageEntry: task not found or already removed");
			}
		}

		Month.prototype.getTask = function(details) {
			for(var i = 0; i < this.tasks.length; i++) {
				if(angular.toJson(this.tasks[i].time[0].details) == angular.toJson(details)) {
					return this.tasks[i];
				}
			}
		}

		Month.prototype.removeTask = function(task) {
			var id = this.tasks.indexOf(task);
			if(id > -1) {
				this.tasks.splice(id, 1);
			}
		}

		Month.prototype.sort = function() {
			this.tasks.sort(function(a,b) { return b.time[0].start - a.time[0].start; });
		}

		Month.prototype.getDuration = function() {
			var duration = 0;
			for(var i = 0; i < this.tasks.length; i++) {
				duration += this.tasks[i].getDuration();
			}
			return duration;
		}

		Month.prototype.getDate = function() {
			return this.tasks[0].time[0].start;
		}


		//
		// Task
		//

		function Task(obj, parent) {
			if(obj.constructor.name == "StorageEntry") {
				this.time = [obj];
			} else {
				this.time = [];
				console.log("new task empty! Будет дерьмо");
			}

			if(parent.constructor.name == "Month") {
				this.parent = parent;
			} else {
				console.log("таск без родителя - оцтой");
			}
		}

		Task.prototype.addStorageEntry = function(entry) {
			if(this.time.indexOf(entry) < 0) {
				this.time.unshift(entry);
			}
			this.sort();
		}

		Task.prototype.removeStorageEntry = function(entry) {
			var id = this.time.indexOf(entry);
			if(id > -1) {
				this.time.splice(id,1);
				// если время стало пусто, нужно бы удалить таск
				if(this.time.length == 0) {
					this.parent.removeTask(this);
				}
			} else {
				console.log("task removeStorageEntry: time not found or already removed");
			}
		}

		Task.prototype.sort = function() {
			this.time.sort(function(a,b) { return b.start - a.start; });
		}

		Task.prototype.getDuration = function() {
			var duration = 0;
			for(var i = 0; i < this.time.length; i++) {
				duration += this.time[i].getDuration();
			}
			return duration;
		}

		Task.prototype.getDetails = function() {
			return this.time[0].details;
		}



		//
		// Утилиты
		//

		function sameDate(d1, d2) {
			return (d1.getDate() == d2.getDate()) && (d1.getMonth() == d2.getMonth()) && (d1.getFullYear() == d2.getFullYear());
		}
		function sameMonth(d1, d2) {
			return (d1.getMonth() == d2.getMonth()) && (d1.getFullYear() == d2.getFullYear());
		}
		function isFirstDateBigger(d1, d2) {
			return (
				d1.getFullYear() - d2.getFullYear() > 0 ||
				(d1.getFullYear() - d2.getFullYear() >= 0  && d1.getMonth() - d2.getMonth() > 0) ||
				(d1.getFullYear() - d2.getFullYear() >= 0 && d1.getMonth() - d2.getMonth() >= 0 && d1.getDate() - d2.getDate() > 0)
			);
		}



		//
		// Создаём
		//

		var months = new Months();
		months.restore(Storage);
		window.months = months;



		//
		// События
		//

		$rootScope.$on("storage-remove-entry", function(event, entry) {
			months.removeStorageEntry(entry);
		});

		$rootScope.$on("storage-add-entry", function(event, entry) {
			months.addStorageEntry(entry);
		});

		$rootScope.$on("storage-batch-remove", function(event, pack) {
			for(var i = 0; i < pack.length; i++) {
				months.removeStorageEntry(pack[i]);
			}
		});

		$rootScope.$on("storage-batch-add", function(event, pack) {
			for(var i = 0; i < pack.length; i++) {
				months.addStorageEntry(pack[i]);
			}
		});

		$rootScope.$on("storage-clear", function(event) {
			while(months.months.length > 0) months.months.pop();
		})


		return months;

	}]);
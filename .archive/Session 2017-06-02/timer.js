/* 
	Project: Управление делами
	Document: Timer script
	Coder: http://mr-woodman.ru
	
	Description: You start timer than stop it - and program outputs total time 
	that passed. You can set up you price/hour to calculate cost of passed time.
	This program is used by hour-cost-based workers for tracking time that you 
	spent on work - and cost of it.
*/

// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};
// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

// Enter point
$(document).ready(function() {
	// insert timer
	insertTimer();
	
	// insert switch
	insertSwitch();
});

// Insert timer --------------------------------------------------------------

/*
timer model is a class
each concrete timer is an instance of a class
class (array) for all timers on page. 
save data on each tick and each change of data


*/

var g_defaultPrice = 700; // ruble

// Timer utils 
var timerUtils = new (function() {
	// self
	var self = this;
	
	// Interval
	self.globalInterval = 0;
	
	// Utils	
	self.parseMs2Html = function(ms) {
		var hours = Math.floor(ms / (60*60*1000));
		var minutes = Math.floor((ms - hours*60*60*1000) / (60*1000));
		var secs = Math.floor((ms - hours*60*60*1000 - minutes*60*1000) / 1000);
		return self.leadingZero(hours)+":"+
			self.leadingZero(minutes)+":"+
			"<small>"+self.leadingZero(secs)+"</small>";
	}

	self.parseDate2Html = function(date) {	
		return self.leadingZero(date.getHours()) + ":" + self.leadingZero(date.getMinutes());
	}

	self.parseDate2DayMonth = function(date) {
		var z = date.getDate() + "." + self.leadingZero(parseInt(date.getMonth()) + 1); 
		log(z);
		return z;
	}

	self.leadingZero = function(val)
	{
		return val = val < 10 ? ("0"+String(val)) : String(val);
	}
	
	self.parseDateForIE = function(str) {
		return str;
	}
});

// Period class
var Period = function(defaultPrice) {
	var self = this;
	// start time
	self.start = ko.observable(new Date());
	self.startHtml = ko.computed(function() { return timerUtils.parseDate2Html(self.start()); });
	// date
	self.dateHtml = ko.computed(function() { return timerUtils.parseDate2DayMonth(self.start()); });
	// end time
	self.end = ko.observable(self.start());
	self.endHtml = ko.computed(function() { return timerUtils.parseDate2Html(self.end()); });
	// delta time (ms)
	self.delta = ko.computed(function() { return self.end() - self.start(); });
	self.deltaHtml = ko.computed(function() { return timerUtils.parseMs2Html(self.delta()); });
	// period price (in hour)
	self.price = ko.observable(defaultPrice);
	// period cost of an hour
	self.cost = ko.computed(function() {
		return Math.floor((self.delta() / (1000 * 60 * 60)) * self.price());
	});
	// notes
	self.notes = ko.observable("");
	// return nice array
	self.getJSON = function() {
		return { 
			start : self.start(), 
			end : self.end(), 
			delta : self.delta(), 
			price : self.price(), 
			cost : self.cost(),
			notes : self.notes() 
		};
	};
};

// Timer model
var timerModel = new (function() {
	var self = this;
	// title
	self.timerTitle = ko.observable("");
	// default price
	self.defaultPrice = ko.observable(g_defaultPrice);
	// periods array
	self.periods = ko.observableArray();
	// total time
	self.totalTime = ko.computed(function() {
		var tt = 0;
		for(var p in self.periods()) {
			tt = tt + self.periods()[p].delta();
		}
		return tt;
	});
	self.totalTimeHtml = ko.computed(function() { return timerUtils.parseMs2Html(self.totalTime());	});
	// total cost
	self.totalCost = ko.computed(function() {
		var tc = 0;
		for(var p in self.periods()) {
			tc = tc + self.periods()[p].cost();
		}
		return tc;
	});
	// create json from model
	self.getJSON = function() {
		// get all periods into json
		var periodsArrayOfJSON = [];
		for(var i in self.periods()) {
			periodsArrayOfJSON.push(self.periods()[i].getJSON());
		}
		return { 
			timerTitle : self.timerTitle(),
			defaultPrice : self.defaultPrice(),
			totalTime : self.totalTime(),
			totalCost : self.totalCost(),
			periods : periodsArrayOfJSON
		};
	};
	// save to storage
	self.save = function() {
		var jstr = $.toJSON(self.getJSON());
		$.jStorage.set("timer", jstr);
		$.jStorage.setTTL("timer", 31536000);
	};
	// load from storage
	self.load = function() {
		//log(String(self.timerTitle()));
		var j = $.evalJSON($.jStorage.get("timer", -1));
		if(j != -1) {
			// set title
			self.timerTitle(j.timerTitle);
			// set default price
			self.defaultPrice(j.defaultPrice);
			// add periods
			for(var i in j.periods) {
				self.periods.push(new Period(j.defaultPrice));
				var p = self.periods()[self.periods().length - 1];
				// set time & price
				var start = j.periods[i].start;				
				var end = j.periods[i].end;
				// IE < 9 dates fix
				if($.browser.msie && $.browser.version < 9) {
					start = start.replace(/\-/ig, '/').replace("T",":").split('.')[0];
					end = end.replace(/\-/ig, '/').replace("T",":").split('.')[0];
					log(start);
					log(end);
				}
				// add values
				p.start(new Date(start));
				p.end(new Date(end));
				p.price(j.periods[i].price);
				p.notes(j.periods[i].notes);
			}				
		}
		else return;
	}
	// export
	self.export = function() {
		//
		var data = $.evalJSON($.toJSON(self.getJSON()));
		log(data);
		var str = "<small>" + data.timerTitle + "<br>";
		for( var i in data.periods) {
			// add time and price
			// date
			str += "(" + timerUtils.parseDate2DayMonth(new Date(data.periods[i].start)) + ") ";
			// start
			str += timerUtils.parseDate2Html(new Date(data.periods[i].start)) + " - ";
			// end
			str += timerUtils.parseDate2Html(new Date(data.periods[i].end)) + " = ";
			// delta
			str += timerUtils.parseMs2Html(data.periods[i].delta) + ", ";
			// cost
			str += data.periods[i].cost + " руб, &nbsp; ";
			// notes
			str += data.periods[i].notes + " <br>";
		}
		// total
		str += "Итого времени " + timerUtils.parseMs2Html(data.totalTime) + 
			", денег " + data.totalCost + " руб.";
		str += "</small>"
		return str;
	}
	// update
	self.updatePeriod = function() {
		var d = new Date();
		self.periods()[self.periods().length-1].end(d);
		// save data
		self.save();
	}
});



// Insert timer main func
function insertTimer() {

	// apply timer data model to Knockoutjs
	ko.applyBindings(timerModel);
	// load saved settings from storage
	timerModel.load();
	
	// apply timer toggle button 
	$(".timer-widget button.toggle").click(function() {
		// toggle css styles
		$(this).toggleClass("stop");
		// toggle timer
		var t; // timeout handler
		if($(this).hasClass("stop")) {
			// we are playing now
			$(this).html("Стоп");
			// add new period
			timerModel.periods.push(new Period(timerModel.defaultPrice()));
			// start timer
			timerUtils.globalInterval = setInterval("timerModel.updatePeriod()",1000);
		}
		else {
			// we are paused now
			$(this).html("Старт");
			// stop timer
			clearInterval(timerUtils.globalInterval);
		}
	});	
	// apply clear button
	$(".timer-widget .clear").click(function() {
		// clear interval timer
		clearInterval(timerUtils.globalInterval);
		// reset button
		$(".timer-widget button.toggle").html("Старт").removeClass("stop");
		// clear cache
		$.jStorage.deleteKey("timer");
		// clear periods
		timerModel.periods.remove(function(item) { return item != -1; });
		// clear title
		timerModel.timerTitle("");
		// clear export
		$(".exported-text").html("");
		// boom
		return false;
	});

	/* delete timer
	$(".timer-widget").each(function() {
		$(this).on("click", ".delete", function(event) {
			deletePeriod(event);
		})
	});*/


	// save timer title on edit
	$(".timer-widget .timer-title").change(function() {
		// save
		timerModel.save();
	});

	// save timer on notes edit
	$(".timer-widget .notes").change(function() {
		timerModel.save();
	});

	// export
	$(".export").click(function() {
		//
		$(".exported-text").html(timerModel.export());
	})
}

// Delete period

function deletePeriod(event) {
	var event = event || window.event;
	var target = event.target || event.srcElement;
	// get our parent li
	var li = $(target).parents("li").get(0);
	// find out its index inside ul
	var id = $(".timer-widget ul li").index(li);
	// remove period with this id
	var count = -1;
	timerModel.periods.remove(function(item) { 
		count++;
		if(count == id) return true;
		else return  false;
	});
	// save data
	timerModel.save();
}

// Insert switch -------------------------------------------------------------

function insertSwitch() {
	// for each switch
	$(".switch").each(function() {
		// get link
		var link = $(this).attr("href");
		// hide linked text
		$(link).hide();
		// toggle on hover
		$(this).hover(function() { $(link).show(); },function() { $(link).hide(); });
	});
}
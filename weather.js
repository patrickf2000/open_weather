$(document).ready(function() {
	$("#weather_output").hide();
	$("#extended_output").hide();
	
	$("#zip").keydown(function(e) {
		if (e.which == 13) {
			e.preventDefault();
			loadWeather();
		}
	});
});



function loadWeather() {
    loadCurrent();
    loadFuture();
    showElements();
}

function showElements() {
	$("#weather_output").show();
	$("#extended_output").show();
}

function loadCurrent() {
    var zipcode = document.getElementById("zip").value;
    var url = "http://api.openweathermap.org/data/2.5/weather?zip="+zipcode+",us&units=imperial&APPID=fe8b7eccff226324ad9367fe61044b1d";
    
    var request = new XMLHttpRequest();
    request.open('GET',url,true);

    request.onload = function() {
        var data = JSON.parse(request.response);
        document.getElementById("city").innerHTML = "Location: "+data.name;

        var current = "<strong>Current conditions:</strong><br />";
        current += "Temperature: " + data.main.temp + "<br />";
        current += "High: " + data.main.temp_max + "<br />";
        current += "Low: " + data.main.temp_min + "<br />";
        current += "Humidity: " + data.main.humidity + "%<br />";
        current += "Wind Speed: " + data.wind.speed + " mph<br />";

        document.getElementById("current_conditions").innerHTML = current;

        var condition = data.weather[0].main;
        document.getElementById("weather_icon").src = getIconSrc(condition);
    }

    request.send();
}

function loadFuture() {
    var zipcode = document.getElementById("zip").value;
    var url = "http://api.openweathermap.org/data/2.5/forecast?zip="+zipcode+",us&units=imperial&APPID=fe8b7eccff226324ad9367fe61044b1d";
    
    var request = new XMLHttpRequest();
    request.open('GET',url,true);

    request.onload = function() {
        var data = JSON.parse(request.response);
        var list = data.list;

        var lastDate = loadDate(list[0].dt_txt);

        var indexes = new Array();
        indexes.push(0);

        for (var i = 1; i<list.length; i++) {
            var date = loadDate(list[i].dt_txt);
            if (date != lastDate) {
                lastDate = date;
                indexes.push(i);
            }
        }
        
       	var index = 1;
        
        for (var i = 0; i<indexes.length; i++) {
        	var next = list.length;
        	if (i+1 < indexes.length) {
        		next = indexes[i+1];
        	}
        	console.log("Current: "+indexes[i]);
        	console.log("Next: "+next);
        	console.log("");
        	
        	var weather = list[indexes[i]];
        	var lastTemp = weather.main.temp_max;
            
        	for (var j = i; j<next; j++) {
        		var weather_temp = list[j];
        		var t = weather_temp.main.temp_max;
        		
        		if (parseInt(t,10) > parseInt(lastTemp,10)) {
        			weather = list[j];
        			lastTemp = t;
        		}
        	}
        	
        	var title = weather.dt_txt;
            var description = weather.weather[0].main;
            var temp = weather.main.temp_max;
            
            document.getElementById("date_day"+index).innerHTML = loadDate(title);
            document.getElementById("img_day"+index).src = getIconSrc(description);
            document.getElementById("temp_day"+index).innerHTML = temp;
            
            index++;
        }
    }

    request.send();
}

function getIconSrc(condition) {
	console.log("Condition: "+condition);
    var icon = "icons/sun.svg";

    if (condition == "Rain") {
        icon = "icons/rain.svg";
    } else if (condition == "Snow") {
        icon = "icons/snowing.svg";
  	} else if (condition == "Clouds" || condition == "Mist") {
  		icon = "icons/cloudy.svg";
    } else {
        icon = "icons/sun.svg";
    }

    return icon;
}

function loadDate(date) {
    var ret = "";

    for (var i = 0; i<date.length; i++) {
        if (date[i] == ' ') {
            break;
        } else {
            ret += date[i];
        }
    }

    return ret;
}


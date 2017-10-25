$( document ).ready(function() {
    $('#searchbuttonid').on('click', searchKeyword);
    $('#geobuttonid').on('click', geoSearch);
});

var ourMap;
var markerClusterer = null;
var coordinates_lat = [];
var coordinates_lng = [];
var created_at = [];
var userNames = [];
var userScreenNames = [];
var tweets = [];
var markers = [];
var profile = [];
var prev_infowindow = null;

function searchKeyword(){
  ourMap.setZoom(3)
  var keyword = $('#serachbox').val();
  console.log(keyword)
  httpGetAsync("search/", keyword);
}
function geoSearch(){
  //console.log('hell')
  //var lon = $('#long').val();
  //var lan = $('#dis').val()
  //var loc = geo.split(",")
  //console.log(lat)
  //console.log(lng)
  if($('#lon').val() == "" || $("#lat").val() == "" ||$("#dis").val() == ""){
    alert('wrong input')
    return;
  }
  var lon = Number($('#lon').val());
  var lat = Number($("#lat").val());
  var dis = Number($("#dis").val());
  console.log(lon); 
  if(isNaN(lon) || lon <-180 || lon > 180 ){
    alert('wrong input')
    return;
  }
  if(isNaN(lat) || lat <-180 || lat > 180 ){
    alert('wrong input')
    return;
  }
  if(isNaN(dis) || dis < 0 ){
    alert('wrong input')
    return;
  }
  ourMap.setZoom(3)
  resetVariables();
  /*
  $.ajax({
    type : "POST",
    url : "geosearch/",
    data: JSON.stringify({location:{lat:lat,lon:lon},distance:dis}),
    contentType: 'application/json;charset=UTF-8',
    success: function(result) {
        console.log(result);
        processJsonResult(result)
    }
});*/
    $.post("geosearch/", {location:{lat:lat,lon:lon},distance:dis} ).done(function(result) {
        console.log(result);
        processJsonResult(result)
    });
  
}
function searchKeyword2(keyword){
  httpGetAsync("search/", keyword);
  //console.log(ourMap);
  ourMap.setCenter({
    lat: 39.8282,
    lng: -98.5795
  });
  ourMap.setZoom(3)
}

function initMap() {
  //console.log("howdie how")
	var myLatLng = {
		lat: 39.8282,
		lng: -98.5795
	};

	ourMap = new google.maps.Map(document.getElementById('map'), {
		zoom: 3,
		center: myLatLng,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_CENTER
    }
	});
  markerClusterer = new MarkerClusterer(ourMap, markers);
  google.maps.event.addListener(ourMap, "click", function (event) {
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    $('#lon').val(longitude);
    $("#lat").val(latitude);
    console.log( latitude + ', ' + longitude );
});
}

function resetVariables(){
  coordinates_lat = [];
  coordinates_lng = [];
  created_at = [];
  tweets = [];
  userNames = [];
  userScreenNames = [];
  prev_infowindow = null;
  deleteMarkers();
  markerClusterer.clearMarkers();
}
//handle the search part
function httpGetAsync(theUrl, keyword) {
  resetVariables()
  $.getJSON(theUrl + keyword, function(result){
      processJsonResult(result, keyword);
  });
}

function processJsonResult(result, keyword) {
  if(keyword != null){
    var tweets_list = result[keyword];
  }else{
    var tweets_list = result;
  }
  if (tweets_list == null) {
    alert("No results found");
    return;
  }
  //console.log(result);
  console.log(tweets_list)


  for (var i = 0; i < tweets_list.length; i++) {
      var tweet = tweets_list[i];
      console.log(tweet);
      coordinates_lng.push(tweet.location.lon);
      coordinates_lat.push(tweet.location.lat);
      tweets.push(tweet.text);
      created_at.push(tweet.time);
      userNames.push(tweet.name);
      profile.push(tweet.profile)
      
  }
  generateMarkers();
}

function generateMarkers() {
  for (var i = 0; i < tweets.length; i++) {
    var location = {
      lat: parseFloat(coordinates_lat[i]),
      lng: parseFloat(coordinates_lng[i])
    };

    var contentString = '<div id="content">'+
             "<img src='" + profile[i] + "' alt='Flowers in Chania' style = 'width:200px;height:200px'> " +
            "<h3>" + userNames[i] + "</h3>" +
            "<p>" + tweets[i] + "</p>" +
            "<p>" + "Created At: " + created_at[i] + "</p>" +
            "</div>";
    
    var marker = new google.maps.Marker({
  		position: location,
  		title: 'Hello World!'
  	});
    var infowindow = new google.maps.InfoWindow();
    bindInfoWindow(marker, ourMap, infowindow, contentString);
    // marker.addListener('click', function() {
    //   infowindow.open(ourMap, this);
    // });
    markers.push(marker);
  }
  markerClusterer.addMarkers(markers)
}

function bindInfoWindow(marker, map, infowindow, html) {
    //console.log("here we are")
    marker.addListener('click', function() {
        if( prev_infowindow != null ) {
            prev_infowindow.close();
        }
        prev_infowindow = infowindow;
        infowindow.setContent(html);
        infowindow.open(map, marker);
    });
}

function myFunction2() {
	document.getElementById("myDropdown2").classList.toggle("show");
}



function filterFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	div = document.getElementById("myDropdown");
	a = div.getElementsByTagName("a");
	for (i = 0; i < a.length; i++) {
		if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
			a[i].style.display = "";
		} else {
			a[i].style.display = "none";
		}
	}
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(ourMap);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

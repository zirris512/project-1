//Function for locationIQ API call
function placesAPI(placeSearch) {
    $("#search-result").empty();

    var locationAPI = "027f206e7e01f6";
    let queryURL = "https://us1.locationiq.com/v1/search.php?key=" + locationAPI + "&q=" + placeSearch + "&format=json";

    $.ajax({
        url: queryURL,
        method: "GET"
    })

    .then(function (response) {
        console.log(queryURL);
        console.log(response);

        let results = response;

        //Map method to pan to new location
        map.panTo(new L.LatLng(parseFloat(results[0].lat), parseFloat(results[0].lon)));

        //Loop through API object and display results on DOM
        for(let i = 0; i < results.length; i++) {
            var displayName = results[i].display_name;
            var attractionName = displayName.split(",",1)[0];
            var searchDiv = $("<div>");
            var p1 = $("<p>").text((i+1) + ". " + attractionName);
            p1.addClass("attraction-name");
            var p2 = $("<p>").text(displayName.substring(displayName.indexOf(",")+2));
            var btn = $("<button>").text("Search Hotels");
            var markerbtn = $("<button>").text("Place Marker");
            markerbtn.attr("data-long", results[i].lon);
            markerbtn.attr("data-lat", results[i].lat);
            markerbtn.addClass("place-marker");
            btn.attr("data-long", results[i].lon);
            btn.attr("data-lat", results[i].lat);
            btn.addClass("search-hotel");
            searchDiv.append(p1);
            searchDiv.append(p2);
            searchDiv.append(markerbtn ,btn);
            $("#search-result").append(searchDiv, $("<hr>"));
        }
    })
}

//Function to place markers for attraction search
function placeMarkerAttractions () {

    //Set of variables to change marker appearance
    var myCustomColour = '#00FF00'

    const markerHtmlStyles = `
    background-color: ${myCustomColour};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1.5rem;
    top: -1.5rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF`

    const myIcon = L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`
    })

    //Save longitude and latitude data to variables
    let mLongitude = $(this).attr("data-long");
    let mLatitude = $(this).attr("data-lat");

    //Removes marker on button click if one already exists
    if (marker) {
        map.removeLayer(marker);
    }
    //Creates new marker at new location
    marker = new L.marker([mLatitude, mLongitude], {icon: myIcon}).addTo(map);
}

//Function to place markers on hotel search
function placeMarkerHotels () {

    //Set of variables to change marker appearance
    var myCustomColour = '#FF0000'

    const markerHtmlStyles = `
    background-color: ${myCustomColour};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1.5rem;
    top: -1.5rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF`

    const myIcon = L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`
    })

    //Saves longitude and latitude data to variables
    let mLongitude = $(this).attr("data-long");
    let mLatitude = $(this).attr("data-lat");

    //Removes marker on button press if one already exists on map
    if (marker1) {
        map.removeLayer(marker1);
    }
    //Creates marker at new location
    marker1 = new L.marker([mLatitude, mLongitude], {icon: myIcon}).addTo(map);
}

//Function that handles the hotwire API call
function hotelSearch () {
    //Clear text already in place
    $("#search-result").text("");
    
    var destination = $(this).attr("data-lat") + "," + $(this).attr("data-long");
    var hotelAPI = "ja638mjk2ruvwf4mhhrrdcr5";
    let queryURL = "https://api.hotwire.com/v1/deal/hotel?format=json&dest==" + destination + "&distance=*~20&apikey=" + hotelAPI + "&limit=10";
    
    //Pan map to new location based on button press
    map.panTo(new L.LatLng($(this).attr("data-lat"), $(this).attr("data-long")));
    map.setZoom(12);
    
    $.ajax({
        url: queryURL,
        method: "GET"
    })

    .then(function (response) {
        console.log(queryURL);
        console.log(response);

    
        let results = response.Result;

        //Loop through API object and create new text on DOM
        for(let j = 0; j < results.length; j++) {
            var hotelName = results[j].Headline.split(",",1)[0];
            var hotelSavings = "(Save: " + results[j].SavingsPercentage + "%)";
            var neighborhood = results[j].Neighborhood;
            var hotelPrice = "$" + parseInt(results[j].Price) + "/night";
            var hotelDiv = $("<div>");
            var pHotel = $("<p>").text(hotelName +": " + neighborhood);
            var pPrice = $("<h3>").html(hotelPrice + " " + "<span class=percentage>" + hotelSavings + "</span>");
            var hotelbtn = $("<button>").text("Search Deals");
            var markerbtn = $("<button>").text("Place Marker");
            markerbtn.attr("data-long", results[j].NeighborhoodLongitude);
            markerbtn.attr("data-lat", results[j].NeighborhoodLatitude);
            markerbtn.addClass("marker-hotel");
            hotelbtn.attr("data-url", results[j].Url);
            hotelbtn.addClass("deals-button");
            hotelDiv.append(pHotel);
            hotelDiv.append(pPrice);
            hotelDiv.append(markerbtn, hotelbtn);
            $("#search-result").append(hotelDiv, $("<hr>"));
        }
    }
)}

//Search button click listener
$("#search-attraction").on("click", function(event) {
    event.preventDefault();

    //Takes user input and saves it to a variable with attractions added to search
    let placeSearch = $("#user-input").val().trim() + " attractions";
    placesAPI(placeSearch);

    //Clears search bar
    $("#user-input").val("");
})

//Function to open hotwire page on deals button click
function openHotelPage () {
    console.log($(this).attr("data-url"));
    var win = window.open($(this).attr("data-url"), "_blank");

    if (win) {
        win.focus();
    }

    else {
        alert("Please allow popups for this site");
    }
}

// API token goes here
var key = '027f206e7e01f6';

// Add layers that we need to the map
var streets = L.tileLayer.Unwired({
        key: key,
        scheme: "streets"
    });

// Initialize the map
var map = L.map('map', {
        center: [0, 0], //map loads with this location as center
        zoom: 13,
        layers: [streets] // Show 'streets' by default
});

// Add the 'scale' control
L.control.scale().addTo(map);

// Add the 'layers' control
L.control.layers({
    "Streets": streets
}).addTo(map);

//Marker variable initialization
var marker;

var marker1;

//Click listener for dynamic hotel search button
$(document).on("click", ".search-hotel", hotelSearch);

//Click listener for dynamic attractions marker button
$(document).on("click", ".place-marker", placeMarkerAttractions);

//Click listener for dynamic hotel marker button
$(document).on("click", ".marker-hotel", placeMarkerHotels);

//Click listener for dynamic hotwire deals button
$(document).on("click", ".deals-button", openHotelPage);
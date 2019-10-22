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

        map.panTo(new L.LatLng(parseFloat(results[0].lat), parseFloat(results[0].lon)));

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
            $("#search-result").append(searchDiv);
        }
    })
}

function placeMarkerAttractions () {

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

    let mLongitude = $(this).attr("data-long");
    let mLatitude = $(this).attr("data-lat");
    if (marker) {
        map.removeLayer(marker);
    }
    marker = new L.marker([mLatitude, mLongitude], {icon: myIcon}).addTo(map);
}

function placeMarkerHotels () {

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

    let mLongitude = $(this).attr("data-long");
    let mLatitude = $(this).attr("data-lat");

    if (marker) {
        map.removeLayer(marker);
    }
    marker = new L.marker([mLatitude, mLongitude], {icon: myIcon}).addTo(map);
}

function hotelSearch () {
    $("#search-result").text("");
    
    var destination = $(this).attr("data-lat") + "," + $(this).attr("data-long");
    var hotelAPI = "ja638mjk2ruvwf4mhhrrdcr5";
    let queryURL = "http://api.hotwire.com/v1/deal/hotel?format=json&dest==" + destination + "&distance=*~20&apikey=" + hotelAPI + "&limit=10";
    
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

        for(let j = 0; j < results.length; j++) {
            console.log(j);
            var hotelName = results[j].Headline.split(",",1)[0];
            var neighborhood = results[j].Neighborhood;
            var hotelPrice = "$" + parseInt(results[j].Price) + "/night";
            var hotelDiv = $("<div>");
            var pHotel = $("<p>").text(hotelName +": " + neighborhood);
            var pPrice = $("<h3>").text(hotelPrice);
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
            $("#search-result").append(hotelDiv);
        }
    }
)}

$("#search-attraction").on("click", function(event) {
    event.preventDefault();

    let placeSearch = $("#user-input").val().trim() + " attractions";
    placesAPI(placeSearch);

    $("#user-input").val("");
})

function openHotelPage () {
    console.log($(this).attr("data-url"));
    window.location = $(this).attr("data-url");
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

var marker;

$(document).on("click", ".search-hotel", hotelSearch);

$(document).on("click", ".place-marker", placeMarkerAttractions);

$(document).on("click", ".marker-hotel", placeMarkerHotels);

$(document).on("click", ".deals-button", openHotelPage);
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
            var longitude = parseFloat(results[i].lon);
            var latitude = parseFloat(results[i].lat);
            var displayName = results[i].display_name;
            var attractionName = displayName.split(",",1)[0];
            var searchDiv = $("<div>");
            var p1 = $("<p>").text((i+1) + ". " + attractionName);
            var p2 = $("<p>").text(displayName.substring(displayName.indexOf(",")+2));
            var btn = $("<button>").text("Search Hotels");
            btn.attr("data-long", results[i].lon);
            btn.attr("data-lat", results[i].lat);
            btn.addClass("search-hotel");
            var marker = L.marker([latitude, longitude]).addTo(map);
            marker.bindPopup(attractionName).openPopup();
            searchDiv.append(p1);
            searchDiv.append(p2);
            searchDiv.append(btn);
            // trying to append a break line so its more clear on the search hotel.
            //$(searchDiv).append("<br>"); 
            $("#search-result").append(searchDiv);
        }
    })
}
$("#search-attraction").on("click", function(event) {
    event.preventDefault();

    let placeSearch = $("#user-input").val().trim() + " attractions";
    placesAPI(placeSearch);
})
// Progress-bar call going here
$()

// API token goes here
var key = '027f206e7e01f6';

// Add layers that we need to the map
var streets = L.tileLayer.Unwired({
        key: key,
        scheme: "streets"
    });

// Initialize the map
var map = L.map('map', {
        center: [51.505, -0.09], //map loads with this location as center
        zoom: 12,
        layers: [streets] // Show 'streets' by default
});

// Add the 'scale' control
L.control.scale().addTo(map);

// Add the 'layers' control
L.control.layers({
    "Streets": streets
}).addTo(map);

$(document).on("click", ".search-hotel", hotelSearch);
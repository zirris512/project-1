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

        for(let i = 0; i < results.length; i++) {
            var attractionName = results[i].display_name.split(",",1)[0];
            var searchDiv = $("<div>");
            var p = $("<p>").text((i+1) + ". " + attractionName);
            var btn = $("<button>").text("Search Hotels");
            btn.attr("data-long", results[i].lon);
            btn.attr("data-lat", results[i].lat);
            btn.addClass("search-hotel");
            searchDiv.append(p);
            searchDiv.append(btn);
            $("#search-result").append(searchDiv);
        }
    })
}

$("#search-attraction").on("click", function(event) {
    event.preventDefault();

    let placeSearch = $("#user-input").val().trim() + " attractions";
    placesAPI(placeSearch);
})
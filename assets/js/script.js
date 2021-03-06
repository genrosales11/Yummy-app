// ------------------------------------- MAPS API -------------------------------------
var map;

// Function that displays markers on the map for each restaurant
function setMarkers(restaurant) {
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(restaurant.coordinates.latitude, restaurant.coordinates.longitude),
        title: restaurant.name
    })

    // To add marker to the map
    marker.setMap(map);

    // Add an info window for each marker
    var infoWindow = new google.maps.InfoWindow({
        content: restaurant.name
    })

    // Clicking at the marker displays the marker's associated restaurant name
    marker.addListener("click", () => {
        infoWindow.open({
            anchor: marker,
            map,
            shouldFocus: false
        })
    })
}

// Google Maps API function to display map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        // Dummy data to populate map's center to remove error
        center: { lat: 37.0902, lng: -95.7129 },
        zoom: 10
    })
}
window.initMap = initMap;

// ------------------------------------- YELP API -------------------------------------

// Pointer to the search button
var searchBtn = document.getElementById("search-btn")
// Pointer to the users selection of food category
var catSearch = document.getElementById("choose-category")
// Pointer to the price ranges
var pricePoint = document.querySelector('input[name="foobar"]')
// Pointer to user input for city/zipcode
var userLocation;
// Pointer to food category
var category;
// Pointer to price range
var price;

// Function to grab user input and pass it to the Yelp API
function cityInput(event) {
    // Empty container
    $("#card-container").empty();
    // Recall map to remove previous markers
    initMap();

    event.preventDefault();

    userLocation = document.getElementById("city-search").value;
    category = catSearch.value;

    price = document.getElementsByName('foobar');

    for (var i = 0, length = price.length; i < length; i++) {
        if (price[i].checked) {
            price = price[i].value;
            break;
        }
    }

    getData(userLocation, category, price);
}

function displayCard(business) {
    // Create a card container for each restaurant information
    var column = $("<div>");
    column.attr("class", "column");
    var card = $("<div>");
    card.attr("class", "card");

    // Restaurant image
    var cardImage = $("<div>");
    cardImage.attr("class", "card-image");
    var imageFigure = $("<figure>");
    imageFigure.attr("class", "image is-4by3");
    var image = $("<img>");
    image.attr("src", business.image_url);
    image.attr("alt", "Restaurant image");
    image.css("height", "100%");
    image.css("min-width", "100%");
    imageFigure.append(image);
    cardImage.append(imageFigure);
    card.append(cardImage);

    // Card content
    var cardContent = $("<div>").attr("class", "card-content");
    var content = $("<div>").attr("class", "content");
    // Restaurant name
    var name = $("<h2>");
    name.text(business.name);
    content.append(name);

    // Row with columns for dollar sign, ratings, review count
    var restaurantInfo = $("<div>").attr("class", "columns is-mobile is-gapless m-0");
    // Price range for each restaurant
    var price = $("<p>").attr("class", "column is-2");
    price.text(business.price);
    // Ratings for each restaurant
    var ratings = $("<p>").attr("class", "column");
    ratings.text(business.rating + " / 5");
    // Review count for each restaurant
    var reviewCnt = $("<p>").attr("class", "column");
    reviewCnt.text(business.review_count + " revs");

    // appednd to cards
    restaurantInfo.append(price);
    restaurantInfo.append(ratings);
    restaurantInfo.append(reviewCnt);


    // Food category type for each restaurant
    var category = $("<p>");
    category.text(business.categories[0].title);

    // Address for each restaurant
    var address = $("<p>");
    address.text(business.location.display_address);

    // Yelp URL for each restaurant
    var siteLink = $("<a>");
    siteLink.attr("href", business.url);
    siteLink.attr("target", "_blank");
    siteLink.text("Click here to visit the restaurant on Yelp");

    // Keep appending to this
    content.append(restaurantInfo);
    content.append(category);
    content.append(address);
    content.append(siteLink);

    // Append everything to the card
    cardContent.append(content);
    card.append(cardContent);
    column.append(card);

    // Append card to HTML
    $("#card-container").append(column);

    return {
        imageURL: business.image_url,
        name: business.name,
        price: business.price,
        rating: business.rating,
        reviewCnt: business.review_count,
        category: business.categories[0].title,
        address: business.location.display_address,
        URL: business.url,
        coordinates: business.coordinates
    }
}

// call yelp api
function getData(userLocation, category, price) {
    // bypass yelps cors restriction by appending first url
    let queryURL = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${userLocation}&term=${category}&price=${price}`;
    const apiKey = 'S9-0qQhgv6fiYrqXXE9X-TIZd1aepWF1BA6eT6_wQnQXtp8R1SVNuaXBGaZO15-IizPiprlRb6IT7v_gz_Dfl7yzGpZD_sCSnedvAD89GvwKGf85mwqLPWc5JGjIYnYx'

    $.ajax({
        url: queryURL,
        method: "GET",
        headers: {
            "accept": "application/json",
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${apiKey}`
        },
        data: {
            // term: category,
            // location: userLocation
        }
    }).then(function (data) {
        // console.log(data)

        // Grab the center coordinates of the results to set it as the map's center
        var center = { lat: data.region.center.latitude, lng: data.region.center.longitude };
        // Set center of map based on the data's center
        map.setCenter(center);
        // Display map
        $("#map").css("height", "300px");
        $("#map").css("width", "100%");

        // If no restaurants are returned
        if (data.businesses.length === 0) {
            $("#card-container").addClass("is-centered");
            var column = $("<div>");
            column.attr("class", "column is-half");
            var message = $("<h2>");
            message.text("Oh no! No restaurants are available with your given preferences. Try something else!");
            column.append(message);

            // Append text to HTML
            $("#card-container").append(column);
        } else {
            var restaurantsInfo = [];

            for (var i = 0; i < 5; i++) {
                // Get coordinates to populate map
                setMarkers(data.businesses[i]);

                // Display restaurant card
                restaurantsInfo.push(displayCard(data.businesses[i]));
            }
            // console.log(restaurantsInfo);
            // Save restaurant info to local storage (only most recent)
            localStorage.clear();
            setLocalStorage(userLocation, category, price, restaurantsInfo, data.region.center);
        }
    });
}



// ------------------------------------- LOCAL STORAGE -------------------------------------
// Save to local storage user input and its results
function setLocalStorage(userLocation, category, price, resArray, dataCenter) {
    var search = {
        userLocation: userLocation,
        category: category,
        price: price,
        dataCenter: dataCenter,
        restaurants: resArray
    }

    localStorage.setItem(userLocation, JSON.stringify(search));
}

//Button to display user's last search
var prevSearchBtn = $("#prev-search-btn");
prevSearchBtn.click(getLocalStorage);


//--------------- adding chroma JS------------//
var changer = document.querySelector("div.color-changer input")
var bodyTag = document.querySelector("body")

// create event listener
changer.addEventListener("input", function () {
    bodyTag.style.backgroundColor = changer.value
    // add chroma
    const color = chroma(changer.value)
    // add chroma variable
    if (color.luminance() < 0.2) {
        bodyTag.classList.add("dark")
    } else {
        bodyTag.classList.remove("dark")
    }
})



// Get user's last search to populate page
function getLocalStorage() {
    // Get the key on local storage
    var key = localStorage.key(0);
    // Retrieve values
    var results = JSON.parse(localStorage.getItem(key));
    // console.log(results);

    // Populate page with retrieved data
    // 1. Populate map
    initMap();
    var center = { lat: results.dataCenter.latitude, lng: results.dataCenter.longitude };
    map.setCenter(center);
    $("#map").css("height", "300px");
    $("#map").css("width", "100%");

    // 2. Display restaurants
    results.restaurants.forEach(restaurant => {
        // Populate map with markers
        setMarkers(restaurant)

        // Format so it works with displayCard()
        var res = {
            image_url: restaurant.imageURL,
            name: restaurant.name,
            price: restaurant.price,
            rating: restaurant.rating,
            review_count: restaurant.reviewCnt,
            categories: [{ title: restaurant.category }],
            location: { display_address: restaurant.address },
            url: restaurant.URL
        }
        displayCard(res);
    })

    // 3. Populate user input with user's previous inputs
    $("#city-search").val(results.userLocation);
    $("#choose-category").val(results.category);
    $(`#${results.price}`).prop("checked", true);

}



// Call Yelp API once the user clicks the "Search" button
searchBtn.addEventListener("click", cityInput);

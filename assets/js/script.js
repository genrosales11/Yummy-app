// // Initialize Google Maps API
// var map;
// // Dummy data to display restaurants in a given area
// var restaurants = [
//     {
//         name: "Hawkers Asian Street Food",
//         lat: 28.560418,
//         lng: -81.364372
//     },
//     {
//         name: "Izziban Sushi & BBQ",
//         lat: 28.5535468,
//         lng: -81.3222981
//     }
// ];



// // Function that displays markers on the map for each restaurant
// function setMarkers(map) {
//     restaurants.forEach(res => {
//         var marker = new google.maps.Marker({
//             position: new google.maps.LatLng(res.lat, res.lng),
//             title: res.name
//         })

//         // To add marker to the map
//         marker.setMap(map);

//         // Add an info window for each marker
//         var infoWindow = new google.maps.InfoWindow({
//             content: res.name
//         })

//         // Clicking at the marker displays the marker's associated restaurant name
//         marker.addListener("click", () => {
//             infoWindow.open({
//                 anchor: marker,
//                 map,
//                 shouldFocus: false
//             })
//         })
//     })
// }

// // Google Maps API function to display map
// function initMap() {
//     map = new google.maps.Map(document.getElementById("map"), {
//         center: { lat: 28.538902, lng: -81.378981 },
//         zoom: 12
//     })

//     // Dummy data: for each restaurant in the list, show the marker on the map
//     setMarkers(map);

// }

// window.initMap = initMap;

// Pointer to the search button
var searchBtn = document.getElementById("search-btn")
// Pointer to the users selection of food category
var catSearch = document.getElementById("choose-category")
// Pointer to the price ranges
var pricePoint = document.querySelector('input[name="foobar"]')


// Function to grab user input and pass it to the Yelp API
function cityInput(event) {
    // Empty container
    $("#card-container").empty();

    event.preventDefault();

    var userLocation = document.getElementById("city-search").value;
    var category = catSearch.value;
    // var price = pricePoint.value

    var price = document.getElementsByName('foobar');

    for (var i = 0, length = price.length; i < length; i++) {
        if (price[i].checked) {
            price = price[i].value;
            break;
        }
    }

    getData(userLocation, category, price);
}

// call yelp api
function getData(userLocation, category, price) {
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
        console.log(data)

        for (var i = 0; i < 5; i++) {
            // Create a card container for each restaurant information
            var card = $("<div>");
            card.attr("class", "card column");

            // <div class="card-image">
            //     <figure class="image is-4by3">
            //         <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
            //     </figure>
            // </div>

            // Restaurant image
            var cardImage = $("<div>");
            cardImage.attr("class", "card-image");
            var imageFigure = $("<figure>");
            imageFigure.attr("class", "image is-4by3");
            var image = $("<img>");
            image.attr("src", data.businesses[i].image_url);
            image.attr("alt", "Restaurant image");
            image.css("height", "100%");
            image.css("min-width", "100%");
            imageFigure.append(image);
            cardImage.append(imageFigure);
            card.append(cardImage);

            // <div class="card-content">
            //     <div class="content">
            //         Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            //         Phasellus nec iaculis mauris. <a>@bulmaio</a>.
            //         <a href="#">#css</a> <a href="#">#responsive</a>
            //         <br>
            //             <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
            //     </div>
            // </div>

            var cardContent = $("<div>").attr("class", "card-content");
            var content = $("<div>").attr("class", "content");
            // Restaurant name
            var name = $("<h2>");
            name.text(data.businesses[i].name);
            content.append(name);

            // Row with columns for dollar sign, ratings, review count
            var restaurantInfo = $("<div>").attr("class", "columns");
            // Price range for each restaurant
            var price = $("<p>").attr("class", "column");
            price.text(data.businesses[i].price);
            // Ratings for each restaurant
            var ratings = $("<p>").attr("class", "column");
            ratings.text(data.businesses[i].rating);
            // Review count for each restaurant
            var reviewCnt = $("<p>").attr("class", "column");
            reviewCnt.text(data.businesses[i].review_count);
            
            restaurantInfo.append(price);
            restaurantInfo.append(ratings);
            restaurantInfo.append(reviewCnt);

            
            // Food category type for each restaurant
            var category = $("<p>");
            category.text(data.businesses[i].categories[0].title);
            
            // Address for each restaurant
            var address = $("<p>");
            address.text(data.businesses[i].location.display_address);
            
            // Yelp URL for each restaurant
            var siteLink = $("<a>");
            siteLink.attr("href", data.businesses[i].url);
            siteLink.text("Click here to visit the restaurant on Yelp");

            // Keep appending to this
            content.append(restaurantInfo);
            content.append(category);
            content.append(address);
            content.append(siteLink);

            // Append everything to the card
            cardContent.append(content);
            card.append(cardContent);



            // // Name for each restaurant
            // var name = document.createElement("h2");
            // name.textContent = data.businesses[i].name;
            
            // // Price range for each restaurant
            // var price = document.createElement("p")
            // price.textContent = data.businesses[i].price
            // // Ratings for each restaurant
            // var ratings = document.createElement("p")
            // ratings.textContent = data.businesses[i].rating
            // // Review count for each restaurant
            // var reviewCnt = document.createElement("p")
            // reviewCnt.textContent = data.businesses[i].review_count
            // // Yelp URL for each restaurant
            // var siteLink = document.createElement("a")
            // siteLink.setAttribute("href", data.businesses[i].url)
            // siteLink.textContent = "Click here to visit the restaurant on Yelp"
            // // Food category type for each restaurant
            // var category = document.createElement("p")
            // category.textContent = data.businesses[i].categories[0].title

            // Append card to HTML
            $("#card-container").append(card)
        }

    });

}

// Call Yelp API once the user clicks the "Search" button
searchBtn.addEventListener("click", cityInput)

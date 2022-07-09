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

        for (i = 0; i < 5; i++) {
            // Create a card for each restaurant information
            var card = document.createElement("div")
            card.classList.add("card-class")
            // Name for each restaurant
            var name = document.createElement("h2")
            name.textContent = data.businesses[i].name
            // Address for each restaurant
            var address = document.createElement("p")
            address.textContent = data.businesses[i].location.display_address
            // Image for each restaurant
            var image = document.createElement("img")
            image.src = data.businesses[i].image_url
            // Price range for each restaurant
            var price = document.createElement("p")
            price.textContent = data.businesses[i].price
            // Ratings for each restaurant
            var ratings = document.createElement("p")
            ratings.textContent = data.businesses[i].rating
            // Review count for each restaurant
            var reviewCnt = document.createElement("p")
            reviewCnt.textContent = data.businesses[i].review_count
            // Yelp URL for each restaurant
            var siteLink = document.createElement("a")
            siteLink.setAttribute("href", data.businesses[i].url)
            siteLink.textContent= "Click here to visit the restaurant on Yelp"
            // Food category type for each restaurant
            var category = document.createElement("p")
            category.textContent = data.businesses[i].categories[0].title

            // Append to the card container
            card.appendChild(image)
            card.appendChild(name)
            card.appendChild(price)
            card.appendChild(ratings)
            card.appendChild(reviewCnt)
            card.appendChild(category)
            card.appendChild(address)
            card.appendChild(siteLink)
            // Append card to HTML
            appendCard(card)
            document.getElementById("card-container").appendChild(card)
        }

    });

}

// Call Yelp API once the user clicks the "Search" button
searchBtn.addEventListener("click", cityInput)

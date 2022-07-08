// Initialize Google Maps API
var map;
// Dummy data to display restaurants in a given area
var restaurants = [
    {
        name: "Hawkers Asian Street Food",
        lat: 28.560418,
        lng: -81.364372
    },
    {
        name: "Izziban Sushi & BBQ",
        lat: 28.5535468,
        lng: -81.3222981
    }
];

// Function that displays markers on the map for each restaurant
function setMarkers(map) {
    restaurants.forEach(res => {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(res.lat, res.lng),
            title: res.name
        })
        
        // To add marker to the map
        marker.setMap(map);

        // Add an info window for each marker
        var infoWindow = new google.maps.InfoWindow({
            content: res.name
        })
        
        // Clicking at the marker displays the marker's associated restaurant name
        marker.addListener("click", () => {
            infoWindow.open({
                anchor: marker,
                map,
                shouldFocus: false
            })
        })
    })
}

// Google Maps API function to display map
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 28.538902, lng: -81.378981},
        zoom: 12
    })

    // Dummy data: for each restaurant in the list, show the marker on the map
    setMarkers(map);
    
}

window.initMap = initMap;
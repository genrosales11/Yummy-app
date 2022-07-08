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

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 28.538902, lng: -81.378981},
        zoom: 10
    })

    restaurants.forEach(res => {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(res.lat, res.lng),
            title: res.name
        })

        // To add marker to the map
        marker.setMap(map);
    })
}

window.initMap = initMap;
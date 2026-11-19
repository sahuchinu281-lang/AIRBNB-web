const mapElement = document.getElementById("map");

if (mapElement) {
    const token = mapElement.dataset.token;

    let coordinates = [];

    try {
        coordinates = JSON.parse(
            mapElement.dataset.coordinates || "[]"
        );
    } catch (error) {
        console.error("Invalid map coordinates:", error);
    }

    if (!token) {
        console.error("Mapbox token is missing.");
    } else if (
        coordinates.length !== 2 ||
        !coordinates.every(Number.isFinite)
    ) {
        console.error("Valid listing coordinates are missing.");
    } else {
        mapboxgl.accessToken = token;

        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: coordinates,
            zoom: 10
        });

        new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setText(mapElement.dataset.title || "Listing")
            )
            .addTo(map);
    }
}
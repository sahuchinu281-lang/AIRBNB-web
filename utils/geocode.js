const mapToken = process.env.MAP_TOKEN;

async function geocodeLocation(location) {
    if (!mapToken) {
        throw new Error("MAP_TOKEN is missing from the .env file");
    }

    if (!location || !location.trim()) {
        throw new Error("Listing location is required for geocoding");
    }

    const url =
        `https://api.mapbox.com/search/geocode/v6/forward` +
        `?q=${encodeURIComponent(location)}` +
        `&limit=1` +
        `&access_token=${encodeURIComponent(mapToken)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Mapbox geocoding failed: ${response.status}`);
    }

    const data = await response.json();
    const feature = data.features?.[0];

    if (!feature) {
        throw new Error(`No coordinates found for: ${location}`);
    }

    const [longitude, latitude] = feature.geometry.coordinates;

    return {
        type: "Point",
        coordinates: [longitude, latitude]
    };
}

module.exports = geocodeLocation;
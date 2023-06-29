import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

interface City {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

async function getCitiesGeoJson(countryName: string): Promise<any> {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${countryName}&components=country:${countryName}&key=YOUR_API_KEY`,
  );

  const results = response.data.results;
  if (results.length === 0) {
    throw new Error('No results found for the specified country.');
  }

  const cities: City[] = results.map((result: any) => {
    const cityName = result.address_components[0].long_name;
    const location = result.geometry.location;
    return {
      name: cityName,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
    };
  });

  const geoJson = {
    type: 'FeatureCollection',
    features: cities.map((city: City) => {
      return {
        type: 'Feature',
        properties: {
          name: city.name,
        },
        geometry: {
          type: 'Point',
          coordinates: [city.location.lng, city.location.lat],
        },
      };
    }),
  };

  return geoJson;
}

// Example usage
getCitiesGeoJson('New Zealand')
  .then((geoJson) => {
    console.log('Cities GeoJSON:', geoJson);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

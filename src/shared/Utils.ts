/* eslint-disable @typescript-eslint/no-explicit-any */
import * as turf from "@turf/turf"

export function getRandomNumber(min: number, max: number) {
  const randomDecimal = Math.random();
  const randomNumber = min + randomDecimal * (max - min);
  return Math.floor(randomNumber);
}

export function calculateBearing(
  point1: [number, number],
  point2: [number, number]
) {
  const lat1: number = point1[1];
  const lon1 = point1[0];
  const lat2 = point2[1];
  const lon2 = point2[0];

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180) / Math.PI; // Convert radians to degrees

  return (bearing + 360) % 360; // Normalize to 0-360 degrees
}

export const toRad = (value: number) => (value * Math.PI) / 180;


export function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
) {
const lat1 = point1.lat;
    const lon1 = point1.lng;
    const lat2 = point2.lat;
    const lon2 = point2.lng;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}

  // Function to generate coordinates along a LineString using Turf.js
export function generateCoordinatesAlongLineString(lineString, interval) {
    const line = turf.lineString(lineString);
    const length = turf.length(line, { units: "kilometers" });
    const coordinates: any = [];
    for (let distance = 0; distance <= length; distance += interval) {
      const point = turf.along(line, distance, { units: "kilometers" });
      coordinates.push(point.geometry.coordinates);
    }
    return coordinates.map((coord) => ([
      coord[1], coord[0]]));
  }


export  const generateRoute = (source, destination, steps = 100) => {
  const line = turf.lineString([source, destination]);
  const route = turf.lineSliceAlong(line, 0, 1, { units: 'kilometers' });
  const coordinates = turf.coordAll(route);
  const stepSize = Math.floor(coordinates.length / steps);

  return coordinates.filter((_, index) => index % stepSize === 0);
};

export function getRandomCoordinatesBetweenPoints(source, destination) {
    const line = turf.lineString([source, destination]);

  // Calculate the length of the route
  const routeLength = turf.length(line, { units: 'kilometers' });
  
  // Calculate the interval distance between random points (1 km radius)
  const numPointsRouter = routeLength.toFixed()
  const intervalDistance = routeLength / numPointsRouter;
  // Generate random points along the route
  const randomPoints:any = [];
  for (let i = 0; i < numPointsRouter; i++) {
    const distanceAlongRoute = i * intervalDistance;
    const point = turf.along(line, distanceAlongRoute, { units: 'kilometers' });
    randomPoints.push(point.geometry.coordinates);
  }

  return randomPoints;
}
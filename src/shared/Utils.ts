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

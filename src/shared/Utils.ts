export function getRandomNumber(min: number, max: number) {
  const randomDecimal = Math.random();
  const randomNumber = min + randomDecimal * (max - min);
  return Math.floor(randomNumber);
}

export function calculateBearing(point1: [number, number], point2: [number, number]) {
  const lat1: number = point1[1];
  const lon1 = point1[0];
  const lat2 = point2[1];
  const lon2 = point2[0];

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180) / Math.PI; // Convert radians to degrees

  return (bearing + 360) % 360; // Normalize to 0-360 degrees
}


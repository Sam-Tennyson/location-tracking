export function getRandomNumber(min: number, max: number) {
  const randomDecimal = Math.random();
  const randomNumber = min + randomDecimal * (max - min);
  return Math.floor(randomNumber);
}

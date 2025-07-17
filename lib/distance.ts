export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371000; // Earth radius in meters

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInMeters = R * c;

  //   if (distanceInMeters >= 1000) {
  //     return `${(distanceInMeters / 1000).toFixed(2)} km`;
  //   } else {
  //     return `${distanceInMeters.toFixed(2)} m`;
  //   }
  return distanceInMeters;
}

const toRad = (angle: number) => (angle * Math.PI) / 180;

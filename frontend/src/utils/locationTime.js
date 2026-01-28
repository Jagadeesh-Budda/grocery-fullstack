export const DEFAULT_CITY = "Mumbai";
export const DEFAULT_TIME_ZONE = "Asia/Kolkata";
export const DEFAULT_REGION = "other";

export const LOCATION_CITY_KEY = "selected_city";
export const LOCATION_TZ_KEY = "selected_timeZone";
export const LOCATION_REGION_KEY = "selected_region";
export const LOCATION_EVENT = "app:location-change";

export function getStoredCity() {
  try {
    return localStorage.getItem(LOCATION_CITY_KEY) || DEFAULT_CITY;
  } catch {
    return DEFAULT_CITY;
  }
}

export function getStoredTimeZone() {
  try {
    return (
      localStorage.getItem(LOCATION_TZ_KEY) ||
      DEFAULT_TIME_ZONE
    );
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}

export function getStoredRegion() {
  try {
    return localStorage.getItem(LOCATION_REGION_KEY) || DEFAULT_REGION;
  } catch {
    return DEFAULT_REGION;
  }
}

export function setStoredLocation({ city, timeZone, region }) {
  try {
    if (city) localStorage.setItem(LOCATION_CITY_KEY, city);
    if (timeZone) localStorage.setItem(LOCATION_TZ_KEY, timeZone);
    if (region) localStorage.setItem(LOCATION_REGION_KEY, region);
  } catch {
    // ignore storage errors
  }
  window.dispatchEvent(new Event(LOCATION_EVENT));
}

export function deriveRegionFromIndianState(state) {
  if (!state || typeof state !== "string") return DEFAULT_REGION;
  const s = state.toLowerCase();

  const south = [
    "tamil nadu",
    "kerala",
    "karnataka",
    "andhra pradesh",
    "telangana",
    "puducherry",
    "pondicherry",
  ];

  const north = [
    "delhi",
    "uttar pradesh",
    "haryana",
    "punjab",
    "rajasthan",
    "himachal pradesh",
    "uttarakhand",
    "jammu",
    "kashmir",
    "ladakh",
    "chandigarh",
  ];

  if (south.some((k) => s.includes(k))) return "south";
  if (north.some((k) => s.includes(k))) return "north";
  return "other";
}

export function getHourInTimeZone(timeZone) {
  const tz = timeZone || DEFAULT_TIME_ZONE;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const hourPart = parts.find((p) => p.type === "hour")?.value;
  const hour = Number(hourPart);
  return Number.isFinite(hour) ? hour : new Date().getHours();
}

export async function reverseGeocodeLocation(lat, lon) {
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(
    lat
  )}&longitude=${encodeURIComponent(
    lon
  )}&localityLanguage=en`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("reverse-geocode-failed");
  const data = await res.json();

  const city =
    data.city ||
    data.locality ||
    data.localityInfo?.administrative?.[0]?.name ||
    null;

  const state = data.principalSubdivision || null;

  return { city, state };
}

export async function reverseGeocodeCity(lat, lon) {
  const data = await reverseGeocodeLocation(lat, lon);
  return data?.city || data?.state || null;
}

export async function lookupTimeZone(lat, lon) {
  const url = `https://timeapi.io/api/TimeZone/coordinate?latitude=${encodeURIComponent(
    lat
  )}&longitude=${encodeURIComponent(lon)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("timezone-lookup-failed");
  const data = await res.json();

  return (
    data.timeZone ||
    data.timeZoneName ||
    data.ianaTimeZoneId ||
    data.tz ||
    null
  );
}

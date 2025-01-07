/**
 * Represents the full earthquake response object from the USGS API.
 */
export interface EarthquakeResponse {
  type: string;
  metadata: {
    generated: number; // Timestamp in milliseconds
    url: string; // URL of the API request
    title: string; // Title of the feed
    api: string; // API version
    count: number; // Number of earthquakes in the feed
    status: number; // HTTP response status code
  };
  bbox: [number, number, number, number, number, number]; // Min/max longitude, latitude, depth
  features: EarthquakeFeature[]; // List of earthquake features
}

/**
 * Represents a single earthquake feature in the response.
 */
export interface EarthquakeFeature {
  type: string; // Typically "Feature"
  properties: {
    mag: number | null; // Magnitude of the earthquake
    place: string; // Location description
    time: number; // Time the event occurred (milliseconds since epoch)
    updated: number; // Time the event was last updated (milliseconds since epoch)
    tz: number | null; // Timezone offset in minutes
    url: string; // Link to USGS event page
    detail: string; // Link to detailed GeoJSON feed
    felt?: number; // Number of "Did You Feel It?" responses
    cdi?: number; // Maximum reported intensity (0.0–10.0)
    mmi?: number; // Maximum estimated instrumental intensity (0.0–10.0)
    alert?: string; // Alert level (e.g., green, yellow, orange, red)
    status: string; // Review status (e.g., automatic, reviewed)
    tsunami: number; // Tsunami flag (0 or 1)
    sig: number; // Significance of the event (0–1000)
    net: string; // Network ID
    code: string; // Event code
    ids: string; // Comma-separated list of event IDs
    sources: string; // Comma-separated list of contributing networks
    types: string; // Comma-separated list of product types
    nst?: number; // Number of seismic stations used
    dmin?: number; // Minimum distance to the nearest station (degrees)
    rms?: number; // Root-mean-square of travel time residuals (seconds)
    gap?: number; // Azimuthal gap in station distribution (degrees)
    magType: string; // Magnitude type (e.g., Mw, Ml, Md)
    type: string; // Event type (e.g., earthquake, quarry)
  };
  geometry: {
    type: string; // Geometry type (typically "Point")
    coordinates: [number, number, number]; // Longitude, latitude, depth
  };
  id: string; // Unique event identifier
}

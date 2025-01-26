// Helper function to create a JWT token
import jwt from "jsonwebtoken";

export const generateToken = (userId, rememberMe) => {
  const SECRET_KEY = process.env.SECRET_KEY;
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: rememberMe ? "7d" : "1h" }); // Updated "7h" to "7d" for more reasonable expiration
};

// Helper function to get country/location from IP address
export const getCountryFromIp = async (ip) => {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,countryCode,regionName,city,lat,lon`);
    const userLocation = await response.json();
    
    // Ensure response is successful and contains the required data
    if (userLocation.status === "fail") {
      console.error("Failed to get location data:", userLocation.message);
      return null;
    }

    return {
      country: userLocation.country,
      countryCode: userLocation.countryCode,
      regionName: userLocation.regionName,
      city: userLocation.city,
      lat: userLocation.lat,
      lon: userLocation.lon,
      ipAddress: ip,  // Return the original IP address too
    };
  } catch (error) {
    console.error("Error fetching country/location from IP:", error);
    return null;
  }
};

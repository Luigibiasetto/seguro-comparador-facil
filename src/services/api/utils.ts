
// Calculate the duration of a trip in days
export const calculateTripDuration = (departureDate: string, returnDate: string): number => {
  const start = new Date(departureDate);
  const end = new Date(returnDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Parse search parameters from URL
export const parseSearchParams = (searchParams: URLSearchParams) => {
  const origin = searchParams.get("origin") || "BR";
  const destination = searchParams.get("destination") || "EUROPE";
  const departureDate = searchParams.get("departureDate") || new Date().toISOString();
  const returnDate = searchParams.get("returnDate") || new Date().toISOString();
  const passengersStr = searchParams.get("passengers") || '{"count":1,"ages":[30]}';
  const phone = searchParams.get("phone") || "";
  
  let passengers;
  try {
    passengers = JSON.parse(passengersStr);
  } catch (e) {
    passengers = { count: 1, ages: [30] };
  }
  
  return {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    phone
  };
};

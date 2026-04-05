/**
 * Checks if a restaurant is currently closed based on its status and opening/closing times.
 * @param {Object} restaurant - The restaurant object from the backend.
 * @returns {boolean} - True if the restaurant is closed, false otherwise.
 */
export const checkIsClosed = (restaurant) => {
  if (!restaurant) return true;
  
  // 1. Check operational status
  if (restaurant.status !== 'OPEN') return true;
  
  // 2. Check time-based availability
  if (!restaurant.openingTime || !restaurant.closingTime) return false;

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    
    // Normalizing time string (handle cases like "08:00 AM", "8:00pm", "20:00")
    const cleaned = timeStr.trim().toLowerCase();
    const isPM = cleaned.includes('pm');
    const isAM = cleaned.includes('am');
    
    // Remove AM/PM for numerical parsing
    const timeOnly = cleaned.replace(/[ap]m/g, '').trim();
    let [hours, minutes] = timeOnly.split(':');
    
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10) || 0;
    
    if (isNaN(hours)) return null;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  
  const openMins = parseTime(restaurant.openingTime);
  const closeMins = parseTime(restaurant.closingTime);

  if (openMins === null || closeMins === null) return false;

  // Handle overnight opening (e.g., 6:00 PM to 2:00 AM)
  if (openMins <= closeMins) {
    // Normal case (e.g., 9:00 AM to 10:00 PM)
    return currentMins < openMins || currentMins > closeMins;
  } else {
    // Overnight case
    return currentMins > closeMins && currentMins < openMins;
  }
};

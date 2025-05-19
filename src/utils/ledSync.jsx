export const syncLeds = async () => {
    try {
      // Fetch all lockers
      const lockerResponse = await fetch('http://127.0.0.1:5000/api/lockers');
      if (!lockerResponse.ok) throw new Error('Failed to fetch lockers');
      const lockers = await lockerResponse.json();
  
      // Fetch activity logs to determine occupancy
      const activityLogResponse = await fetch('http://127.0.0.1:5000/api/activitylogs');
      if (!activityLogResponse.ok) throw new Error('Failed to fetch activity logs');
      const activityLogs = await activityLogResponse.json();
  
      // Create a set of occupied locker numbers (unclaimed logs)
      const occupiedLockers = new Set(
        activityLogs
          .filter((log) => log.date_received === null)
          .map((log) => log.lockerNumber)
      );
  
      // Process each locker
      const triggerPromises = lockers.map(async (locker) => {
        const { ip_address, leds, number } = locker;
        if (!ip_address || !leds) {
          console.warn(`Locker ${number} missing ip_address or leds; skipping LED sync`);
          return;
        }
  
        const isOccupied = occupiedLockers.has(number);
        const ledState = isOccupied ? 'on' : 'off';
        const ledUrl = `http://${ip_address}/${leds}/${ledState}`;
  
        try {
          const response = await fetch(ledUrl, { method: 'GET' });
          if (!response.ok) throw new Error(`Failed to set LED ${leds} to ${ledState} at ${ip_address}`);
          console.log(`Set LED ${leds} to ${ledState} for locker ${number} at ${ip_address}`);
        } catch (error) {
          console.error(`Error setting LED for locker ${number}:`, error.message);
        }
      });
  
      // Execute all LED trigger requests concurrently
      await Promise.all(triggerPromises);
      console.log('LED sync completed');
    } catch (error) {
      console.error('Error syncing LEDs:', error.message);
    }
  };
/**
 * @file storeStatus.ts
 * @description Dynamic store opening status calculations based on Venezuela timezone (America/Caracas, UTC-4).
 */

export interface StoreLiveStatus {
  isOpen: boolean;
  statusLabel: string;
  statusDetail: string;
  badgeClass: 'status-open' | 'status-closed';
  currentVzlaTimeStr: string;
}

export interface VenezuelaTimeInfo {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  hours: number;
  minutes: number;
  timeDecimal: number;
  formattedTime: string;
}

/**
 * Gets the current time components in Venezuela timezone (America/Caracas, UTC-4).
 */
export function getVenezuelaTime(customDate?: Date): VenezuelaTimeInfo {
  const date = customDate || new Date();

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Caracas',
      hour12: false,
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    });

    const parts = formatter.formatToParts(date);
    let weekdayStr = '';
    let hourStr = '0';
    let minStr = '0';

    for (const part of parts) {
      if (part.type === 'weekday') weekdayStr = part.value;
      if (part.type === 'hour') hourStr = part.value;
      if (part.type === 'minute') minStr = part.value;
    }

    const daysMap: Record<string, number> = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6
    };

    const dayOfWeek = daysMap[weekdayStr] ?? date.getDay();
    const hours = parseInt(hourStr, 10);
    const minutes = parseInt(minStr, 10);
    const timeDecimal = hours + minutes / 60;

    const displayHour12 = hours % 12 === 0 ? 12 : hours % 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${displayHour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    return {
      dayOfWeek,
      hours,
      minutes,
      timeDecimal,
      formattedTime
    };
  } catch {
    // Fallback if timezone formatting fails
    const utcHours = date.getUTCHours();
    const utcMins = date.getUTCMinutes();
    const vzlaHours = (utcHours - 4 + 24) % 24;
    const dayOfWeek = date.getUTCDay();
    const timeDecimal = vzlaHours + utcMins / 60;
    const displayHour12 = vzlaHours % 12 === 0 ? 12 : vzlaHours % 12;
    const ampm = vzlaHours >= 12 ? 'PM' : 'AM';

    return {
      dayOfWeek,
      hours: vzlaHours,
      minutes: utcMins,
      timeDecimal,
      formattedTime: `${displayHour12}:${utcMins.toString().padStart(2, '0')} ${ampm}`
    };
  }
}

/**
 * Computes whether a specific store is currently open in Venezuela and returns descriptive metadata.
 * 
 * Schedule rules:
 * - tienda-comercio (Bellagio JK):
 *     Mon-Sat: 9:00 AM - 5:00 PM
 *     Sun: 10:00 AM - 3:00 PM
 * - tienda-mobili (Bellagio Mobili):
 *     Mon-Sat: 9:00 AM - 5:00 PM
 *     Sun: 10:00 AM - 3:00 PM
 * - tienda-casamall (Bellagio Collezione):
 *     Mon-Sat: 10:00 AM - 7:00 PM
 *     Sun: Cerrado
 */
export function getStoreLiveStatus(storeId: string, customDate?: Date): StoreLiveStatus {
  const vzlaTime = getVenezuelaTime(customDate);
  const { dayOfWeek, timeDecimal, formattedTime } = vzlaTime;

  const isSunday = dayOfWeek === 0;
  const isSaturday = dayOfWeek === 6;
  const isMonToSat = dayOfWeek >= 1 && dayOfWeek <= 6;

  // 1. Casa Mall (Bellagio Collezione): Mon-Sat 10:00 AM (10.0) - 7:00 PM (19.0), Sun Closed
  if (storeId === 'tienda-casamall') {
    if (isMonToSat) {
      if (timeDecimal >= 10.0 && timeDecimal < 19.0) {
        return {
          isOpen: true,
          statusLabel: 'Abierto Ahora',
          statusDetail: 'Cierra hoy a las 7:00 PM',
          badgeClass: 'status-open',
          currentVzlaTimeStr: formattedTime
        };
      }
      if (timeDecimal < 10.0) {
        return {
          isOpen: false,
          statusLabel: 'Cerrado Ahora',
          statusDetail: 'Abre hoy a las 10:00 AM',
          badgeClass: 'status-closed',
          currentVzlaTimeStr: formattedTime
        };
      }
      // After 7:00 PM
      const nextOpen = isSaturday ? 'Abre el lunes a las 10:00 AM' : 'Abre mañana a las 10:00 AM';
      return {
        isOpen: false,
        statusLabel: 'Cerrado Ahora',
        statusDetail: nextOpen,
        badgeClass: 'status-closed',
        currentVzlaTimeStr: formattedTime
      };
    }

    // Sunday (Closed)
    return {
      isOpen: false,
      statusLabel: 'Cerrado Hoy (Domingo)',
      statusDetail: 'Abre el lunes a las 10:00 AM',
      badgeClass: 'status-closed',
      currentVzlaTimeStr: formattedTime
    };
  }

  // 2. Bellagio JK ('tienda-comercio') & Bellagio Mobili ('tienda-mobili'):
  // Mon-Sat: 9:00 AM (9.0) - 5:00 PM (17.0)
  // Sun: 10:00 AM (10.0) - 3:00 PM (15.0)
  if (isMonToSat) {
    if (timeDecimal >= 9.0 && timeDecimal < 17.0) {
      return {
        isOpen: true,
        statusLabel: 'Abierto Ahora',
        statusDetail: 'Cierra hoy a las 5:00 PM',
        badgeClass: 'status-open',
        currentVzlaTimeStr: formattedTime
      };
    }
    if (timeDecimal < 9.0) {
      return {
        isOpen: false,
        statusLabel: 'Cerrado Ahora',
        statusDetail: 'Abre hoy a las 9:00 AM',
        badgeClass: 'status-closed',
        currentVzlaTimeStr: formattedTime
      };
    }
    // After 5:00 PM
    const nextOpen = isSaturday
      ? 'Abre mañana (Domingo) a las 10:00 AM'
      : 'Abre mañana a las 9:00 AM';
    return {
      isOpen: false,
      statusLabel: 'Cerrado Ahora',
      statusDetail: nextOpen,
      badgeClass: 'status-closed',
      currentVzlaTimeStr: formattedTime
    };
  }

  // Sunday
  if (isSunday) {
    if (timeDecimal >= 10.0 && timeDecimal < 15.0) {
      return {
        isOpen: true,
        statusLabel: 'Abierto Ahora (Domingo)',
        statusDetail: 'Cierra hoy a las 3:00 PM',
        badgeClass: 'status-open',
        currentVzlaTimeStr: formattedTime
      };
    }
    if (timeDecimal < 10.0) {
      return {
        isOpen: false,
        statusLabel: 'Cerrado Ahora',
        statusDetail: 'Abre hoy a las 10:00 AM',
        badgeClass: 'status-closed',
        currentVzlaTimeStr: formattedTime
      };
    }
    // After 3:00 PM on Sunday
    return {
      isOpen: false,
      statusLabel: 'Cerrado Ahora',
      statusDetail: 'Abre el lunes a las 9:00 AM',
      badgeClass: 'status-closed',
      currentVzlaTimeStr: formattedTime
    };
  }

  return {
    isOpen: false,
    statusLabel: 'Cerrado',
    statusDetail: 'Consulta por WhatsApp',
    badgeClass: 'status-closed',
    currentVzlaTimeStr: formattedTime
  };
}

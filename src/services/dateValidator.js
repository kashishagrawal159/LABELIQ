/**
 * Dedicated Date Detection and Regulatory Validation Service
 * Canonical fields: manufacturing_date, expiry_date
 * Reference Date: Evaluated against current calendar date.
 */

const MONTH_NAMES = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12
};

/**
 * Parses various Indian packaging date formats into a standard JS Date object.
 * Supports:
 * - DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
 * - MM/YYYY, MM-YYYY, MM.YYYY
 * - YYYY/MM/DD, YYYY-MM-DD
 * - DD/MM/YY, MM/YY
 * - 10 Aug 2026, Aug 2026, OCT 2027
 * Returns { date: Date, precision: 'day'|'month'|'year', formatted: string } or null
 */
export function parsePackagingDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const str = dateStr.trim();

  // Clean common noise
  const cleanStr = str.replace(/^[^\d\w]+|[^\d\w]+$/g, '');

  // 1. Check for text month pattern: e.g. "10 Aug 2026", "10-Aug-2026", "Aug 2026"
  const textMonthRegex = /(?:(\d{1,2})[\s\-\.\/])?([a-zA-Z]{3,9})[\s\-\.\/](\d{2,4})/;
  const textMatch = cleanStr.match(textMonthRegex);
  if (textMatch) {
    const monthKey = textMatch[2].toLowerCase();
    if (MONTH_NAMES[monthKey]) {
      const month = MONTH_NAMES[monthKey];
      let year = parseInt(textMatch[3], 10);
      if (year < 100) year += 2000;
      const day = textMatch[1] ? parseInt(textMatch[1], 10) : 1;
      const dateObj = new Date(year, month - 1, day);
      return {
        date: dateObj,
        precision: textMatch[1] ? 'day' : 'month',
        formatted: textMatch[1] 
          ? `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
          : `${String(month).padStart(2, '0')}/${year}`
      };
    }
  }

  // 2. YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = cleanStr.match(/^(\d{4})[\-\/\.](\d{1,2})[\-\/\.](\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    const dateObj = new Date(year, month - 1, day);
    return {
      date: dateObj,
      precision: 'day',
      formatted: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
    };
  }

  // 3. DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = cleanStr.match(/^(\d{1,2})[\-\/\.](\d{1,2})[\-\/\.](\d{2,4})$/);
  if (dmyMatch) {
    let day = parseInt(dmyMatch[1], 10);
    let month = parseInt(dmyMatch[2], 10);
    let year = parseInt(dmyMatch[3], 10);
    if (year < 100) year += 2000;

    // Sanity check: if first number is > 12 and second <= 12, it's definitely day-first.
    // In India, standard is DD/MM/YYYY.
    if (month > 12 && day <= 12) {
      // Swapped format fallback
      const temp = day;
      day = month;
      month = temp;
    }

    const dateObj = new Date(year, month - 1, day);
    return {
      date: dateObj,
      precision: 'day',
      formatted: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
    };
  }

  // 4. MM/YYYY or MM-YYYY or MM.YYYY or MM/YY
  const myMatch = cleanStr.match(/^(\d{1,2})[\-\/\.](\d{2,4})$/);
  if (myMatch) {
    const month = parseInt(myMatch[1], 10);
    let year = parseInt(myMatch[2], 10);
    if (year < 100) year += 2000;

    if (month >= 1 && month <= 12) {
      const dateObj = new Date(year, month - 1, 1);
      return {
        date: dateObj,
        precision: 'month',
        formatted: `${String(month).padStart(2, '0')}/${year}`
      };
    }
  }

  return null;
}

/**
 * Searches text for Manufacturing Date patterns
 */
export function extractManufacturingDate(text) {
  if (!text) return null;
  const mfgPattern = /(?:MFG|MFD|MFG\s*DATE|MANUFACTURED|DATE\s*OF\s*MANUFACTURE|DOM|PKD|PACKED\s*ON)[\s:\.\-]*([0-9a-zA-Z\/\.\-]+)/i;
  const match = text.match(mfgPattern);
  if (match && match[1]) {
    const parsed = parsePackagingDate(match[1]);
    if (parsed) return parsed.formatted;
  }
  return null;
}

/**
 * Searches text for Expiry Date / Best Before patterns, including derived shelf life.
 */
export function extractExpiryDate(text, mfgDateFormatted = null) {
  if (!text) return null;

  // 1. Direct EXP patterns: EXP, EXP DATE, EXPIRY, USE BY, BEST BEFORE
  const expPattern = /(?:EXP|EXP\s*DATE|EXPIRY|EXPIRY\s*DATE|USE\s*BY|BEST\s*BEFORE|BBE)[\s:\.\-]*([0-9a-zA-Z\/\.\-]+)/i;
  const match = text.match(expPattern);
  if (match && match[1]) {
    // Check if it's shelf life text e.g. "12 Months"
    const shelfLifeMatch = match[1].match(/(\d+)\s*(?:MONTHS|MONTH|DAYS|DAY|YEARS|YEAR)/i);
    if (shelfLifeMatch) {
      return deriveExpiryFromShelfLife(shelfLifeMatch[0], mfgDateFormatted);
    }

    const parsed = parsePackagingDate(match[1]);
    if (parsed) return { value: parsed.formatted, isDerived: false };
  }

  // 2. Shelf-life phrases: "BEST BEFORE 12 MONTHS FROM MFD / PACKING"
  const phraseMatch = text.match(/BEST\s*BEFORE\s*(\d+)\s*(MONTHS|MONTH|DAYS|YEARS|YEAR)\s*(?:FROM|OF)?/i);
  if (phraseMatch) {
    return deriveExpiryFromShelfLife(`${phraseMatch[1]} ${phraseMatch[2]}`, mfgDateFormatted);
  }

  return null;
}

/**
 * Derives expiry date from manufacturing date + shelf life duration
 */
export function deriveExpiryFromShelfLife(shelfLifeStr, mfgDateFormatted) {
  if (!shelfLifeStr) return null;
  const match = shelfLifeStr.match(/(\d+)\s*(month|year|day)/i);
  if (!match) return null;

  const count = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  if (!mfgDateFormatted) {
    return {
      value: `Best Before ${count} ${unit}s (Requires Mfg Date)`,
      isDerived: true,
      note: "Derived from shelf life — Waiting for manufacturing date detection"
    };
  }

  const mfgParsed = parsePackagingDate(mfgDateFormatted);
  if (!mfgParsed) return null;

  const derivedDate = new Date(mfgParsed.date);
  if (unit.startsWith('month')) {
    derivedDate.setMonth(derivedDate.getMonth() + count);
  } else if (unit.startsWith('year')) {
    derivedDate.setFullYear(derivedDate.getFullYear() + count);
  } else if (unit.startsWith('day')) {
    derivedDate.setDate(derivedDate.getDate() + count);
  }

  const d = String(derivedDate.getDate()).padStart(2, '0');
  const m = String(derivedDate.getMonth() + 1).padStart(2, '0');
  const y = derivedDate.getFullYear();

  return {
    value: `${d}/${m}/${y}`,
    isDerived: true,
    shelfLifeStatement: `${count} ${unit}s from manufacture`,
    note: `Derived from shelf life (${count} ${unit}s from ${mfgDateFormatted})`
  };
}

/**
 * Validates manufacturing and expiry dates against calendar today.
 * Returns comprehensive validation verdict:
 * - isValid: boolean
 * - isExpired: boolean
 * - status: 'valid' | 'expired' | 'invalid_sequence' | 'future_mfg' | 'missing'
 * - message: string (Plain language verdict)
 * - daysRemaining: number | null
 * - serverDate: string (YYYY-MM-DD)
 */
export function validatePackageDates(mfgDateStr, expDateStr, referenceDate = new Date()) {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const serverDateFormatted = today.toISOString().split('T')[0];

  const mfgParsed = parsePackagingDate(mfgDateStr);
  const expParsed = parsePackagingDate(expDateStr);

  // Missing date checks
  if (!mfgParsed && !expParsed) {
    return {
      isValid: false,
      isExpired: false,
      status: 'missing',
      message: '⚠ Manufacturing Date and Expiry Date Not Detected',
      mfgStatus: 'Not Detected',
      expStatus: 'Not Detected',
      daysRemaining: null,
      serverDate: serverDateFormatted
    };
  }

  if (!expParsed) {
    const isMfgFuture = mfgParsed && mfgParsed.date > today;
    return {
      isValid: !isMfgFuture,
      isExpired: false,
      status: isMfgFuture ? 'future_mfg' : 'missing_expiry',
      message: isMfgFuture ? '❌ Manufacturing date is in the future' : '⚠ Expiry Date / Best Before Not Detected',
      mfgStatus: isMfgFuture ? 'Invalid (Future Date)' : 'Detected',
      expStatus: 'Not Detected',
      daysRemaining: null,
      serverDate: serverDateFormatted
    };
  }

  if (!mfgParsed) {
    const isExpired = expParsed.date < today;
    const diffTime = expParsed.date.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      isValid: !isExpired,
      isExpired: isExpired,
      status: isExpired ? 'expired' : 'missing_mfg',
      message: isExpired ? '⚠ PRODUCT EXPIRED' : '⚠ Manufacturing Date Not Detected (Expiry Present)',
      mfgStatus: 'Not Detected',
      expStatus: isExpired ? `Expired (${Math.abs(daysRemaining)} days ago)` : `Valid (${daysRemaining} days remaining)`,
      daysRemaining: daysRemaining,
      serverDate: serverDateFormatted
    };
  }

  // Both dates are present
  const mfgDate = mfgParsed.date;
  const expDate = expParsed.date;

  // 1. Sequence check: Manufacturing Date must be before Expiry Date
  if (mfgDate > expDate) {
    return {
      isValid: false,
      isExpired: false,
      status: 'invalid_sequence',
      message: '❌ Manufacturing date is later than expiry date',
      mfgStatus: 'Sequence Error',
      expStatus: 'Sequence Error',
      daysRemaining: null,
      serverDate: serverDateFormatted
    };
  }

  // 2. Future Mfg check: Manufacturing Date cannot be in the future
  if (mfgDate > today) {
    return {
      isValid: false,
      isExpired: false,
      status: 'future_mfg',
      message: '❌ Manufacturing date is in the future',
      mfgStatus: 'Invalid (Future Date)',
      expStatus: 'Pending',
      daysRemaining: null,
      serverDate: serverDateFormatted
    };
  }

  // 3. Expiry comparison
  const isExpired = expDate < today;
  const diffTime = expDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isExpired) {
    return {
      isValid: false,
      isExpired: true,
      status: 'expired',
      message: `⚠ PRODUCT EXPIRED (Expired by ${Math.abs(daysRemaining)} days relative to today)`,
      mfgStatus: 'Valid',
      expStatus: `Expired on ${expParsed.formatted}`,
      daysRemaining: daysRemaining,
      serverDate: serverDateFormatted
    };
  }

  return {
    isValid: true,
    isExpired: false,
    status: 'valid',
    message: `✓ Product currently within validity period (${daysRemaining} days remaining)`,
    mfgStatus: 'Valid',
    expStatus: `Valid until ${expParsed.formatted} (${daysRemaining} days remaining)`,
    daysRemaining: daysRemaining,
    serverDate: serverDateFormatted
  };
}

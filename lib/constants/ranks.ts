// ============================================
// SHIP CREW RANKS (Merchant Marine)
// Industry standard format (capital letters as in crew lists)
// ============================================
export const SHIP_RANKS = {
  "Deck Department": [
    "MASTER",
    "CHIEF OFFICER",
    "2ND OFFICER",
    "3RD OFFICER",
    "DECK CADET",
    "BOSUN",
    "A/B",
    "O/S",
    "PUMPMAN",
    "DK. FITTER",
  ],
  "Engine Department": [
    "CHIEF ENGINEER",
    "2ND ENGINEER",
    "3RD ENGINEER",
    "4TH ENGINEER",
    "ENGINE CADET",
    "ETO",
    "ELECTRICIAN",
    "ENG. FITTER",
    "MOTORMAN",
    "OILER",
    "WIPER",
  ],
  "Catering Department": [
    "CHIEF COOK",
    "COOK",
    "MESSMAN",
    "STEWARD",
  ],
  "Other": [
    "RADIO OFFICER",
    "MEDICAL OFFICER",
    "SECURITY OFFICER",
    "SPECIALIST",
  ],
};

// ============================================
// YACHT CREW POSITIONS
// ============================================
export const YACHT_POSITIONS = {
  "Deck": [
    "CAPTAIN",
    "FIRST OFFICER",
    "SECOND OFFICER",
    "BOSUN",
    "LEAD DECKHAND",
    "DECKHAND",
  ],
  "Interior": [
    "CHIEF STEWARDESS",
    "SECOND STEWARDESS",
    "THIRD STEWARDESS",
    "STEWARDESS",
    "JUNIOR STEWARDESS",
    "SOLE STEWARDESS",
    "PURSER",
  ],
  "Engineering": [
    "CHIEF ENGINEER",
    "SECOND ENGINEER",
    "THIRD ENGINEER",
    "ENGINEER",
    "ETO",
    "AV/IT OFFICER",
  ],
  "Galley": [
    "HEAD CHEF",
    "SOUS CHEF",
    "CHEF",
    "CREW COOK",
  ],
  "Other": [
    "WATERSPORTS INSTRUCTOR",
    "SPA THERAPIST",
    "NANNY",
    "PERSONAL TRAINER",
    "HAIRDRESSER",
    "SECURITY OFFICER",
  ],
};

// Helper to get flat list
export function getAllShipRanks(): string[] {
  return Object.values(SHIP_RANKS).flat();
}

export function getAllYachtPositions(): string[] {
  return Object.values(YACHT_POSITIONS).flat();
}

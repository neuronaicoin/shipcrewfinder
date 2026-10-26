import type { Metadata } from 'next';

// SEO + AI-search content for every Crew Toolkit page under /tools/<slug>.
// Each entry describes what the tool actually does (checked against its page.tsx),
// so keep it in sync if a tool's inputs or outputs change.

export const SITE_URL = 'https://shipcrewfinder.com';
const BRAND = 'ShipCrewFinder';

export type ToolCategory = 'Calculator' | 'Tracking tool' | 'Reference guide';

export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolSeoEntry {
  slug: string;
  /** Short display name, used in breadcrumbs and related-tool links. */
  name: string;
  /** Keyword-led title, without the brand suffix (full title stays within 60 chars). */
  title: string;
  /** Meta description, 140-160 characters. */
  description: string;
  category: ToolCategory;
  /** 2-3 sentences: what the tool is and what it covers. */
  about: string;
  steps: string[];
  faqs: ToolFaq[];
  related: string[];
  /** Max width of the tool's own content column, so the SEO block lines up with it. */
  width?: number;
  /** Core use is free with no time limit. False = free trial, then paid upgrade. */
  free?: boolean;
}

export const TOOL_SEO: ToolSeoEntry[] = [
  // ---------------------------------------------------------------- Calculators
  {
    slug: 'draft-survey-pro',
    name: 'Draft Survey Calculator Pro',
    title: 'Draft Survey Calculator: Initial & Final',
    description:
      'Full initial and final draft survey for bulk carriers: perpendicular corrections, quarter mean, first and second trim correction, density and cargo quantity.',
    category: 'Calculator',
    width: 900,
    about:
      'A complete draft survey workflow for bulk carriers that works from your own vessel\'s hydrostatic table. You enter port and starboard drafts at the forward, midship and aft marks for the initial and final survey, and the tool applies perpendicular corrections, the quarter mean (F + 6M + A) / 8, first and second trim corrections, dock water density and deductibles. It returns the cargo quantity, the calculated constant and a printable draft survey report.',
    steps: [
      'Enter the vessel particulars (LBP, keel thickness) and paste rows from your hydrostatic table: draft, displacement, TPC, MTC and LCF.',
      'For the initial survey, enter port and starboard drafts fore, midship and aft, the distances of the draft marks from the perpendiculars and the dock water density.',
      'Add the deductibles at the time of the survey: ballast water, fresh water, bunkers and others.',
      'Repeat for the final survey after loading or discharging; cargo quantity is the difference between the two net displacements.',
      'Check the warnings for unusual trim, hog/sag or port/starboard differences, then compare with the B/L figure and export the report as PDF.',
    ],
    faqs: [
      {
        q: 'Which draft survey method does this calculator use?',
        a: 'It follows the standard method used by surveyors: mean of port and starboard readings, corrections to the perpendiculars, the quarter mean draft (F + 6M + A) / 8, the first trim correction (trim x TPC x LCF x 100 / LBP), the second trim correction using the change in MTC over 1 m of draft, and a density correction against the table density of 1.025 t/m3.',
      },
      {
        q: 'Do I need my ship\'s hydrostatic tables?',
        a: 'Yes. The calculator interpolates displacement, TPC, MTC and LCF from rows you paste from your own stability booklet. You do not need every step of the table; a set of rows around the working draft range is enough for linear interpolation.',
      },
      {
        q: 'How is the ship\'s constant calculated?',
        a: 'If you enter the lightship weight, the tool shows the constant as the initial net displacement (after deductibles) minus lightship. Comparing it with the declared constant is a quick check on the quality of your soundings and draft readings.',
      },
      {
        q: 'Can I save the survey between the initial and final readings?',
        a: 'Yes. Vessel profiles and survey progress are stored in your browser, so you can close the page between the initial and final survey. Saving completed surveys to the history list beyond the first one requires an upgrade.',
      },
      {
        q: 'Can this replace the official draft survey or loading computer?',
        a: 'No. It is a planning and cross-check tool. The figure used for cargo settlement must come from your approved procedure, the class-approved loading computer or stability booklet, and the independent surveyor.',
      },
    ],
    related: ['draft-survey', 'interpolation-table', 'stability', 'cargo'],
  },
  {
    slug: 'draft-survey',
    name: 'Draft Survey Calculator',
    title: 'Quick Draft Survey Calculator for Ships',
    description:
      'Quick draft survey: hog/sag corrected mean draft, first trim correction at LCF, density correction and cargo quantity after deductibles. Every step shown.',
    category: 'Calculator',
    width: 680,
    about:
      'A single-condition draft survey calculator that shows every step of the working. From forward, midship and aft drafts plus LBP, LCF and TPC, it gives the trim, a mean draft corrected for hog or sag and the first trim correction. You then enter the displacement from your hydrostatic table and the deductibles to get the estimated cargo quantity.',
    steps: [
      'Enter the observed forward, midship and aft drafts in metres.',
      'Enter LBP, LCF (from midship) and TPC from the stability book at the approximate draft.',
      'Look up the displacement at the corrected mean draft in your hydrostatic table and enter it with the dock water density.',
      'Enter lightship, constant, fuel oil, diesel oil, fresh water, ballast and other deductibles to see the cargo quantity.',
    ],
    faqs: [
      {
        q: 'What corrections does the quick draft survey apply?',
        a: 'It applies a hog/sag correction to the mean draft, the first trim correction at the LCF and a density correction to the table displacement (actual density / 1.025). It does not apply the second trim correction or corrections to the perpendiculars.',
      },
      {
        q: 'When should I use the Draft Survey Pro instead?',
        a: 'Use the Pro version for cargo settlement work: it takes port and starboard drafts, mark distances, the quarter mean (F + 6M + A) / 8, the second trim correction, initial and final surveys and produces a report.',
      },
      {
        q: 'How is the density correction calculated?',
        a: 'Hydrostatic tables are normally based on salt water of 1.025 t/m3. The tool multiplies the table displacement by actual dock water density divided by 1.025 to get the displacement in the water the ship is floating in.',
      },
      {
        q: 'Are my inputs stored?',
        a: 'Only if you press Save. The values are then kept in your browser\'s local storage on that device, not on our servers.',
      },
    ],
    related: ['draft-survey-pro', 'interpolation-table', 'stability', 'unit-converter'],
  },
  {
    slug: 'interpolation-table',
    name: 'Interpolation Calculator',
    title: 'Interpolation Calculator for Tank Tables',
    description:
      'Linear interpolation for sounding, ullage, trim correction and hydrostatic tables. Enter two reference points and their values to get the result instantly.',
    category: 'Calculator',
    width: 460,
    about:
      'A linear interpolation calculator for the tables officers and engineers use every day: tank sounding and ullage tables, trim correction tables, hydrostatic particulars and fuel calibration tables. Enter the two table entries either side of your value and their figures, and it returns the interpolated result to three decimals.',
    steps: [
      'Find the two table entries either side of your actual value (for example trim -0.50 m and +1.00 m).',
      'Enter them as Trim A and Trim B, then enter your actual trim or sounding.',
      'Enter the table value at A and at B.',
      'Read the interpolated result; the formula used is shown under the result.',
    ],
    faqs: [
      {
        q: 'What formula does the interpolation calculator use?',
        a: 'Straight-line interpolation: Result = A + (B - A) x (Target - TrimA) / (TrimB - TrimA). It assumes the table values change linearly between the two reference points, which is the normal practice for sounding and hydrostatic tables.',
      },
      {
        q: 'Can I use it for sounding and ullage tables, not just trim?',
        a: 'Yes. The labels say trim, but any two-point table works: sounding to volume, draft to displacement, temperature to density correction and so on.',
      },
      {
        q: 'Can it extrapolate outside the table range?',
        a: 'Mathematically it will, but extrapolating beyond the tabulated range is not reliable for tank or hydrostatic data. Always pick reference points that bracket your value.',
      },
      {
        q: 'Is anything saved?',
        a: 'No. The calculation runs in your browser and nothing is stored.',
      },
    ],
    related: ['draft-survey', 'oil-record-book', 'unit-converter', 'tide'],
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    title: 'Marine Unit Converter: kW, Knots, Barrels',
    description:
      'Convert units used on board: kW to HP, knots to km/h, m3 to barrels and US gallons, metric to long tons, metres to fathoms, bar to PSI, Celsius to Fahrenheit.',
    category: 'Calculator',
    width: 460,
    about:
      'A unit converter built around the conversions that come up on watch and in the engine room. It covers power (kW, HP), speed (knots, km/h, mph), volume (m3, barrels, US gallons), weight (metric tons, long tons, kg, lbs), length (metres, feet, fathoms), pressure (bar, PSI, kPa) and temperature (Celsius, Fahrenheit).',
    steps: [
      'Choose a category: power, speed, volume, weight, length, pressure or temperature.',
      'Type the value you want to convert.',
      'Pick the unit you are converting from and the unit you want.',
      'Read the result, shown to three decimals.',
    ],
    faqs: [
      {
        q: 'How many horsepower is 1 kW?',
        a: 'The converter uses mechanical horsepower: 1 kW = 1.341 HP. Note that engine makers sometimes quote metric horsepower (PS), where 1 kW = 1.360 PS; that unit is not included.',
      },
      {
        q: 'How many barrels are in one cubic metre?',
        a: 'One cubic metre is 6.290 US oil barrels and 264.17 US gallons. For bunker and cargo figures, remember that converting volume to weight also needs density at the right temperature.',
      },
      {
        q: 'What is the difference between a metric ton and a long ton?',
        a: 'A metric ton (MT) is 1,000 kg. A long ton (LT) is 1,016 kg, so 1 MT = 0.984 LT. Long tons still appear in some charter parties and older ship documents.',
      },
      {
        q: 'How do I convert knots to km/h?',
        a: 'One knot is one nautical mile per hour, which is 1.852 km/h or 1.151 mph. The converter handles this directly in the speed category.',
      },
    ],
    related: ['interpolation-table', 'distance-eta', 'cii-calculator', 'cargo'],
  },
  {
    slug: 'distance-eta',
    name: 'Distance & ETA Calculator',
    title: 'Port Distance, ETA & Fuel Calculator',
    description:
      'Great-circle distance and initial course between two ports, plus days at sea, fuel use and bunker cost at 10-16 knots and an ETA from your departure time.',
    category: 'Calculator',
    width: 640,
    about:
      'A voyage estimate tool for quick passage planning and commercial checks. Pick two ports to get the great-circle distance in nautical miles and the initial bearing. Enter your base speed, daily consumption and bunker price, and it builds a table for 10, 12, 14 and 16 knots with days at sea, fuel per day, total fuel, fuel cost and ETA.',
    steps: [
      'Search and select the departure port and the arrival port.',
      'Read the great-circle distance and the initial bearing.',
      'Enter your base speed, consumption at that speed (MT/day) and bunker price ($/MT).',
      'Optionally add a departure date and time to see the ETA for each speed in the comparison table.',
    ],
    faqs: [
      {
        q: 'Is the distance the actual sailing distance?',
        a: 'No. It is the great-circle (shortest) distance between the two port positions. Real routes are longer because they go around land, through canals and along traffic schemes, so add a margin or use a routed distance table for voyage orders.',
      },
      {
        q: 'How is fuel consumption at other speeds estimated?',
        a: 'It uses the cube law: daily consumption changes with the cube of the speed ratio, so going from 12.5 to 10 knots cuts daily consumption to about 51%. Real figures depend on draft, hull condition and weather.',
      },
      {
        q: 'How is the ETA calculated?',
        a: 'Days at sea = distance / (speed x 24). The ETA adds that time to your departure date and time. It does not account for port stays, canal transits or time zone changes.',
      },
      {
        q: 'Can I use it for CII or emissions planning?',
        a: 'The total fuel figure is a useful input. For a carbon intensity rating, use the CII calculator, which converts fuel to CO2 and compares it with the required CII for your ship type.',
      },
    ],
    related: ['cii-calculator', 'ports', 'tide', 'unit-converter'],
  },
  {
    slug: 'cii-calculator',
    name: 'CII / EU ETS / FuelEU Calculator',
    title: 'CII Calculator with EU ETS & FuelEU Cost',
    description:
      'Estimate your ship\'s CII rating (A to E) from fuel use and distance, plus EU ETS allowance cost and FuelEU Maritime GHG intensity and penalty exposure.',
    category: 'Calculator',
    width: 640,
    about:
      'A planning calculator for the IMO Carbon Intensity Indicator and the two EU measures that now affect most voyages to Europe. From ship type, DWT or GT, annual distance and fuel consumed by grade, it estimates attained and required CII and an A to E rating. It also estimates EU ETS cost for intra-EU or EU to non-EU voyages and FuelEU Maritime well-to-wake GHG intensity against the 2% reduction target.',
    steps: [
      'Select the ship type and reporting year, and enter DWT and GT.',
      'Enter the annual distance sailed and, if you are entering one voyage\'s fuel, that voyage distance so it can be scaled to a year.',
      'Add each fuel grade burned (HFO, VLSFO, MGO, LNG, methanol and others) with the tonnes consumed.',
      'Choose the EU ETS voyage type and the EUA price, and tick FuelEU Maritime if it applies.',
      'Read the CII rating, attained versus required CII, ETS cost and FuelEU status or penalty.',
    ],
    faqs: [
      {
        q: 'How is the CII calculated?',
        a: 'Attained CII = total CO2 emitted / (capacity x distance sailed), in grams of CO2 per tonne-mile. CO2 comes from fuel burned multiplied by the IMO carbon factor for each fuel, for example 3.114 for HFO and 3.206 for MGO. Required CII is the ship type reference line reduced by the yearly reduction factor from MEPC guidelines.',
      },
      {
        q: 'What does an A to E CII rating mean?',
        a: 'Under MARPOL Annex VI, ships of 5,000 GT and above get an annual operational carbon intensity rating. A ship rated D for three years in a row, or E in a single year, must submit a corrective action plan as part of its SEEMP III.',
      },
      {
        q: 'How much of my voyage is covered by the EU ETS?',
        a: 'Emissions on voyages between two EU ports are 100% covered, and voyages between an EU and a non-EU port are 50% covered. Shipping companies surrender allowances for 40% of 2024 emissions, 70% of 2025 emissions and 100% from 2026.',
      },
      {
        q: 'What is the FuelEU Maritime target?',
        a: 'FuelEU Maritime (Regulation (EU) 2023/1805) limits the well-to-wake GHG intensity of energy used on board against a baseline of 91.16 gCO2e/MJ: 2% lower from 2025, 6% from 2030, rising to 80% by 2050. The penalty is EUR 2,400 per tonne of VLSFO-equivalent energy in deficit.',
      },
      {
        q: 'Is this rating official?',
        a: 'No. It is an estimate for planning. The official CII rating is issued by the flag Administration or its recognised organisation from your verified IMO DCS data.',
      },
    ],
    related: ['distance-eta', 'unit-converter', 'oil-record-book', 'claims'],
  },
  {
    slug: 'stability',
    name: 'Stability Calculator',
    title: 'Ship Stability Calculator: GM, Trim, List',
    description:
      'Weight-table stability check: displacement, KG, GM with free surface correction, trim, list and approximate mean draft, from your stability book figures.',
    category: 'Calculator',
    width: 700,
    about:
      'A weight-table stability calculator using the same method as a loading condition in your stability booklet. You enter lightship, each deadweight item with its LCG, VCG, TCG and free surface moment, and the hydrostatic data (KM, MTC, TPC, LCF). It works out displacement, solid and fluid GM, trim, list angle and an approximate mean draft, and flags GM below 0.15 m.',
    steps: [
      'Enter KM, MTC, TPC and LCF from your hydrostatic tables at the approximate draft.',
      'Enter lightship weight, LCG, VCG and lightship draft.',
      'Fill in each cargo hold, bunker, fresh water, ballast and constant item with weight, LCG, VCG, TCG and FSM for slack tanks.',
      'Read displacement, GM (free surface corrected), trim, list and approximate draft, and check the GM warning.',
    ],
    faqs: [
      {
        q: 'How is GM calculated with free surface correction?',
        a: 'KG = sum of vertical moments / displacement. The free surface correction is total free surface moment / displacement, added to KG to give the fluid KG. GM (fluid) = KM - fluid KG.',
      },
      {
        q: 'What is the minimum GM required by IMO?',
        a: 'The 2008 Intact Stability Code requires an initial metacentric height (GM0) of at least 0.15 m. It also sets GZ curve criteria (areas under the curve, GZ at 30 degrees, angle of maximum GZ) which this tool does not check, so a GM above 0.15 m alone does not prove full compliance.',
      },
      {
        q: 'How does the tool work out trim and list?',
        a: 'Trim = displacement x (LCG - LCF) / MTC, giving centimetres by the head or stern. List uses tan(list) = TCG / GM, which is accurate for small angles only.',
      },
      {
        q: 'Which sign convention should I use?',
        a: 'Positive LCG is forward of midships and positive TCG is to starboard. Use the same convention as your stability booklet for all entries, including LCF.',
      },
      {
        q: 'Can this replace the loading computer?',
        a: 'No. It is a planning and cross-check aid. Always confirm the condition with the vessel\'s approved loading computer or stability booklet before cargo or ballast operations.',
      },
    ],
    related: ['draft-survey', 'lashing', 'heavy-weather', 'interpolation-table'],
  },
  {
    slug: 'lashing',
    name: 'Cargo Lashing Calculator',
    title: 'Cargo Lashing Calculator: Sliding & Tipping',
    description:
      'Simplified cargo securing check for transverse and longitudinal sliding and tipping, using lashing MSL, angles, friction and position. Based on the CSS Code.',
    category: 'Calculator',
    width: 680,
    about:
      'A planning calculator for securing heavy units and break bulk cargo, based on the CSS Code approach of balancing external forces against friction and lashing strength. You enter cargo weight, deck position, optional GM, the friction surface and each lashing\'s MSL, vertical and horizontal angle and count. It returns pass or fail for transverse sliding, longitudinal sliding and, if you add height and base width, tipping.',
    steps: [
      'Enter the cargo weight, its position (forward, midships, aft) and optionally the vessel GM.',
      'Choose the friction surface between cargo and deck, or enter your own friction coefficient.',
      'Add each lashing with its MSL in kN, vertical angle, horizontal angle and number of identical lashings.',
      'Optionally enter the height to the cargo centre of gravity and the transverse base width for a tipping check.',
      'Review the pass/fail results and adjust lashings or friction until all checks pass.',
    ],
    faqs: [
      {
        q: 'What accelerations does the lashing calculator assume?',
        a: 'It uses fixed design accelerations of 0.5 g transverse and 0.3 g longitudinal, increased by 10% for stowage forward or aft and scaled between 0.8 and 1.3 by the GM you enter. These are simplified values, not the full acceleration table in CSS Code Annex 13.',
      },
      {
        q: 'What friction coefficients are used?',
        a: 'Steel on steel 0.10, steel on wood or dunnage 0.30, wood on wood 0.40 and rubber anti-slip mat 0.60, or a custom value. The vertical component of each lashing also adds friction by pressing the cargo down.',
      },
      {
        q: 'Does it use MSL or calculated strength (CS)?',
        a: 'It uses the MSL you enter directly. The CSS Code advanced calculation uses CS = MSL / 1.5, so if you want that safety margin, enter MSL divided by 1.5.',
      },
      {
        q: 'Is this enough for a cargo securing approval?',
        a: 'No. It is a rule-of-thumb planning aid. Always follow the ship\'s approved Cargo Securing Manual (required under SOLAS chapters VI and VII), and use the full Annex 13 calculation or a naval architect for heavy or unusual cargo.',
      },
    ],
    related: ['stability', 'cargo', 'heavy-weather', 'imdg'],
  },
  // ------------------------------------------------------------- Tracking tools
  {
    slug: 'cargo',
    name: 'Cargo Database',
    title: 'Bulk Cargo Database: Stowage Factor & IMSBC',
    description:
      'Stowage factors, IMSBC Code groups (A, B, C), hazards and carriage notes for 68 bulk and break bulk cargoes, plus a hold volume and cargo quantity calculator.',
    category: 'Tracking tool',
    width: 760,
    about:
      'A searchable reference of common bulk and break bulk cargoes with stowage factor ranges, IMSBC Code group, angle of repose, UN number where relevant, main hazards and care notes. It includes a stowage calculator that converts cargo tonnes to required hold volume, or available volume to tonnes, with an allowance for broken stowage.',
    steps: [
      'Search by cargo name or hazard (for example iron ore, nickel, liquefaction), or filter by category and IMSBC group.',
      'Tap a cargo to see its stowage factor range, hazards and care notes; its average stowage factor is loaded into the calculator.',
      'In the stowage calculator choose Qty to Volume or Volume to Qty.',
      'Enter the broken stowage percentage and the cargo quantity or available hold volume to get the result.',
    ],
    faqs: [
      {
        q: 'What do IMSBC Group A, B and C mean?',
        a: 'Under the IMSBC Code (mandatory under SOLAS chapter VI), Group A cargoes may liquefy if shipped above their transportable moisture limit, Group B cargoes have a chemical hazard, and Group C cargoes are neither. Some cargoes are both A and B.',
      },
      {
        q: 'What is a stowage factor?',
        a: 'The volume one tonne of cargo occupies in the hold, in m3 per tonne. Dense cargoes such as iron ore are around 0.3-0.5 m3/t, while light cargoes such as grain or wood chips need much more space.',
      },
      {
        q: 'How does broken stowage affect the calculation?',
        a: 'Broken stowage is space lost between packages or around frames that cannot be filled. The calculator adds it on top of the volume needed (Qty to Volume) or deducts it from the usable volume (Volume to Qty).',
      },
      {
        q: 'Can I rely on these figures for loading?',
        a: 'Use them for planning only. The shipper\'s cargo declaration and certificates required by the IMSBC Code, including moisture content and TML for Group A cargoes, are the binding figures.',
      },
    ],
    related: ['imdg', 'lashing', 'draft-survey-pro', 'stability'],
  },
  {
    slug: 'documents',
    name: 'Documents Generator',
    title: 'NOR, SOF & Letter of Protest Templates',
    description:
      'Generate a Notice of Readiness, Statement of Facts, Letter of Protest, LOI, NAGO, Mate\'s Receipt or Notice of Tender from your vessel and port details.',
    category: 'Tracking tool',
    width: 760,
    about:
      'A template generator for the standard documents masters and chief officers issue in port. It covers the Notice of Readiness, Statement of Facts, Letter of Indemnity, Notice of Apparent Good Order, Mate\'s Receipt, Notice of Tender and Letters of Protest for scenarios such as shore-caused delay, weather delay, short-landed cargo, cargo damage, unsafe berth, NOR rejection and short bunker delivery.',
    steps: [
      'Choose the document type, and for a Letter of Protest pick the protest scenario.',
      'Enter vessel name, IMO, port, berth, master, date and time, recipient and reference.',
      'Add the document-specific details, such as the SOF chronology or the facts of the protest.',
      'Copy the generated text into your own letterhead or email, or save a draft in your browser.',
    ],
    faqs: [
      {
        q: 'When should a Notice of Readiness be tendered?',
        a: 'When the vessel has arrived at the place stated in the charter party and is ready in all respects to load or discharge. Laytime usually starts after the notice time allowed in the charter party, so check its NOR clause (for example WIBON, WIPON, WCCON) before tendering.',
      },
      {
        q: 'What is a Letter of Protest used for?',
        a: 'It puts on record a fact the master disputes or wants noted, such as delay caused by the terminal, cargo damage on receipt or a short delivery of bunkers, so that owners keep their rights for later claims under the charter party or with P&I.',
      },
      {
        q: 'Is a Letter of Indemnity safe to accept?',
        a: 'An LOI for delivery without original bills of lading or for a change of discharge port shifts risk to the party giving it, but the owner may still lose P&I cover if it is not in the wording agreed by the club. Check with owners and P&I before accepting one.',
      },
      {
        q: 'Is the Documents Generator free?',
        a: 'Generating and copying the text is free. PDF download and sharing include one free export, after which a paid upgrade is needed.',
      },
    ],
    related: ['claims', 'port-documentation', 'cargo', 'psc'],
  },
  {
    slug: 'maintenance',
    name: 'Maintenance Tracker',
    title: 'Ship Maintenance Tracker: Running Hours',
    description:
      'Track machinery running hours and calendar-based maintenance tasks. Each task shows due, due soon or overdue, sorted by urgency. Free, no signup needed.',
    category: 'Tracking tool',
    width: 720,
    about:
      'A simple planned maintenance tracker for engineers. You list equipment with current running hours, then add tasks due either by running hours or by calendar days. Each task is marked OK, Due Soon or Overdue and the list sorts itself so the most urgent jobs come first.',
    steps: [
      'Add each piece of equipment (main engine, auxiliary engines, purifiers, compressors) with its current running hours.',
      'Add a maintenance task, link it to the equipment and choose an interval by running hours or by calendar days.',
      'Enter when it was last done, as running hours or as a date.',
      'Check the status badges: tasks within 10% of their interval show Due Soon, past the interval show Overdue.',
    ],
    faqs: [
      {
        q: 'How does the tracker decide a task is due soon?',
        a: 'For hour-based tasks it is due soon when the remaining hours are 10% of the interval or less. For calendar tasks it is due soon at 10% of the interval or 3 days, whichever is greater.',
      },
      {
        q: 'Does the ISM Code require a planned maintenance system?',
        a: 'Yes. ISM Code section 10 requires the company to have procedures so the ship and its equipment are maintained, inspected at intervals and records kept, with critical equipment identified. This tracker is a personal aid, not a replacement for your ship\'s approved PMS.',
      },
      {
        q: 'Are my equipment and tasks saved?',
        a: 'No. Nothing is saved between visits, so it is best used as a quick working list during a watch or for planning.',
      },
      {
        q: 'Can I track tasks by both hours and dates?',
        a: 'Each task uses one interval type. If a job is due at whichever comes first, add it twice: once by running hours and once by calendar days.',
      },
    ],
    related: ['oil-record-book', 'ism', 'psc', 'unit-converter'],
  },
  {
    slug: 'oil-record-book',
    name: 'Oil Record Book Generator',
    title: 'Oil Record Book Part I Entry Generator',
    description:
      'Write MARPOL Annex I Oil Record Book Part I entries for sludge, bilge, bunkering, OWS failure and accidental discharge, with tank quantities tracked for you.',
    category: 'Tracking tool',
    width: 900,
    free: false,
    about:
      'A helper for engineers writing Oil Record Book Part I (machinery space operations) entries. You set up your sludge, bilge, fuel and lubricating oil tanks with capacities and current quantities, then choose an operation. It formats the entry with the right code and item numbers, such as C 11 for the weekly sludge inventory, D for bilge operations and H for bunkering, and updates tank quantities as you go.',
    steps: [
      'Set up the vessel and add your tanks with capacity and current quantity.',
      'Choose an operation: sludge inventory, transfer, disposal or incineration, bilge pumping, bunkering, OWS failure or accidental discharge.',
      'Fill in the date, quantities, times, positions or port as the operation requires.',
      'Review the formatted log lines with code and item numbers, then print or export as PDF.',
    ],
    faqs: [
      {
        q: 'Which codes are used in Oil Record Book Part I?',
        a: 'MARPOL Annex I uses letter codes: A and B for ballasting and cleaning of fuel tanks, C for collection, transfer and disposal of oil residues (sludge), D for non-automatic discharge or disposal of bilge water, E for automatic bilge discharge, F for the condition of oil filtering equipment, G for accidental or exceptional discharges, H for bunkering of fuel or bulk lube oil and I for additional operational procedures.',
      },
      {
        q: 'How should the weekly sludge inventory be recorded?',
        a: 'Under code C 11, record the identity of each oil residue tank (11.1), its capacity (11.2) and total quantity retained (11.3). The generator produces these lines from your tank list.',
      },
      {
        q: 'Who signs Oil Record Book entries?',
        a: 'Each completed operation is signed by the officer or officers in charge, and each completed page is signed by the master. The book must be kept on board for three years after the last entry and is routinely checked during Port State Control.',
      },
      {
        q: 'Is the Oil Record Book generator free?',
        a: 'It starts with a free trial covering a limited number of tanks and log entries over 100 hours. Continued use requires a paid upgrade.',
      },
    ],
    related: ['maintenance', 'psc', 'bwm', 'cii-calculator'],
  },
  {
    slug: 'ports',
    name: 'Ports Database',
    title: 'Port Database: Draft, Pilotage & VHF',
    description:
      'Quick reference for 26 major hub ports: max draft, LOA, terminals, pilotage, VHF channels, working hours and timezone, plus official PSC history links.',
    category: 'Tracking tool',
    width: 680,
    about:
      'A reference card for 26 of the world\'s major hub ports across Asia, the Middle East, Europe, the Americas, Africa and Oceania. Each port shows maximum draft and LOA, main terminals, whether pilotage is compulsory, VHF channels, working hours, timezone and coordinates. It also links straight to Equasis, Paris MoU, Tokyo MoU and IMO GISIS for ship inspection history.',
    steps: [
      'Search by port name, country or UN/LOCODE, or filter by region.',
      'Check draft, LOA, pilotage and VHF on the port card.',
      'Open the card for terminals, working hours, timezone and port notes.',
      'Use the official PSC links to check a ship\'s inspection record before arrival.',
    ],
    faqs: [
      {
        q: 'Which ports are included?',
        a: 'Twenty-six major hub ports and passages, including Singapore, Shanghai, Rotterdam, Antwerp, Jebel Ali, Houston, Santos, Durban, the Suez and Panama Canals and several Istanbul and Izmit Bay locations, grouped into six regions. Each has its UN/LOCODE so you can search by code.',
      },
      {
        q: 'Are the drafts and VHF channels up to date?',
        a: 'They are a general reference. Drafts, restrictions and channels change, so always confirm with current Notices to Mariners, the port authority and your agent before arrival.',
      },
      {
        q: 'How do I check a ship\'s PSC inspection history?',
        a: 'Equasis gives a free summary across regimes after registration, while the Paris MoU and Tokyo MoU (APCIS) public databases show inspections and detentions in their regions. The port cards link to each.',
      },
      {
        q: 'Does it show visa rules for crew in each port?',
        a: 'Each port card links to the Visa Requirements tool, which covers shore leave, sign-on/off and airport transit for 14 major maritime countries and regions.',
      },
    ],
    related: ['distance-eta', 'visa', 'psc', 'port-documentation'],
  },
  {
    slug: 'tide',
    name: 'Tide Calculator',
    title: 'Tide & Under-Keel Clearance Calculator',
    description:
      'Interpolate tide height at any time from HW/LW times, check under-keel clearance against charted depth and find safe tidal windows on a tide curve chart.',
    category: 'Tracking tool',
    width: 680,
    about:
      'A tidal window calculator for berth and channel passages. You enter the day\'s high and low water times and heights from your tide table, plus draft, required UKC and charted depth. It draws a tide curve, tells you whether a given time is safe and lists every window when the depth available is at least the depth required.',
    steps: [
      'Enter the HW and LW times and heights for the day from official tide predictions.',
      'Enter your draft, required under-keel clearance and the charted depth at chart datum.',
      'Check the tide curve: the dashed line shows the tide height needed for safe UKC.',
      'Enter a time to check it, or read the safe windows list for the start, end and duration of each window.',
    ],
    faqs: [
      {
        q: 'How does the tide calculator interpolate between HW and LW?',
        a: 'It uses a cosine curve between each pair of high and low waters, which approximates the shape of a normal semi-diurnal tide better than a straight line. Admiralty tidal curves for a specific port remain more accurate.',
      },
      {
        q: 'How is under-keel clearance checked?',
        a: 'Depth available = charted depth + height of tide. Depth required = draft + required UKC. A time is safe when depth available is equal to or greater than depth required.',
      },
      {
        q: 'What does it not account for?',
        a: 'Squat, heel, storm surge, barometric pressure effects and secondary port corrections are not included. Allow for these in your required UKC figure according to your company\'s UKC policy.',
      },
      {
        q: 'Where should the tide times come from?',
        a: 'From official predictions such as Admiralty Tide Tables or TotalTide, NOAA or the national hydrographic office for the port.',
      },
    ],
    related: ['ports', 'draft-survey', 'distance-eta', 'interpolation-table'],
  },
  {
    slug: 'visa',
    name: 'Visa Requirements',
    title: 'Seafarer Visa Guide: Shore Leave & Transit',
    description:
      'Seafarer visa guidance for shore leave, sign-on/off and airport transit in 14 maritime countries and regions, including the US C1/D, Schengen, UK and UAE.',
    category: 'Tracking tool',
    width: 680,
    about:
      'A quick visa reference for crew changes and shore leave. It covers the United States, the Schengen Area, the United Kingdom, UAE, Singapore, China, South Korea, India, Brazil, Panama, Australia, South Africa, Egypt and Turkiye, showing whether a visa is required for shore leave, sign-on/off and airport transit, the typical documents and practical notes.',
    steps: [
      'Search for the country or region of the port or airport.',
      'Check the three status pills for shore leave, sign-on/off and airport transit.',
      'Open the card to see the typical documents and notes.',
      'Confirm the requirement for your nationality with the local agent and the embassy or consulate before travel.',
    ],
    faqs: [
      {
        q: 'Do seafarers need a visa for US shore leave?',
        a: 'Yes. Foreign crew need a C1/D visa for shore leave, crew change and transit in the United States. There is no visa waiver for seafarers, and CBP decides shore leave case by case.',
      },
      {
        q: 'What documents does a seafarer need for crew change?',
        a: 'A valid passport and Seafarer\'s Identity Document or discharge book are the baseline everywhere, usually with a letter of guarantee or appointment from the company or agent, plus a visa where required.',
      },
      {
        q: 'Does the FAL Convention give seafarers a right to shore leave?',
        a: 'The IMO FAL Convention says shore leave should be allowed without discrimination by nationality, and MLC 2006 Regulation 2.4 also covers shore leave. Each state still applies its own immigration rules.',
      },
      {
        q: 'Why does the answer depend on my nationality?',
        a: 'Visa rules are set by each country for each nationality, and they change often. The tool gives orientation only; the agent and the embassy give the binding answer for your passport and dates.',
      },
    ],
    related: ['port-documentation', 'ports', 'itf', 'mlc'],
  },
  {
    slug: 'claims',
    name: 'Claim Center',
    title: 'Demurrage & Off-Hire Claim Calculator',
    description:
      'Calculate demurrage and despatch, off-hire, speed and consumption claims, and track charter party time bars with a countdown. Shows the net owner position.',
    category: 'Tracking tool',
    width: 760,
    about:
      'A claims worksheet for masters, operators and superintendents. Add demurrage and despatch, off-hire, speed and consumption or other claims, and it values each one and shows the net position between owner and charterer. Each claim has a time-bar countdown from the event end date, using the number of days in your charter party.',
    steps: [
      'Add a claim and choose the type: demurrage/despatch, off-hire, speed/consumption or other.',
      'Enter the figures: laytime allowed and used with rates, hours off-hire with hire rate and bunkers, or good weather days with warranted and actual speed and consumption.',
      'Enter the event end date and the time bar in days from your charter party.',
      'Review each claim value, the days left before the time bar, and the net position.',
    ],
    faqs: [
      {
        q: 'How is demurrage calculated?',
        a: 'Demurrage = (laytime used - laytime allowed) in days x the daily demurrage rate. If laytime used is less than allowed, the tool calculates despatch on the time saved at the despatch rate, usually half the demurrage rate.',
      },
      {
        q: 'How is a speed and consumption claim worked out?',
        a: 'Over the good weather days, overconsumption = (actual - warranted daily consumption) x days, valued at the bunker price. Time lost = good weather days - time the same distance would take at warranted speed, valued at the hire rate.',
      },
      {
        q: 'What is a claim time bar?',
        a: 'The deadline in the charter party for presenting a claim with supporting documents. Many charter parties set 90 days for demurrage claims, and a claim presented late can be lost entirely, so the countdown starts from the end of the event.',
      },
      {
        q: 'Are claims saved?',
        a: 'No. Nothing is saved between visits, so copy the figures into your own claim file.',
      },
    ],
    related: ['documents', 'distance-eta', 'cii-calculator', 'port-documentation'],
  },
  // ---------------------------------------------------------- Reference guides
  {
    slug: 'psc',
    name: 'PSC Preparation',
    title: 'PSC Deficiency Codes & Inspection Prep',
    description:
      'Search Port State Control deficiency codes with convention references and detention risk, plus MoU inspection portals, action codes and CIC campaigns.',
    category: 'Reference guide',
    width: 760,
    about:
      'A Port State Control preparation reference built from public IMO, Paris MoU, Tokyo MoU and GISIS sources. It has a searchable list of deficiency codes with the convention reference, typical action, rectification and detention risk, plus links to the inspection databases of the regional MoUs, USCG and AMSA, the PSC action codes and recent Concentrated Inspection Campaign checklists.',
    steps: [
      'Search deficiency codes by code, description or convention, and filter by category or detention risk.',
      'Tap a deficiency for its convention reference, typical PSC action and how to rectify it.',
      'Use the MoU tab to open inspection search and detention lists for each regional regime.',
      'Check the CIC tab and work through the current campaign checklist before arrival.',
    ],
    faqs: [
      {
        q: 'Which PSC regimes are covered?',
        a: 'Paris MoU, Tokyo MoU, Black Sea, Mediterranean, Caribbean, Indian Ocean, Abuja and Riyadh MoUs, the Vina del Mar Agreement, USCG and AMSA, plus Equasis and IMO GISIS for cross-regime records.',
      },
      {
        q: 'What are the most common reasons for detention?',
        a: 'Expired or missing statutory certificates, ISM failures, fire safety and life-saving appliance defects, and MARPOL equipment problems are typical grounds. The detention risk filter highlights the deficiencies most likely to lead to detention.',
      },
      {
        q: 'What is a Concentrated Inspection Campaign?',
        a: 'A CIC is a three-month campaign, usually September to November, in which MoUs such as Paris and Tokyo focus inspections on one topic using a set questionnaire, for example fire safety systems or crew working conditions.',
      },
      {
        q: 'What does a PSC action code mean?',
        a: 'Each deficiency on the inspection report carries an action code saying what must happen, for example rectify before departure, rectify within 14 days, rectify at the next port or ship detained. Code 30 means the ship is detained.',
      },
    ],
    related: ['ism', 'solas', 'mlc', 'certificates'],
  },
  {
    slug: 'mlc',
    name: 'MLC 2006 Guide',
    title: 'MLC 2006 Guide: Seafarer Rights Explained',
    description:
      'MLC 2006 explained for seafarers: SEA, wages, rest hours, leave, repatriation, accommodation, food, medical care and the on-board complaint procedure.',
    category: 'Reference guide',
    width: 720,
    about:
      'A plain-language guide to the Maritime Labour Convention, 2006, organised by its five Titles. It explains minimum age, medical certificates, recruitment fees, the Seafarers\' Employment Agreement, wages, hours of work and rest, leave, repatriation, accommodation, food, medical care, shipowner liability, flag and port state enforcement, and how to make a complaint on board.',
    steps: [
      'Pick a Title: minimum requirements, conditions of employment, accommodation and food, health and welfare, or compliance.',
      'Read each regulation summary and the practical notes for crew.',
      'Compare with your own SEA and the ship\'s DMLC Part II for the exact figures that apply.',
      'If something is wrong, follow the complaint steps at the end of the page.',
    ],
    faqs: [
      {
        q: 'What are the MLC 2006 minimum rest hours?',
        a: 'Under Regulation 2.3, the minimum is 10 hours in any 24-hour period and 77 hours in any 7-day period. Rest can be split into no more than two periods, one of at least 6 hours, and the interval between consecutive rest periods must not exceed 14 hours.',
      },
      {
        q: 'Can a manning agency charge me a fee to get a job?',
        a: 'No. Regulation 1.4 says recruitment and placement services must not charge seafarers, directly or indirectly, for finding employment. Being asked to pay a placement fee is a red flag.',
      },
      {
        q: 'How much annual leave does MLC 2006 give?',
        a: 'Standard A2.4 sets paid annual leave at a minimum of 2.5 calendar days per month of employment. Your SEA or collective agreement can give more.',
      },
      {
        q: 'When am I entitled to repatriation?',
        a: 'When your SEA expires or is terminated, if you are unable to work because of illness or injury, and when the shipowner can no longer meet its obligations, for example in abandonment. The maximum period of service on board before repatriation must be less than 12 months, and repatriation is at no cost to you.',
      },
      {
        q: 'How do I make an MLC complaint?',
        a: 'Start with the ship\'s on-board complaint procedure, usually through the master. If it is not resolved, you can complain to the flag state or, in a foreign port, to port state control, without fear of victimisation.',
      },
    ],
    related: ['fatigue', 'itf', 'medical', 'visa'],
  },
  {
    slug: 'itf',
    name: 'ITF Guide',
    title: 'ITF Guide for Seafarers: Wages & Help',
    description:
      'What the ITF does for seafarers: ITF agreements and the Blue Certificate, ITF inspectors, unpaid wages, abandonment and contract disputes, and how to get help.',
    category: 'Reference guide',
    width: 720,
    about:
      'A guide to the International Transport Workers\' Federation for crew. It explains what ITF agreements are, what an ITF inspector can do when your ship is in port, how the ITF helps with unpaid wages, abandonment, contract disputes and recruitment fees, and what documents to have ready before you make contact.',
    steps: [
      'Read what the ITF is and how ITF agreements set minimum wages and conditions.',
      'Check what an ITF inspector can do on board, with or without an ITF agreement.',
      'Find your situation under Common Scenarios: unpaid wages, abandonment, contract disputes or fees.',
      'Collect your SEA, wage slips and correspondence, then contact the ITF inspector for the port or the ITF online.',
    ],
    faqs: [
      {
        q: 'What is an ITF Blue Certificate?',
        a: 'It shows the ship is covered by an ITF-acceptable collective agreement, so wages and conditions on board meet at least the ITF minimum standards for each rank.',
      },
      {
        q: 'Can an ITF inspector help if my ship has no ITF agreement?',
        a: 'Yes. Inspectors can board and help with specific complaints such as unpaid wages, abandonment or contract problems on any ship in port. You can ask to speak to the inspector confidentially.',
      },
      {
        q: 'What should I do if my crew is abandoned?',
        a: 'Contact the ITF, the flag state and the port state. Since 2017 MLC 2006 requires shipowners to have financial security covering up to four months of unpaid wages and repatriation in abandonment cases, and cases are recorded in the IMO/ILO abandonment database.',
      },
      {
        q: 'Is the ITF a government authority?',
        a: 'No. It is a global federation of transport workers\' unions. It works alongside flag and port states but does not replace their enforcement of MLC 2006.',
      },
    ],
    related: ['mlc', 'fatigue', 'visa', 'medical'],
  },
  {
    slug: 'solas',
    name: 'SOLAS Guide',
    title: 'SOLAS Guide: Fire, LSA, GMDSS & Drills',
    description:
      'SOLAS explained chapter by chapter for crew: surveys and certificates, fire protection, life-saving appliances, drills, GMDSS, navigation safety, ISM and ISPS.',
    category: 'Reference guide',
    width: 720,
    about:
      'A practical summary of the International Convention for the Safety of Life at Sea, focused on what matters on board. It covers Chapter I surveys and certificates, Chapter II-2 fire protection, Chapter III life-saving appliances and drills, Chapter IV GMDSS, Chapter V safety of navigation, and an overview of the cargo, ISM, ISPS, bulk carrier and Polar Code chapters.',
    steps: [
      'Choose a SOLAS chapter from the tabs.',
      'Read the summaries for that chapter, such as drill frequency or bridge equipment.',
      'Check the items against your own ship\'s certificates and SMS.',
      'Use the related guides for the ISM Code, ISPS Code and emergency procedures in more detail.',
    ],
    faqs: [
      {
        q: 'How often must abandon ship and fire drills be held under SOLAS?',
        a: 'SOLAS chapter III requires every crew member to take part in at least one abandon ship drill and one fire drill every month. If more than 25% of the crew have not taken part in drills on that ship in the previous month, drills must be held within 24 hours of leaving port.',
      },
      {
        q: 'What GMDSS equipment does a ship need?',
        a: 'It depends on the sea areas A1 to A4 the ship trades in. Typical equipment includes VHF DSC, a NAVTEX receiver, a satellite EPIRB, SARTs or AIS-SARTs, and MF/HF DSC or satellite terminals for areas A2 to A4.',
      },
      {
        q: 'Which certificates are issued under SOLAS?',
        a: 'Cargo ships carry the Safety Construction, Safety Equipment and Safety Radio certificates (or a combined Cargo Ship Safety Certificate). The Load Line Certificate is issued under the Load Line Convention, the ISM certificates under chapter IX and the ISSC under chapter XI-2.',
      },
      {
        q: 'Is ECDIS mandatory under SOLAS?',
        a: 'Yes for most ships on international voyages. SOLAS regulation V/19 phased in ECDIS carriage by ship type and size between 2012 and 2018.',
      },
    ],
    related: ['emergency', 'ism', 'isps', 'colregs'],
  },
  {
    slug: 'colregs',
    name: 'COLREGs Quick Reference',
    title: 'COLREGs Quick Reference for Watchkeepers',
    description:
      'COLREGs rules that matter on watch: look-out, safe speed, risk of collision, crossing, head-on and overtaking, restricted visibility, lights and sound signals.',
    category: 'Reference guide',
    width: 720,
    about:
      'A watchkeeper\'s quick reference to the International Regulations for Preventing Collisions at Sea, 1972. It summarises Rules 5 to 8 on look-out, safe speed and risk of collision, the steering and sailing rules (9, 10, 13 to 19), the lights rules for power-driven and anchored vessels, and the manoeuvring and restricted visibility sound signals.',
    steps: [
      'Choose a section: look-out and risk of collision, steering and sailing, lights and shapes, or sound signals.',
      'Read each rule summary with its rule number.',
      'Use it to refresh before a watch or an oral exam.',
      'Check the full COLREGs text and local regulations for complete wording.',
    ],
    faqs: [
      {
        q: 'Who gives way in a crossing situation?',
        a: 'Under Rule 15, when two power-driven vessels are crossing with risk of collision, the vessel that has the other on her own starboard side keeps out of the way and should avoid crossing ahead of her.',
      },
      {
        q: 'When is a vessel overtaking?',
        a: 'Rule 13: when coming up with another vessel from a direction more than 22.5 degrees abaft her beam. The overtaking vessel keeps out of the way until finally past and clear.',
      },
      {
        q: 'What do one, two and three short blasts mean?',
        a: 'Rule 34: one short blast means I am altering my course to starboard, two short blasts I am altering my course to port, three short blasts I am operating astern propulsion. Five or more short and rapid blasts signal doubt.',
      },
      {
        q: 'What sound signal does a power-driven vessel make in fog?',
        a: 'Rule 35: one prolonged blast at intervals of not more than 2 minutes when making way, and two prolonged blasts when underway but stopped and making no way.',
      },
      {
        q: 'How do you know if risk of collision exists?',
        a: 'Rule 7: if the compass bearing of an approaching vessel does not appreciably change, risk of collision is deemed to exist. Scanty radar information must not be relied on.',
      },
    ],
    related: ['solas', 'heavy-weather', 'emergency', 'fatigue'],
  },
  {
    slug: 'ism',
    name: 'ISM Code Guide',
    title: 'ISM Code Guide: SMS, DPA, DOC & SMC',
    description:
      'The ISM Code for crew: how the Safety Management System works, the DPA and master\'s authority, DOC and SMC certificates, non-conformities and internal audits.',
    category: 'Reference guide',
    width: 720,
    about:
      'A guide to the International Safety Management Code, made mandatory by SOLAS chapter IX. It explains what a Safety Management System must contain, the role of the Designated Person Ashore and the master\'s overriding authority, the Document of Compliance and Safety Management Certificate, and how crew report non-conformities, accidents and near misses.',
    steps: [
      'Read What Is ISM for the purpose of the Code and what every SMS must cover.',
      'Check Key Roles for the DPA and the master\'s authority.',
      'Read Certificates for the DOC, SMC and how they are verified.',
      'Use Reporting & Your Role to understand non-conformities and internal audits.',
    ],
    faqs: [
      {
        q: 'What is the Designated Person Ashore (DPA)?',
        a: 'ISM Code section 4 requires every company to appoint a DPA with direct access to the highest level of management. The DPA monitors safety and pollution prevention on each ship and is a contact for crew when safety concerns are not resolved on board.',
      },
      {
        q: 'What is the difference between the DOC and the SMC?',
        a: 'The Document of Compliance is issued to the company, confirming its SMS meets the ISM Code, with annual verification. The Safety Management Certificate is issued to each ship, valid up to five years with an intermediate verification.',
      },
      {
        q: 'What is a non-conformity under ISM?',
        a: 'An observed situation where objective evidence shows a specified requirement was not met. A major non-conformity is one that poses a serious threat to people, the ship or the environment and needs immediate corrective action.',
      },
      {
        q: 'Can the company override the master on safety?',
        a: 'No. ISM Code section 5 states the master has overriding authority and responsibility for safety and pollution prevention decisions, and may request company assistance.',
      },
    ],
    related: ['psc', 'solas', 'isps', 'maintenance'],
  },
  {
    slug: 'imdg',
    name: 'IMDG / Dangerous Goods Guide',
    title: 'IMDG Code Guide: 9 Dangerous Goods Classes',
    description:
      'IMDG Code basics for crew: the 9 UN hazard classes and divisions, DG documentation, segregation, marine pollutant marking and EmS and MFAG emergency guides.',
    category: 'Reference guide',
    width: 720,
    about:
      'A quick reference to the International Maritime Dangerous Goods Code, mandatory under SOLAS chapter VII. It lists the nine UN hazard classes and their divisions with examples, explains the dangerous goods declaration, container packing certificate and DG manifest, gives segregation basics and points to the EmS fire and spillage schedules and the MFAG.',
    steps: [
      'Check the Hazard Classes tab for the class or division on the label or declaration.',
      'Review the Documentation tab for what the shipper and ship must hold.',
      'Read the Segregation tab, then confirm with the IMDG segregation table for the actual classes on board.',
      'Find the EmS and MFAG references for emergency response before you need them.',
    ],
    faqs: [
      {
        q: 'What are the 9 IMDG hazard classes?',
        a: 'Class 1 explosives, 2 gases, 3 flammable liquids, 4 flammable solids, 5 oxidizing substances and organic peroxides, 6 toxic and infectious substances, 7 radioactive material, 8 corrosives and 9 miscellaneous dangerous substances, including lithium batteries and environmentally hazardous substances.',
      },
      {
        q: 'What is an EmS schedule?',
        a: 'Each entry in the Dangerous Goods List gives an EmS code: an F schedule for fire (F-A to F-J) and an S schedule for spillage (S-A to S-Z), describing the response for that substance.',
      },
      {
        q: 'What documents are needed for dangerous goods?',
        a: 'A dangerous goods declaration from the shipper with UN number, proper shipping name, class, packing group and quantity; a container or vehicle packing certificate; and on board a special list, manifest or detailed stowage plan.',
      },
      {
        q: 'What does "away from" mean in segregation?',
        a: 'It is the lowest level of segregation in the IMDG Code. The higher levels are "separated from", "separated by a complete compartment or hold from" and "separated longitudinally by an intervening complete compartment or hold from".',
      },
    ],
    related: ['cargo', 'lashing', 'port-documentation', 'emergency'],
  },
  {
    slug: 'certificates',
    name: 'Certificate Requirements by Rank',
    title: 'STCW Certificates by Rank: Seafarer Guide',
    description:
      'STCW certificates by rank, from Master and Chief Engineer to AB and Oiler, with regulation references and extra training for tankers, gas and passenger ships.',
    category: 'Reference guide',
    width: 720,
    about:
      'A guide to the STCW certificates of competency and proficiency typically required for each rank on merchant ships. It covers basic safety and security training common to all crew, deck and engine officers, ETOs, and deck and engine ratings, each with its STCW regulation, plus the extra training needed on oil and chemical tankers, gas carriers, passenger ships and in polar waters.',
    steps: [
      'Start with Common to All Ranks for basic safety training, security and medical documents.',
      'Select your department: deck officers, engine officers, ETO, deck ratings or engine ratings.',
      'Check the certificates listed for your current rank and the next rank up.',
      'Add the vessel-type training for the ships you want to join and confirm with the flag state.',
    ],
    faqs: [
      {
        q: 'What is STCW Basic Safety Training?',
        a: 'Under STCW regulation VI/1 and section A-VI/1, every seafarer needs four modules: personal survival techniques, fire prevention and fire fighting, elementary first aid, and personal safety and social responsibilities. Refresher training is required every five years for survival and fire fighting.',
      },
      {
        q: 'Which certificate does a Chief Officer need?',
        a: 'A Certificate of Competency as Chief Mate under STCW regulation II/2 for ships of 500 GT or more, plus GMDSS GOC, ARPA, ECDIS, advanced fire fighting and medical first aid or medical care as required by the flag.',
      },
      {
        q: 'What extra training is needed for oil tankers?',
        a: 'Basic training for oil and chemical tanker cargo operations (STCW V/1-1), and advanced training for the master, chief engineer, chief mate, second engineer and anyone with immediate responsibility for cargo operations.',
      },
      {
        q: 'Which STCW regulation covers the ETO?',
        a: 'Regulation III/6 covers the certificate of competency for Electro-Technical Officers, introduced by the 2010 Manila amendments.',
      },
    ],
    related: ['flags', 'ice-navigation', 'vetting', 'mlc'],
  },
  {
    slug: 'flags',
    name: 'Flag State Comparison',
    title: 'Flag State Comparison & CoC Endorsement',
    description:
      'Compare 10 major flag states, from Panama, Liberia and Marshall Islands to Malta, Singapore and Norway, and how CoC endorsement works when you join their ships.',
    category: 'Reference guide',
    width: 720,
    about:
      'A reference to ten of the most common flags seafarers sail under: Panama, Liberia, Marshall Islands, Bahamas, Malta, Cyprus, Singapore, Hong Kong, the UK and Red Ensign Group, and Norway (NIS). For each it shows the registry type and how endorsement of your national Certificate of Competency is usually handled.',
    steps: [
      'Find the flag of the ship you are joining.',
      'Read the registry type and general notes.',
      'Check how CoC endorsement is processed for that flag.',
      'Confirm current requirements with the flag administration or your manning agent before signing on.',
    ],
    faqs: [
      {
        q: 'What is a flag state endorsement?',
        a: 'Under STCW regulation I/10, when you serve on a ship of a different flag from the country that issued your Certificate of Competency, that flag must issue an endorsement recognising your certificate.',
      },
      {
        q: 'What is the IMO STCW White List?',
        a: 'The list of countries the IMO Maritime Safety Committee has confirmed give full and complete effect to the STCW Convention. Flags generally only endorse certificates issued by countries on this list.',
      },
      {
        q: 'What is an open registry?',
        a: 'A flag that registers ships regardless of the owner\'s nationality, such as Panama, Liberia and the Marshall Islands. National registries like Singapore or Hong Kong have closer links between ships and the flag state.',
      },
      {
        q: 'Do EU flags have extra requirements?',
        a: 'Malta and Cyprus also apply EU rules on recognition of seafarer certificates, alongside the STCW endorsement process.',
      },
    ],
    related: ['certificates', 'visa', 'psc', 'mlc'],
  },
  {
    slug: 'enclosed-space',
    name: 'Enclosed Space Entry',
    title: 'Enclosed Space Entry: Gas Testing Guide',
    description:
      'Enclosed space entry for crew: which spaces count, permit and standby rules, the gas testing order (O2, LEL, toxic) and the one rescue rule that saves lives.',
    category: 'Reference guide',
    width: 720,
    about:
      'A step-by-step guide to entering enclosed spaces on board safely. It explains which spaces count as enclosed, what must be in place before entry, the gas testing sequence for oxygen, flammable and toxic gases, what to do during occupation, and the single most important rule if someone collapses inside.',
    steps: [
      'Check whether the space is on your ship\'s list of enclosed spaces.',
      'Follow the Before Entry steps: risk assessment, permit, ventilation, standby person and rescue equipment.',
      'Test the atmosphere in order: oxygen, flammable gas (% LEL), then toxic gases, at several levels.',
      'During entry keep ventilation running, re-test and keep contact; if someone collapses, raise the alarm and do not enter without breathing apparatus.',
    ],
    faqs: [
      {
        q: 'What oxygen level is safe for enclosed space entry?',
        a: 'Normal air contains about 20.9% oxygen. IMO Resolution A.1050(27) on entering enclosed spaces expects a steady 21% by volume by oxygen meter, not more than 1% of the lower flammable limit, and toxic gases at no more than 50% of their occupational exposure limit.',
      },
      {
        q: 'What is the correct gas testing order?',
        a: 'Oxygen first, then flammable gases as % LEL, then toxic gases such as H2S and CO and any cargo-specific gases. Test from outside the space and at top, middle and bottom levels.',
      },
      {
        q: 'How often are enclosed space entry drills required?',
        a: 'SOLAS regulation III/19 requires enclosed space entry and rescue drills at least once every two months.',
      },
      {
        q: 'Why do rescuers die in enclosed spaces?',
        a: 'They enter without breathing apparatus to help a collapsed colleague and are overcome by the same atmosphere. Raise the alarm, stay out, and let a properly equipped rescue team go in.',
      },
    ],
    related: ['emergency', 'medical', 'ism', 'cargo'],
  },
  {
    slug: 'emergency',
    name: 'Emergency Procedures',
    title: 'Shipboard Emergency Procedures Checklist',
    description:
      'Quick-reference steps for the four critical shipboard emergencies: fire, flooding, man overboard and abandon ship. For refreshing before drills and watches.',
    category: 'Reference guide',
    width: 680,
    about:
      'A quick-reference checklist for the four most critical shipboard emergencies. Each scenario (fire, flooding, man overboard, abandon ship) gives seven short steps in order, covering the alarm, initial actions, containment, communication and recovery.',
    steps: [
      'Pick the scenario: fire, flooding, man overboard or abandon ship.',
      'Read the numbered steps in order.',
      'Compare them with your ship\'s muster list, emergency plans and SMS.',
      'Use them to refresh before drills and when joining a new ship.',
    ],
    faqs: [
      {
        q: 'What is the general emergency alarm signal?',
        a: 'SOLAS and the LSA Code define it as seven or more short blasts followed by one long blast on the ship\'s whistle and alarm bells. The order to abandon ship itself is given by the master.',
      },
      {
        q: 'What should you do first in a man overboard?',
        a: 'Shout man overboard, throw the nearest lifebuoy with light and smoke signal, and keep pointing at the person while the alarm is raised. The bridge then starts a recovery turn such as the Williamson or Anderson turn.',
      },
      {
        q: 'What is boundary cooling in a fire?',
        a: 'Cooling the decks and bulkheads around the space on fire with water to stop heat spreading the fire to adjacent compartments.',
      },
      {
        q: 'Does this replace the muster list?',
        a: 'No. Your ship\'s muster list, emergency procedures and drills always take priority. This page is a general reminder.',
      },
    ],
    related: ['medical', 'enclosed-space', 'solas', 'heavy-weather'],
  },
  {
    slug: 'bmp5',
    name: 'BMP5 / Piracy Risk Guide',
    title: 'BMP5 Piracy Guide: HRA Transit & Citadel',
    description:
      'BMP5 for seafarers: voyage risk assessment, UKMTO reporting, ship protection measures, the citadel and what to do if pirates approach or board your ship.',
    category: 'Reference guide',
    width: 720,
    about:
      'A summary of Best Management Practices to deter piracy and enhance maritime security (BMP5), the industry guidance for ships transiting areas with piracy or armed robbery risk. It covers what BMP is, planning before transit including UKMTO registration, ship protection measures such as razor wire and maximum safe speed, and the actions if the ship is approached or boarded.',
    steps: [
      'Read What Is BMP5 for where it applies.',
      'Go through Before Transit: risk assessment, UKMTO registration, route and crew briefing.',
      'Check the Ship Protection Measures are rigged and tested before entering the area.',
      'Review If Approached / Boarded with the crew so everyone knows the alarm, SSAS and citadel steps.',
    ],
    faqs: [
      {
        q: 'Is BMP5 mandatory?',
        a: 'No. BMP5 is industry guidance endorsed by IMO, not a convention like SOLAS. It is widely used in company voyage planning and Ship Security Plans for high risk areas.',
      },
      {
        q: 'What is UKMTO?',
        a: 'UK Maritime Trade Operations, which runs a voluntary reporting scheme for ships in the region. Ships send an initial report on entering the area and regular position reports, and UKMTO passes threat information to ships and naval forces.',
      },
      {
        q: 'What is a citadel on a ship?',
        a: 'A pre-planned secure space where the whole crew can lock themselves in with communications if pirates board and boarding cannot be prevented, until naval or military help arrives.',
      },
      {
        q: 'Should the ship stop if approached by a small craft?',
        a: 'No. BMP advises keeping the maximum safe speed and never stopping voluntarily for non-official craft, because a fast-moving ship is much harder to board.',
      },
    ],
    related: ['isps', 'emergency', 'heavy-weather', 'distance-eta'],
  },
  {
    slug: 'bwm',
    name: 'Ballast Water Management Guide',
    title: 'Ballast Water Management Guide: D-1 vs D-2',
    description:
      'The BWM Convention explained: D-1 exchange vs D-2 treatment standards, BWM Certificate, Ballast Water Management Plan, Record Book and PSC checks.',
    category: 'Reference guide',
    width: 720,
    about:
      'A practical guide to the International Convention for the Control and Management of Ships\' Ballast Water and Sediments (BWM Convention), in force since 2017. It explains the D-1 exchange and D-2 treatment standards, the move to treatment systems, the certificate, plan and record book a ship must carry, and what PSC inspectors commonly check.',
    steps: [
      'Read what the BWM Convention is for and when it applies.',
      'Compare the D-1 exchange standard with the D-2 performance standard.',
      'Check the Documentation tab against the BWM Certificate, BWMP and Ballast Water Record Book on board.',
      'Use the Practical Notes for local requirements and BWTS failure reporting.',
    ],
    faqs: [
      {
        q: 'What is the difference between D-1 and D-2?',
        a: 'D-1 is ballast water exchange: at least 95% volumetric exchange, or pumping three times the tank volume, at least 200 nm from land in 200 m depth. D-2 limits the viable organisms and indicator microbes in discharged ballast and needs an approved treatment system.',
      },
      {
        q: 'Which ships need a BWM Certificate?',
        a: 'Ships of 400 GT and above on international voyages, excluding floating platforms, FSUs and FPSOs, must carry an International Ballast Water Management Certificate.',
      },
      {
        q: 'When did ships have to meet D-2?',
        a: 'Ships had to move from D-1 to D-2 at their first IOPP renewal survey after 8 September 2019, with all ships expected to comply by 8 September 2024.',
      },
      {
        q: 'What happens if the BWTS fails?',
        a: 'Report it through your SMS, inform the flag and the next port state, and follow the contingency measures in the BWM Convention guidance. Do not discharge untreated ballast without the port state\'s agreement.',
      },
    ],
    related: ['psc', 'oil-record-book', 'port-documentation', 'solas'],
  },
  {
    slug: 'port-documentation',
    name: 'Port Entry Documentation',
    title: 'Port Entry Documents: IMO FAL Forms Guide',
    description:
      'The seven IMO FAL forms every port call needs, from General Declaration to DG Manifest, plus US Advance Notice of Arrival and EU single window reporting.',
    category: 'Reference guide',
    width: 720,
    about:
      'A checklist of the documents a ship needs for port entry. It lists the seven standard IMO FAL forms under the FAL Convention, the United States requirements such as the 96-hour Advance Notice of Arrival and crew visas, the EU reporting rules through national single windows, and practical tips for avoiding delays.',
    steps: [
      'Review the seven FAL forms and prepare those that apply to your call.',
      'Check the United States or European Union tab if you are calling there.',
      'Confirm deadlines and local forms with your agent well before arrival.',
      'Keep the crew list and DG manifest accurate and consistent throughout the voyage.',
    ],
    faqs: [
      {
        q: 'What are the IMO FAL forms?',
        a: 'FAL 1 General Declaration, FAL 2 Cargo Declaration, FAL 3 Ship\'s Stores Declaration, FAL 4 Crew\'s Effects Declaration, FAL 5 Crew List, FAL 6 Passenger List and FAL 7 Dangerous Goods.',
      },
      {
        q: 'When is the US Advance Notice of Arrival due?',
        a: 'For most foreign-flag ships on voyages of 96 hours or more, the ANOA must reach the USCG National Vessel Movement Center at least 96 hours before arrival.',
      },
      {
        q: 'How are port documents sent in the EU?',
        a: 'Under the EU reporting formalities rules, pre-arrival information goes electronically through national single window systems linked to SafeSeaNet, rather than on paper FAL forms.',
      },
      {
        q: 'Is electronic exchange of FAL data mandatory?',
        a: 'Yes. Since 1 January 2024, amendments to the FAL Convention require public authorities to use a maritime single window for electronic exchange of data.',
      },
    ],
    related: ['visa', 'ports', 'imdg', 'documents'],
  },
  {
    slug: 'medical',
    name: 'Medical Emergency Guide',
    title: 'Medical Emergency at Sea: TMAS Guide',
    description:
      'What to do first in a medical emergency at sea, how to get radio medical advice from TMAS, red flag symptoms, and the medical resources every ship carries.',
    category: 'Reference guide',
    width: 720,
    about:
      'A guide to the first minutes of a medical emergency on board and how to get qualified help fast. It covers the first actions at the scene, how Telemedical Assistance Services (TMAS) work and what information to give them, warning signs that need immediate advice or evacuation, and the medical guide, medicine chest and trained personnel on every ship.',
    steps: [
      'Make the scene safe, call for help and bring in the ship\'s medical care officer.',
      'Check breathing and start CPR if needed and trained.',
      'Contact TMAS with symptoms, vital signs, what happened and treatment given.',
      'Follow TMAS advice with the ship\'s medical guide and medicine chest, and log everything.',
    ],
    faqs: [
      {
        q: 'What is TMAS?',
        a: 'A Telemedical Assistance Service: shore-based doctors who give seafarers free medical advice by radio or satellite. IMO MSC/Circ.960 sets out how TMAS should operate, and most flag states nominate a TMAS provider.',
      },
      {
        q: 'What information should I give TMAS?',
        a: 'The patient\'s age, symptoms and when they started, vital signs such as pulse, breathing rate, temperature and consciousness level, what happened, medicines already given, and the ship\'s position and next port.',
      },
      {
        q: 'Who is responsible for medical care on board?',
        a: 'At least one officer holds STCW medical care training (regulation VI/4), often the master or chief officer, with others trained in medical first aid. MLC 2006 Regulation 4.1 sets the right to medical care on board and ashore.',
      },
      {
        q: 'Which medical guide must ships carry?',
        a: 'An approved medical guide such as the WHO International Medical Guide for Ships, together with a medicine chest suited to the trade.',
      },
    ],
    related: ['emergency', 'enclosed-space', 'mlc', 'fatigue'],
  },
  {
    slug: 'isps',
    name: 'ISPS Code Guide',
    title: 'ISPS Code Guide: Security Levels & SSAS',
    description:
      'The ISPS Code for crew: security levels 1, 2 and 3, SSO, CSO and PFSO roles, the ISSC and Ship Security Plan, Declaration of Security and the SSAS alert.',
    category: 'Reference guide',
    width: 720,
    about:
      'A non-sensitive overview of the International Ship and Port Facility Security Code, under SOLAS chapter XI-2. It explains the three security levels, the roles of the Ship, Company and Port Facility Security Officers, the International Ship Security Certificate and Ship Security Plan, the Declaration of Security and the Ship Security Alert System.',
    steps: [
      'Read Security Levels to understand what changes at levels 1, 2 and 3.',
      'Check Key Roles for who is responsible on board, in the company and at the port.',
      'Review Certificates & Plans, then ask the SSO about your own role in the SSP.',
      'Read when a Declaration of Security is needed and what the SSAS does.',
    ],
    faqs: [
      {
        q: 'What are the three ISPS security levels?',
        a: 'Level 1 is normal, with minimum security measures at all times. Level 2 is heightened, with additional measures while the risk is higher. Level 3 is exceptional, with further specific measures for a limited period when an incident is probable or imminent.',
      },
      {
        q: 'What does the Ship Security Officer do?',
        a: 'The SSO is responsible on board for implementing and maintaining the Ship Security Plan, security drills and training, and liaison with the Company Security Officer and port facility security officers.',
      },
      {
        q: 'What is a Declaration of Security?',
        a: 'An agreement between a ship and a port facility, or another ship, on the security measures each will take during their interface. It is used at higher security levels or when either side requests it.',
      },
      {
        q: 'What is the SSAS?',
        a: 'The Ship Security Alert System required by SOLAS regulation XI-2/6. When activated it sends a covert alert with the ship\'s identity and position to the company and flag authority, without raising any alarm on board.',
      },
    ],
    related: ['bmp5', 'ism', 'solas', 'port-documentation'],
  },
  {
    slug: 'heavy-weather',
    name: 'Heavy Weather Guide',
    title: 'Heavy Weather Guide: Parametric Rolling',
    description:
      'Heavy weather at sea: preparation checklist, weather routing, speed and heading, and the risks of synchronous and parametric rolling, pooping and broaching.',
    category: 'Reference guide',
    width: 720,
    about:
      'A guide for officers preparing a ship for heavy weather. It covers a six-step preparation checklist, weather routing, how to adjust speed and heading in heavy seas, and the main dangers every watchkeeper should recognise: synchronous rolling, parametric rolling, pooping and broaching.',
    steps: [
      'Work through the Preparation checklist well before the system arrives.',
      'Review Route & Weather Routing with the master and routing service advice.',
      'Use During Heavy Weather for speed, heading, deck access and monitoring.',
      'Study Key Risks so you recognise rolling and following-sea dangers early.',
    ],
    faqs: [
      {
        q: 'What is parametric rolling?',
        a: 'Large rolling that builds quickly in head or near-head seas when the wave encounter period is about half the ship\'s natural roll period, because stability changes as wave crests and troughs pass along the hull. Container ships with large bow flare are especially prone to it.',
      },
      {
        q: 'What is synchronous rolling?',
        a: 'Rolling that builds when the wave encounter period matches the ship\'s natural roll period. Changing course or speed to change the encounter period breaks the synchronisation.',
      },
      {
        q: 'Why reduce speed in heavy weather?',
        a: 'Slamming and pounding loads rise sharply with speed in heavy seas. Reducing speed is often the most effective way to reduce hull stress, cargo damage and injury risk.',
      },
      {
        q: 'Where can I find guidance on avoiding dangerous situations in following seas?',
        a: 'IMO MSC.1/Circ.1228, the revised guidance to the master for avoiding dangerous situations in adverse weather and sea conditions, covers surf-riding, broaching, synchronous and parametric rolling.',
      },
    ],
    related: ['stability', 'lashing', 'emergency', 'ice-navigation'],
  },
  {
    slug: 'ice-navigation',
    name: 'Ice Navigation Guide',
    title: 'Ice Navigation & Polar Code Guide',
    description:
      'Polar Code basics, Polar Ship Categories A, B and C, IACS Polar Classes PC1 to PC7, practical ice navigation tips and STCW polar training requirements.',
    category: 'Reference guide',
    width: 720,
    about:
      'A background guide to operating in ice and polar waters. It explains the Polar Code, mandatory under SOLAS and MARPOL, the Polar Ship Certificate and PWOM, Polar Ship Categories A, B and C, IACS Polar Classes PC1 to PC7, practical navigation in ice and the STCW basic and advanced polar training.',
    steps: [
      'Read The Polar Code for what applies to your ship and the documents it must carry.',
      'Check Ice Classes to understand your ship\'s category and polar class.',
      'Review Practical Navigation before entering ice-affected waters.',
      'Confirm the crew hold the STCW polar training required for the ice conditions.',
    ],
    faqs: [
      {
        q: 'What is the Polar Code?',
        a: 'The International Code for Ships Operating in Polar Waters, in force since 1 January 2017. It is mandatory under SOLAS chapter XIV for safety and MARPOL for environmental protection, for ships in Arctic and Antarctic waters.',
      },
      {
        q: 'What is the difference between Category A, B and C ships?',
        a: 'Category A ships are designed for at least medium first-year ice, Category B for at least thin first-year ice, both possibly with old ice inclusions, and Category C for open water or ice less severe than A or B.',
      },
      {
        q: 'What polar training does STCW require?',
        a: 'STCW regulation V/4 requires basic training for ships operating in polar waters for masters, chief mates and officers in charge of a navigational watch, and advanced training for masters and chief mates on ships operating outside open waters.',
      },
      {
        q: 'What are IACS Polar Classes?',
        a: 'A classification society system from PC1, year-round operation in all polar waters, down to PC7, summer and autumn operation in thin first-year ice. They set structural and machinery requirements.',
      },
    ],
    related: ['heavy-weather', 'certificates', 'solas', 'colregs'],
  },
  {
    slug: 'vetting',
    name: 'Tanker Vetting Prep',
    title: 'Tanker Vetting Prep: SIRE 2.0 & CDI Guide',
    description:
      'Prepare for a tanker vetting inspection: how OCIMF SIRE 2.0 and CDI work, common inspection areas, a prep checklist and how observations affect chartering.',
    category: 'Reference guide',
    width: 720,
    about:
      'A preparation guide for tanker officers facing a vetting inspection. It explains OCIMF\'s SIRE programme and SIRE 2.0\'s focus on human factors, the CDI scheme for chemical and gas carriers, the areas inspectors commonly check, a practical preparation checklist and how observations affect future chartering decisions.',
    steps: [
      'Read What Is SIRE / CDI to understand who reads the report and why.',
      'Go through Common Inspection Areas with each department.',
      'Work the Preparation Checklist before the inspector boards.',
      'Read Understanding Observations so you can deal with root causes after the inspection.',
    ],
    faqs: [
      {
        q: 'What is SIRE 2.0?',
        a: 'The current version of OCIMF\'s Ship Inspection Report Programme. Inspectors use a ship-specific question set and pay more attention to human factors, asking crew to show how they actually carry out tasks rather than only checking paperwork.',
      },
      {
        q: 'What is the difference between SIRE and CDI?',
        a: 'SIRE is run by OCIMF for oil tankers and other ships chartered by oil companies. CDI (Chemical Distribution Institute) runs a separate scheme for chemical tankers and gas carriers serving the chemical industry.',
      },
      {
        q: 'Does a clean SIRE report guarantee approval?',
        a: 'No. Vetting is each charterer\'s own risk assessment. A report is one input alongside the operator\'s track record, incident history and other factors.',
      },
      {
        q: 'What do inspectors ask crew?',
        a: 'Expect direct questions about your own duties and emergency roles, cargo and ballast procedures, mooring and navigation practices. Being able to explain clearly what you do matters as much as the records.',
      },
    ],
    related: ['psc', 'certificates', 'ism', 'imdg'],
  },
  {
    slug: 'fatigue',
    name: 'Fatigue Management Guide',
    title: 'Seafarer Fatigue & Rest Hours Guide',
    description:
      'Fatigue at sea: STCW and MLC rest hour rules (10 in 24, 77 in 7 days), signs of fatigue, what helps you sleep on watch rotations and how to report it.',
    category: 'Reference guide',
    width: 720,
    about:
      'A guide to fatigue on board for watchkeepers and day workers. It sets out the STCW and MLC 2006 rest hour rules, the signs of fatigue in yourself and others, practical steps that improve rest on a watch rotation, and how to report fatigue as a safety concern through the SMS.',
    steps: [
      'Check The Rest Hour Rules against your actual hours of rest records.',
      'Read Recognizing Fatigue and watch for the signs in yourself and your watch partner.',
      'Apply the tips in What Actually Helps to your cabin and sleep pattern.',
      'Use Reporting a Concern if fatigue is affecting safe work.',
    ],
    faqs: [
      {
        q: 'What are the STCW and MLC rest hour rules?',
        a: 'At least 10 hours of rest in any 24-hour period and 77 hours in any 7-day period. Rest may be split into no more than two periods, one of at least 6 hours, with no more than 14 hours between consecutive rest periods.',
      },
      {
        q: 'Are hours of rest records checked?',
        a: 'Yes. Records must be kept and signed, and Port State Control routinely compares them with the watch schedule and logbooks. Records that do not match reality are a common deficiency.',
      },
      {
        q: 'What are the signs of fatigue?',
        a: 'Difficulty concentrating, slow reactions to alarms and instructions, irritability, microsleeps and poor decisions that are out of character. Fatigue also builds up over weeks.',
      },
      {
        q: 'Where can I find IMO guidance on fatigue?',
        a: 'IMO MSC.1/Circ.1598, Guidelines on Fatigue, covers the causes and effects of fatigue and how companies, masters and seafarers can manage it.',
      },
    ],
    related: ['mlc', 'medical', 'itf', 'colregs'],
  },
];

export const TOOL_SEO_BY_SLUG: Record<string, ToolSeoEntry> = Object.fromEntries(
  TOOL_SEO.map((t) => [t.slug, t]),
);

export const TOOL_SLUGS: string[] = TOOL_SEO.map((t) => t.slug);

export function getToolSeo(slug: string): ToolSeoEntry {
  const t = TOOL_SEO_BY_SLUG[slug];
  if (!t) throw new Error(`Unknown tool slug: ${slug}`);
  return t;
}

export function toolPath(slug: string): string {
  return `/tools/${slug}`;
}

export function toolFullTitle(t: ToolSeoEntry): string {
  return `${t.title} | ${BRAND}`;
}

const OG_IMAGE = {
  url: '/opengraph-image?v=2',
  width: 1200,
  height: 630,
  alt: 'ShipCrewFinder Crew Toolkit',
};

export function toolMetadata(slug: string): Metadata {
  const t = getToolSeo(slug);
  const title = toolFullTitle(t);
  const url = toolPath(slug);
  return {
    title,
    description: t.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: t.description,
      url,
      type: 'website',
      siteName: BRAND,
      locale: 'en_US',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: t.description,
      images: [OG_IMAGE.url],
    },
  };
}

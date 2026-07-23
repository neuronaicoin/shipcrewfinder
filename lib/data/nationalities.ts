export type NationalityProfile = {
  slug: string;
  nationality: string;      // "Filipino"
  country: string;          // "Philippines"
  flag: string;             // emoji
  headline: string;         // one-line positioning
  officers: string;         // officer count or estimate
  ratings: string;          // ratings count or estimate
  globalRank: string;       // supply ranking context
  strongRanks: string[];    // ranks this nationality is known for
  fleets: string;           // which fleets/flags employ them heavily
  seafarerNotes: string[];  // paragraphs for the crew audience
  companyNotes: string[];   // paragraphs for the hiring audience
  faq: { q: string; a: string }[];
};

export const NATIONALITIES: NationalityProfile[] = [
  {
    slug: "filipino-seafarers",
    nationality: "Filipino",
    country: "Philippines",
    flag: "🇵🇭",
    headline: "The backbone of the global merchant fleet — #1 supplier of both officers and ratings.",
    officers: "203,179",
    ratings: "256,968",
    globalRank: "#1 seafarer-supplying nation (BIMCO/ICS Seafarer Workforce Report, July 2026)",
    strongRanks: ["AB", "Bosun", "Oiler", "Fitter", "Cook", "2nd Engineer", "3rd Officer"],
    fleets: "Heavily represented across Japanese, Greek, German and Scandinavian-managed fleets; dominant on container ships, bulk carriers and cruise tonnage.",
    seafarerNotes: [
      "Filipino seafarers supply roughly one in four crew members worldwide, with 203,179 officers and 256,968 ratings deployed according to the July 2026 BIMCO/ICS report. English fluency, STCW-compliant training across 80+ maritime schools, and decades of deployment infrastructure keep demand consistently high.",
      "Deployment runs through DMW-licensed manning agencies (the successor to POEA), which handle contracts, SIRB documentation and mandatory benefits. Standard contracts follow POEA/DMW-approved terms — typically 6–9 months on board with government-mandated insurance and remittance requirements.",
      "Wage floors are set by ITF/IBF collective agreements on covered vessels, but market rates for experienced Filipino officers on gas and tanker tonnage run well above the floor — the global shortage of senior engineers works in your favor.",
    ],
    companyNotes: [
      "For operators, the Philippines offers the deepest and most institutionalized crew pool in the world: standardized documentation, government-regulated agencies, and unmatched availability across every rating and junior officer rank.",
      "Hiring must run through DMW-licensed agencies — direct hiring of Filipino crew is restricted by law. Factor agency fees and mandatory contributions (SSS, PhilHealth, Pag-IBIG) into total crew cost. Turnaround on documentation is fast by regional standards when the agency is established.",
    ],
    faq: [
      {
        q: "How much does a Filipino seafarer earn per month in 2026?",
        a: "Filipino seafarer salaries in 2026 follow global rank-based scales: ratings such as AB and Oiler typically earn $1,800–$3,600/month depending on vessel type, while senior officers like Chief Engineers earn $8,500–$21,000/month, with LNG tonnage at the top of the range. ITF/IBF agreements set minimums on covered vessels.",
      },
      {
        q: "How do companies hire Filipino crew?",
        a: "By law, Filipino seafarers must be engaged through DMW-licensed manning agencies in the Philippines. Companies partner with an accredited agency which handles recruitment, POEA/DMW-standard contracts, documentation and mandatory benefits.",
      },
    ],
  },
  {
    slug: "indian-seafarers",
    nationality: "Indian",
    country: "India",
    flag: "🇮🇳",
    headline: "The world's #2 officer supplier — especially valued on tankers and bulk carriers.",
    officers: "140,718",
    ratings: "90,000+",
    globalRank: "#2 officer-supplying nation (BIMCO/ICS 2026)",
    strongRanks: ["Chief Engineer", "2nd Engineer", "Chief Officer", "Master", "ETO"],
    fleets: "Strong presence in tanker fleets (Greek, Norwegian, Singaporean management), bulk carriers, and increasingly LNG tonnage.",
    seafarerNotes: [
      "India supplies 140,718 officers to the world fleet — second only to the Philippines — with a reputation concentrated at the senior officer level. Indian Chief Engineers and Masters are particularly sought on tanker and gas tonnage, where DG Shipping-approved training and strong English serve the inspection-heavy environment well.",
      "Certification runs through the Directorate General of Shipping (DGS) with CDC issuance and INDoS registration. Maritime India Vision 2030 continues to expand training capacity, including simulator-based courses for gas and dual-fuel operations.",
      "Promotion timelines on some fleets run longer than for other nationalities — but the officer shortage at management level is shifting leverage toward experienced Indian senior officers, particularly those with tanker and LNG endorsements.",
    ],
    companyNotes: [
      "Indian officers offer one of the strongest technical educations in the market, with deep familiarity with SIRE/OCIMF inspection culture — a real asset on tanker tonnage where vetting performance drives charter access.",
      "Recruitment can run through RPSL-licensed agencies or direct engagement. Verify DGS approval of training certificates during screening; institution quality varies and the strongest candidates come from established academies.",
    ],
    faq: [
      {
        q: "How much does an Indian Chief Engineer earn in 2026?",
        a: "Indian Chief Engineers earn global market rates: typically $8,500–$12,500/month on bulk carriers, $11,000–$15,500 on tankers, and $15,000–$21,000 on LNG carriers. The management-level officer shortage keeps senior Indian officers in strong demand.",
      },
      {
        q: "Why are Indian officers preferred on tankers?",
        a: "Indian maritime training emphasizes the technical and documentation standards that tanker vetting (SIRE 2.0, OCIMF) demands, and English fluency supports inspection performance. Decades of tanker deployment have built a deep pool of gas- and chemical-endorsed Indian senior officers.",
      },
    ],
  },
  {
    slug: "chinese-seafarers",
    nationality: "Chinese",
    country: "China",
    flag: "🇨🇳",
    headline: "110,000+ officers, mostly serving national and Chinese-managed fleets — with growing international reach.",
    officers: "110,893",
    ratings: "120,000+",
    globalRank: "#3 officer-supplying nation (BIMCO/ICS 2026)",
    strongRanks: ["2nd Engineer", "3rd Engineer", "Chief Officer", "AB", "Fitter"],
    fleets: "Predominantly Chinese-flagged and Chinese-managed tonnage (COSCO and affiliates); growing presence on international bulk and container fleets.",
    seafarerNotes: [
      "China supplies 110,893 officers to the world fleet, trained through major institutions like Dalian Maritime University and Shanghai Maritime University. Most Chinese crew serve national fleets, but international deployment is growing as global operators seek alternatives amid the officer shortage.",
      "For Chinese officers targeting international fleets, English proficiency is the single biggest differentiator — officers who clear that bar find bulk and container positions readily, with wages matching global scales rather than domestic ones.",
      "Fitters and engine ratings from Chinese shipyard backgrounds carry strong fabrication skills that chief engineers value highly on aging tonnage.",
    ],
    companyNotes: [
      "The Chinese crew pool is large and technically well-trained, with wages historically competitive against other major supply nations. English capability varies widely — screen for it specifically on internationally trading tonnage.",
      "Crewing typically runs through licensed Chinese manning companies. Documentation is standardized; allow lead time for international deployment paperwork on first engagement.",
    ],
    faq: [
      {
        q: "How much do Chinese seafarers earn in 2026?",
        a: "Chinese seafarers on internationally trading vessels earn global rank-based rates — e.g. 2nd Engineers $5,500–$11,000/month depending on vessel type. Domestic fleet wages differ from international scales.",
      },
    ],
  },
  {
    slug: "russian-seafarers",
    nationality: "Russian",
    country: "Russia",
    flag: "🇷🇺",
    headline: "85,000+ officers with strong technical training — historically prominent on tankers and offshore.",
    officers: "85,816",
    ratings: "60,000+",
    globalRank: "#4 officer-supplying nation (BIMCO/ICS 2026)",
    strongRanks: ["Chief Engineer", "2nd Engineer", "ETO", "Master", "Chief Officer"],
    fleets: "Traditionally strong on tanker, gas and offshore tonnage; deployment patterns have shifted since 2022, with continued presence on non-Western-managed fleets.",
    seafarerNotes: [
      "Russia supplies 85,816 officers, trained through a state academy system with deep technical and engineering emphasis. Russian senior engineers and ETOs have long-standing reputations on tanker, gas and offshore tonnage.",
      "Deployment geography has shifted since 2022 — some Western-managed fleets reduced hiring while Middle Eastern, Asian and Turkish-managed tonnage absorbed experienced Russian officers. Banking and travel logistics for joining vessels require more planning than before.",
      "For officers with gas endorsements and dual-fuel experience, demand remains firm regardless of geography — the global shortage at management level outweighs other factors.",
    ],
    companyNotes: [
      "Russian officers bring rigorous academy training, particularly in engineering and electrical disciplines. For operators able to manage the current payment and travel logistics, the pool offers senior-level experience that is scarce elsewhere.",
      "Verify sanction-compliance requirements for your flag, insurers and charterers before engagement — obligations vary significantly by jurisdiction and trade.",
    ],
    faq: [
      {
        q: "How much do Russian officers earn in 2026?",
        a: "Russian officers earn global rank-based rates where deployed: Chief Engineers typically $8,500–$15,500/month on bulk and tanker tonnage, with gas-endorsed seniors reaching $21,000 on LNG. Actual figures depend on fleet, flag and management company.",
      },
    ],
  },
  {
    slug: "indonesian-seafarers",
    nationality: "Indonesian",
    country: "Indonesia",
    flag: "🇮🇩",
    headline: "A top-5 supplier with 72,000+ officers and one of the fastest-growing maritime labor markets.",
    officers: "72,304",
    ratings: "150,000+",
    globalRank: "#5 seafarer-supplying nation (BIMCO/ICS 2026)",
    strongRanks: ["AB", "Oiler", "OS", "Cook", "3rd Engineer", "2nd Officer"],
    fleets: "Strong on Asian-managed bulk and general cargo fleets, fishing-to-merchant transitions, and growing presence on Japanese and Korean-operated tonnage.",
    seafarerNotes: [
      "Indonesia ranks in the world's top five with 72,304 officers and one of the largest ratings pools anywhere. Maritime university enrollment is expanding fast, and Indonesian crew are increasingly visible beyond the traditional Asian routes.",
      "Ratings with strong sea time records move quickly in the current market — the global shortage means an AB with clean documentation and vessel-type variety can be selective about contracts.",
      "For junior officers, the path upward is real: operators short on management-level officers are promoting faster than historical norms across Southeast Asian crew pools.",
    ],
    companyNotes: [
      "Indonesia offers scale and cost-competitiveness in the ratings market, with an expanding junior officer pipeline. Crewing runs through licensed Indonesian manning agents.",
      "Training quality varies across the large institution base — established agencies with strong screening add real value here.",
    ],
    faq: [
      {
        q: "How much do Indonesian seafarers earn in 2026?",
        a: "Indonesian ratings typically earn $1,400–$3,600/month depending on rank and vessel type, with officers on global scales — e.g. 2nd Officers $4,500–$8,500/month. ITF-covered tonnage sets wage floors.",
      },
    ],
  },
  {
    slug: "ukrainian-seafarers",
    nationality: "Ukrainian",
    country: "Ukraine",
    flag: "🇺🇦",
    headline: "#2 nationality among STCW-certified crew worldwide — officer-heavy, technically elite.",
    officers: "46,000+",
    ratings: "50,000+",
    globalRank: "#2 nationality among STCW-certified seafarers on the world fleet (BIMCO/ICS 2026)",
    strongRanks: ["Master", "Chief Officer", "Chief Engineer", "2nd Engineer", "ETO"],
    fleets: "Deeply embedded in Greek, German, Dutch and Scandinavian-managed fleets; strong on tankers, bulkers, heavy-lift and offshore.",
    seafarerNotes: [
      "Ukrainians rank second among all STCW-certified nationalities serving the world fleet — an extraordinary position for a nation of its size, built on Soviet-era academy foundations and decades of Western fleet integration.",
      "Visa-free Schengen access and simplified procedures in several jurisdictions make crew changes logistically easier than for most nationalities — a genuine operational advantage that management companies factor in.",
      "The war has complicated exit permissions for some male officers of mobilization age; rules have evolved repeatedly, so current documentation status is the key variable in contract planning. Demand for Ukrainian senior officers remains exceptionally strong.",
    ],
    companyNotes: [
      "Ukrainian officers combine top-tier technical training with strong English and deep Western-fleet familiarity — many hold years of service with the same management companies. Retention rates are among the best in the market.",
      "Confirm current mobilization-exemption documentation early in the engagement process; established crewing agencies in Odesa and abroad handle this routinely.",
    ],
    faq: [
      {
        q: "How much do Ukrainian officers earn in 2026?",
        a: "Ukrainian senior officers earn top-of-market rates: Masters and Chief Engineers typically $9,000–$21,000/month depending on vessel type, with tanker and LNG tonnage at the upper end. Their #2 global ranking among certified crew reflects sustained demand.",
      },
    ],
  },
  {
    slug: "turkish-seafarers",
    nationality: "Turkish",
    country: "Turkey",
    flag: "🇹🇷",
    headline: "A dual-power nation: major crew supplier and home to one of the world's largest shipowning communities.",
    officers: "35,000+",
    ratings: "55,000+",
    globalRank: "Top-15 supplier with a distinctive owner-nation profile",
    strongRanks: ["Chief Engineer", "2nd Engineer", "Master", "Chief Officer", "Fitter"],
    fleets: "Turkish-owned and Turkish-managed fleets (one of the world's largest by owner nationality), plus growing deployment on Greek, German and Gulf-managed tonnage.",
    seafarerNotes: [
      "Turkey occupies a rare position: it both supplies crew and owns ships at scale, with the Turkish-controlled fleet ranking among the world's largest. Istanbul Technical University Maritime Faculty and Piri Reis University anchor an officer pipeline with strong engineering emphasis.",
      "Turkish engineers are known for hands-on machinery skills — a culture of repairing rather than replacing that chief engineers on aging bulk tonnage particularly value. Fitter-to-engineer career paths remain common and respected.",
      "For Turkish officers, the domestic fleet offers proximity and rotation advantages, while international fleets typically pay above domestic scales — a genuine strategic choice at every career stage.",
    ],
    companyNotes: [
      "The Turkish pool combines officer-level technical depth with Europe-adjacent logistics: Istanbul is a global crew-change hub with visa-practical access to much of the world fleet's trading range.",
      "Turkish senior engineers offer strong value on bulk and general cargo tonnage; wage expectations sit between Eastern European and East Asian benchmarks for equivalent experience.",
    ],
    faq: [
      {
        q: "How much do Turkish seafarers earn in 2026?",
        a: "Turkish officers earn global rank-based rates: Chief Engineers typically $8,500–$15,500/month across bulk and tanker tonnage. Domestic Turkish-flag positions often pay below international scales, which is why many Turkish officers target foreign-managed fleets.",
      },
      {
        q: "Why hire Turkish engine officers?",
        a: "Turkish maritime training emphasizes hands-on machinery competence, and Istanbul's position as a crew-change hub simplifies rotation logistics. Turkish Chief and 2nd Engineers are particularly valued on bulk carrier tonnage.",
      },
    ],
  },
  {
    slug: "romanian-seafarers",
    nationality: "Romanian",
    country: "Romania",
    flag: "🇷🇴",
    headline: "#4 nationality among STCW-certified crew — EU passports and Constanta's deep maritime tradition.",
    officers: "25,000+",
    ratings: "20,000+",
    globalRank: "#4 nationality among STCW-certified seafarers (BIMCO/ICS 2026)",
    strongRanks: ["Chief Officer", "2nd Officer", "Chief Engineer", "ETO", "Master"],
    fleets: "Strong across Western European-managed fleets — German, Dutch, Danish container and multipurpose tonnage; growing presence on gas carriers.",
    seafarerNotes: [
      "Romania ranks fourth among all STCW-certified nationalities worldwide — Constanta Maritime University and a Black Sea seafaring tradition sustain an officer pipeline far larger than the country's size suggests.",
      "The EU passport is a structural advantage: no visa friction for European crew changes, eligibility for EU-flag positions, and simplified compliance for European management companies.",
      "Romanian ETOs and deck officers are strongly represented on container and multipurpose tonnage where European operators prize the combination of certification, English and travel flexibility.",
    ],
    companyNotes: [
      "For EU-flag operators, Romanian officers solve compliance and logistics simultaneously — EU nationals with strong training at wage expectations below Western European levels.",
      "The pool is officer-heavy relative to ratings; competition for experienced Romanian senior officers is intense among German and Dutch managers.",
    ],
    faq: [
      {
        q: "How much do Romanian officers earn in 2026?",
        a: "Romanian officers earn European market rates: Chief Officers typically $7,000–$14,000/month depending on vessel type. EU citizenship adds value for EU-flag positions, keeping demand consistently strong.",
      },
    ],
  },
  {
    slug: "polish-seafarers",
    nationality: "Polish",
    country: "Poland",
    flag: "🇵🇱",
    headline: "#5 nationality among STCW-certified crew — senior officers with EU access and offshore depth.",
    officers: "20,000+",
    ratings: "15,000+",
    globalRank: "#5 nationality among STCW-certified seafarers (BIMCO/ICS 2026)",
    strongRanks: ["Master", "Chief Engineer", "Chief Officer", "ETO"],
    fleets: "Scandinavian and German-managed fleets, offshore and wind-farm support vessels, ferries and ro-ro tonnage.",
    seafarerNotes: [
      "Poland ranks fifth among STCW-certified nationalities, with Gdynia Maritime University producing officers who dominate at the senior level — Polish Masters and Chief Engineers are fixtures on Scandinavian-managed tonnage.",
      "The offshore wind boom is a Polish specialty: Baltic proximity and early entry into wind-farm support vessels created a pool of DP-experienced officers that the energy transition keeps in growing demand.",
      "EU citizenship plus decades of North Sea and Baltic deployment make Polish officers among the most logistics-friendly senior crew in the market.",
    ],
    companyNotes: [
      "Polish senior officers command respect on technically demanding tonnage — offshore, DP, ferries and ro-ro. For wind-farm support and SOV operations, the Polish pool is one of the deepest available.",
      "Wage expectations reflect the seniority profile: this is not a cost-arbitrage pool but a capability pool.",
    ],
    faq: [
      {
        q: "How much do Polish officers earn in 2026?",
        a: "Polish senior officers earn upper-market rates: Masters typically $9,000–$21,000/month depending on tonnage, with offshore and DP positions carrying premiums above standard merchant scales.",
      },
    ],
  },
  {
    slug: "vietnamese-seafarers",
    nationality: "Vietnamese",
    country: "Vietnam",
    flag: "🇻🇳",
    headline: "A fast-rising supplier with expanding maritime universities and a growing officer pipeline.",
    officers: "25,000+",
    ratings: "30,000+",
    globalRank: "Emerging top-10 supplier with rapid training expansion",
    strongRanks: ["3rd Engineer", "4th Engineer", "AB", "Oiler", "2nd Officer"],
    fleets: "Japanese, Korean and Taiwanese-managed bulk and container fleets; growing presence on Singapore-managed tonnage.",
    seafarerNotes: [
      "Vietnam is one of the fastest-growing crew nations, with maritime university enrollment climbing and Japanese operators in particular building long-term Vietnamese crewing programs.",
      "Junior engineers are the sweet spot: Vietnamese 3rd and 4th Engineers with Japanese-fleet experience move up quickly as the global officer shortage pulls the pipeline forward.",
      "English capability is the differentiator for international deployment — officers who invest there access global scales rather than regional ones.",
    ],
    companyNotes: [
      "Vietnam offers a cost-competitive, expanding pool with strong work-culture alignment for Japanese and Korean-managed fleets. Junior officer availability is better than in most supply nations.",
      "The senior officer pool is still maturing — plan Vietnamese crewing around the junior-to-mid ranks and grow seniors in-fleet.",
    ],
    faq: [
      {
        q: "How much do Vietnamese seafarers earn in 2026?",
        a: "Vietnamese crew earn global rank-based rates on international tonnage: junior engineers typically $2,500–$7,000/month, ratings $1,400–$3,200/month depending on vessel type and fleet.",
      },
    ],
  },
  {
    slug: "egyptian-seafarers",
    nationality: "Egyptian",
    country: "Egypt",
    flag: "🇪🇬",
    headline: "Suez-forged seafarers — Arab world's largest crew pool with strong Gulf and Mediterranean deployment.",
    officers: "20,000+",
    ratings: "25,000+",
    globalRank: "Leading Arab crew-supplying nation",
    strongRanks: ["2nd Engineer", "3rd Engineer", "Chief Officer", "AB", "Fitter"],
    fleets: "Gulf-managed tankers and offshore, Mediterranean feeder and general cargo, Suez-linked service tonnage.",
    seafarerNotes: [
      "Egypt anchors Arab maritime labor, with the Arab Academy for Science, Technology and Maritime Transport in Alexandria serving as the region's flagship training institution — its graduates deploy across Gulf and Mediterranean fleets.",
      "Proximity to the Suez Canal creates deployment advantages: crew changes at Port Said and Suez integrate naturally with the world's densest shipping artery.",
      "Gulf-managed fleets — UAE, Saudi and Qatari operators — recruit Egyptian officers heavily, where Arabic-English bilingualism carries genuine operational value.",
    ],
    companyNotes: [
      "For Gulf and Mediterranean operators, Egyptian crew combine regional logistics, bilingual capability and AASTMT-standard training at competitive wage levels.",
      "The pool is deepest at junior officer and rating levels; senior Egyptian officers with tanker endorsements are in tighter supply and priced accordingly.",
    ],
    faq: [
      {
        q: "How much do Egyptian seafarers earn in 2026?",
        a: "Egyptian crew on internationally trading vessels earn global rank rates: 2nd Engineers typically $5,500–$9,500/month on bulk and tanker tonnage, ratings $1,800–$3,200/month depending on vessel type.",
      },
    ],
  },
  {
    slug: "myanmar-seafarers",
    nationality: "Myanmar",
    country: "Myanmar",
    flag: "🇲🇲",
    headline: "A disciplined, loyal crew pool favored by Japanese and Singaporean operators.",
    officers: "15,000+",
    ratings: "35,000+",
    globalRank: "Emerging supplier with strong Japanese-fleet integration",
    strongRanks: ["AB", "OS", "Oiler", "Cook", "3rd Officer"],
    fleets: "Japanese-managed bulk carriers and car carriers, Singaporean-managed tonnage, regional Asian trades.",
    seafarerNotes: [
      "Myanmar crew have built a four-decade reputation on Japanese-managed tonnage — retention rates and contract-completion records that operators openly cite as the pool's defining strength.",
      "Ratings dominate the deployment profile, with an officer pipeline growing through Myanmar Maritime University despite domestic challenges. Documentation can take longer than regional peers; established agencies manage the timeline.",
      "For Myanmar ratings, Japanese and Singaporean fleets offer the most established pathways — long-term re-engagement with the same operators is the norm rather than the exception.",
    ],
    companyNotes: [
      "Myanmar offers one of the highest-loyalty ratings pools in Asia, with wage competitiveness and contract-completion discipline that Japanese operators have relied on for decades.",
      "Allow extended lead time for documentation; bureaucratic delays are the pool's main operational friction.",
    ],
    faq: [
      {
        q: "How much do Myanmar seafarers earn in 2026?",
        a: "Myanmar ratings typically earn $1,400–$3,200/month depending on rank and vessel type, with officers on global scales. Japanese-managed fleets are the largest employer of Myanmar crew.",
      },
    ],
  },
];

export const getNationalityBySlug = (slug: string) =>
  NATIONALITIES.find((n) => n.slug === slug);

export const NATIONALITY_REPORT_NOTE =
  "Supply figures from the BIMCO/ICS Seafarer Workforce Report (July 2026) and public maritime authority data. Wage ranges follow the ShipCrewFinder Salary Index — monthly basic wages in USD, excluding overtime.";

import type { PortfolioData } from "./types";

/**
 * Static fallback content.
 * The site renders from this data when MongoDB is not configured or reachable, and is
 * copied into the database automatically on first connection. After that
 * the database is the source of truth.
 */
export const staticData: PortfolioData = {
  profile: {
    full_name: "Rifat Rafiu",
    headline: "Materials Science & Engineering Researcher",
    tagline:
      "Computational materials scientist designing next-generation lead-free perovskites for clean, efficient solar energy.",
    bio: "I am an undergraduate researcher in the Department of Materials Science & Engineering at Khulna University of Engineering & Technology (KUET). My work sits at the intersection of first-principles theory and real devices: I use Density Functional Theory (DFT) and device simulation (SCAPS-1D) to discover and engineer lead-free perovskite and anti-perovskite materials for high-efficiency, environmentally friendly solar cells and optoelectronics. Alongside computation, I synthesize and characterize nanostructured materials such as Co3O4 for photocatalytic applications, combining experiment and theory to understand structure–property relationships. With 20+ peer-reviewed publications in leading journals, my goal is to accelerate the design of sustainable energy materials.",
    photo_url: "/rifat.png",
    cv_url: null,
    email: "rafiu2027045@stud.kuet.ac.bd",
    phone: null,
    location: "Khulna, Bangladesh",
    institution: "Khulna University of Engineering & Technology (KUET)",
    department: "Materials Science & Engineering",
    degree: "B.Sc. in Materials Science & Engineering",
    cgpa: "3.55 / 4.00",
    citations: 104,
    h_index: 6,
    i10_index: 4,
    publications_count: 20,
    google_scholar: "https://scholar.google.com/citations?user=Ul1yGmwAAAAJ&hl=en",
    researchgate: "https://www.researchgate.net/profile/Rifat-Rafiu",
    orcid: null,
    linkedin: "https://www.linkedin.com/in/rifat-rafiu-1545677i/",
    github: null,
    twitter: null,
    facebook: "https://www.facebook.com/rifat.rafiu/",
  },
  researchAreas: [
    { title: "Density Functional Theory (DFT)", description: "First-principles modeling of electronic, optical, mechanical and phonon properties of novel materials using CASTEP.", icon: "atom", sort_order: 1 },
    { title: "Lead-Free Perovskite Solar Cells", description: "Discovery and device-level design of non-toxic halide, oxide and anti-perovskite absorbers for high-efficiency photovoltaics.", icon: "sun", sort_order: 2 },
    { title: "Computational Materials Science", description: "Screening and engineering of energy materials through simulation, thermoelectrics and molecular dynamics.", icon: "cpu", sort_order: 3 },
    { title: "Nanomaterials & Photocatalysis", description: "Synthesis and characterization of nanostructures (e.g. Co3O4) for photocatalytic degradation of organic dyes.", icon: "flask-conical", sort_order: 4 },
    { title: "Optoelectronic Materials", description: "Tuning band structure and optical response of semiconductors for LEDs, detectors and light harvesting.", icon: "zap", sort_order: 5 },
    { title: "Sustainable Energy Technologies", description: "Materials innovation toward clean, affordable and environmentally responsible energy conversion.", icon: "leaf", sort_order: 6 },
  ],
  education: [
    { degree: "B.Sc. in Materials Science & Engineering", institution: "Khulna University of Engineering & Technology (KUET)", field: "Materials Science & Engineering", start_date: "March 2022", end_date: "Present", grade: "CGPA 3.55 / 4.00 (up to 4th Year, 1st Semester)", description: "Undergraduate program focused on computational and experimental materials science, nanomaterials, and sustainable energy technologies.", sort_order: 1 },
  ],
  experience: [
    { role: "Undergraduate Researcher", organization: "Khulna University of Engineering & Technology (KUET)", category: "research", start_date: "September 2025", end_date: "Present", location: "Khulna, Bangladesh", description: "Project: Photocatalytic Performance of Cobalt Oxide Nanostructures — A Combined Experimental-DFT Investigation.\nSynthesized and characterized Co3O4 nanostructures via a co-precipitation method for photocatalytic applications.\nInvestigated photocatalytic degradation performance by correlating optical band gap, charge transport, and surface properties.\nApplied DFT calculations alongside experiments to analyze structural and charge morphology, optical response, and photocatalytic activity enhancement.", sort_order: 1 },
    { role: "Industrial Training", organization: "BSRM Steels Ltd., Chattogram", category: "training", start_date: "27 Feb 2025", end_date: "5 Mar 2025", location: "Chattogram, Bangladesh", description: "Hands-on industrial training in large-scale steel manufacturing, processing and quality control.", sort_order: 2 },
    { role: "Member, Cultural Committee", organization: "Amar Ekushey Hall, KUET", category: "activity", start_date: "October 2024", end_date: "October 2025", location: "Khulna, Bangladesh", description: "Planned, coordinated and executed cultural programs, strengthening student engagement through teamwork, communication and organizational management.", sort_order: 3 },
    { role: "Q&A Teacher", organization: "Udvash Academic and Admission Care", category: "teaching", start_date: "March 2023", end_date: "August 2025", location: "Bangladesh", description: "Conducted Q&A-based academic sessions, clarifying concepts and guiding students to improve problem-solving skills and exam performance.", sort_order: 4 },
  ],
  skills: [
    { category: "Simulation Software", items: ["CASTEP", "VESTA", "SCAPS-1D", "LAMMPS", "CES EduPack"], sort_order: 1 },
    { category: "Programming", items: ["Python", "C", "C++"], sort_order: 2 },
    { category: "Characterization", items: ["XRD", "FTIR", "SEM", "Metallurgical Microscope"], sort_order: 3 },
    { category: "Synthesis", items: ["Hydrothermal synthesis", "Co-precipitation method"], sort_order: 4 },
    { category: "Data Analysis & Design", items: ["OriginPro", "MS Excel", "AutoCAD"], sort_order: 5 },
    { category: "Mechanical Testing", items: ["Universal Testing Machine", "Brinell & Rockwell Hardness", "Furnace operation", "Welding, Machining, Milling"], sort_order: 6 },
    { category: "Languages", items: ["Bangla (Native)", "English", "Hindi"], sort_order: 7 },
  ],
  awards: [
    { title: "Government Scholarship — HSC", issuer: "Government of Bangladesh", year: "HSC", description: "Awarded for outstanding academic results in the Higher Secondary Certificate examination.", sort_order: 1 },
    { title: "Government Scholarship — SSC", issuer: "Government of Bangladesh", year: "SSC", description: "Awarded for outstanding academic results in the Secondary School Certificate examination.", sort_order: 2 },
    { title: "Government Scholarship — JSC", issuer: "Government of Bangladesh", year: "JSC", description: "Awarded for outstanding academic results in the Junior School Certificate examination.", sort_order: 3 },
  ],
  peerReviews: [
    { journal: "Computational Condensed Matter", publisher: "Elsevier", reviews: 1, period: "June 2026", url: null, sort_order: 1 },
    { journal: "Journal of Power Sources", publisher: "Elsevier", reviews: 1, period: "June 2026", url: null, sort_order: 2 },
    { journal: "Surfaces and Interfaces", publisher: "Elsevier", reviews: 1, period: "July 2026", url: null, sort_order: 3 },
  ],
  certifications: [
    { title: "Certificate of Contribution — ICECTE 2026", issuer: "IEEE / Rajshahi University of Engineering & Technology", date: "January 2026", category: "conference", description: "Paper presented at the 5th International Conference on Electrical, Computer & Telecommunication Engineering (ICECTE 2026): “Hydrothermally Synthesized Urea-Derived Co3O4 Nanoparticles for Efficient Photocatalytic Degradation of Organic Dye.”", url: "https://doi.org/10.1109/ICECTE69292.2026.11429372", sort_order: 1 },
    { title: "Agent X — Certificate of Achievement", issuer: "NetCom Learning", date: "September 2025", category: "course", description: "Completed the NetCom Learning “Agent X” professional program.", url: null, sort_order: 2 },
    { title: "Certificate of Industrial Training", issuer: "BSRM Steels Ltd., Chattogram", date: "February–March 2025", category: "training", description: "Industrial training in the Production (SMS & CCM) department — steel manufacturing, processing and quality control.", url: null, sort_order: 3 },
    { title: "Certificate of Recognition — Cultural Committee", issuer: "Amar Ekushey Hall, KUET", date: "September 2025", category: "recognition", description: "Recognized for outstanding service and contributions as a member of the Amar Ekushey Hall committee 2024, reflecting teamwork and dedication.", url: null, sort_order: 4 },
  ],
  publications: [
    { title: "Comprehensive DFT and SCAPS-1D Study of Structural, Electronic, Optical, Mechanical, Phonon, Thermoelectric, and Photovoltaic Properties of Lead-Free Z3BrO (Z = K, Rb, Cs, Fr) Anti-Perovskites", authors: "R. Rafiu, M. S. Hasan Saikot, I. A. Apon, I. Boukhris, A. El-Rayyes, M. T. Khan, et al.", venue: "Journal of Computational Chemistry", year: 2025, volume: "46(24)", doi: "10.1002/jcc.70221", url: "https://doi.org/10.1002/jcc.70221", citations: 14, type: "journal", abstract: null, tags: ["DFT", "SCAPS-1D", "Anti-Perovskite", "Solar Cells"], featured: true, sort_order: 1 },
    { title: "Exploring A2CeCl6 (A = K, Rb, Cs, Fr) Lead-Free Double Perovskites via First-Principles and Device Simulation for Photovoltaic Applications", authors: "R. Rafiu, S. Hasan, A. El-Rayyes, I. A. Apon, M. Shkir, M. T. Khan, M. A. Sayed, et al.", venue: "Journal of Physics and Chemistry of Solids", year: 2025, volume: "113126", doi: "10.1016/j.jpcs.2025.113126", url: "https://doi.org/10.1016/j.jpcs.2025.113126", citations: 11, type: "journal", abstract: null, tags: ["Double Perovskite", "First-Principles", "Photovoltaics"], featured: true, sort_order: 2 },
    { title: "Comprehensive First-Principles Analysis and Device Simulations of Vacancy-Ordered D2CeX6 Double Perovskites for High-Efficiency Lead-Free Solar Cells", authors: "R. Rafiu, K. Kriaa, M. S. H. Saikot, M. A. Rahman, I. A. Apon, N. Sfina, M. T. Khan, et al.", venue: "RSC Advances", year: 2025, volume: "15(52), 44711-44748", doi: "10.1039/d5ra07162c", url: "https://doi.org/10.1039/d5ra07162c", citations: 9, type: "journal", abstract: null, tags: ["DFT", "Double Perovskite", "Solar Cells"], featured: true, sort_order: 3 },
    { title: "Exploring ACdX3 Perovskites: DFT Analysis of Stability, Electronic, Optical, and Mechanical Properties for Solar Applications", authors: "I. A. Apon, S. Jubayer, R. Boudissa, R. Kawsar, R. Rafiu, M. S. Refat, et al.", venue: "Journal of Inorganic and Organometallic Polymers and Materials", year: 2025, volume: "35(10)", doi: "10.1007/s10904-025-03821-5", url: "https://doi.org/10.1007/s10904-025-03821-5", citations: 18, type: "journal", abstract: null, tags: ["DFT", "Perovskite", "Solar"], featured: true, sort_order: 4 },
    { title: "Comprehensive Investigation of the Structural, Mechanical, Optical, and Thermoelectric Properties and Photovoltaic Performance of Lead-Free Novel Li2PdCl6 and Na2PdCl6 using DFT and SCAPS-1D Simulations", authors: "M. S. H. Saikot, R. Rafiu, I. Boukhris, M. A. Rahman, I. A. Apon, R. Kawsar, et al.", venue: "New Journal of Chemistry", year: 2025, volume: "49(39)", doi: "10.1039/d5nj02449h", url: "https://doi.org/10.1039/d5nj02449h", citations: 10, type: "journal", abstract: null, tags: ["DFT", "Thermoelectric", "Photovoltaics"], featured: true, sort_order: 5 },
    { title: "First-Principles Investigation of Structural, Electronic, Optical, Mechanical, and Phonon Properties of Pb- and Sn-Based Cubic Oxide Perovskites for Optoelectronic Applications", authors: "M. S. H. Saikot, R. Rafiu, I. A. Apon, A. El-Rayyes, M. A. Rahman, M. Shkir, et al.", venue: "RSC Advances", year: 2025, volume: "15(46), 39071-39091", doi: "10.1039/D5RA06065F", url: "https://doi.org/10.1039/D5RA06065F", citations: 6, type: "journal", abstract: null, tags: ["Oxide Perovskite", "Optoelectronics"], featured: false, sort_order: 6 },
    { title: "Comprehensive Analysis of Novel In2GeX6 (X = Cl, Br) Double Perovskites: Structural, Electronic, Optical, Mechanical, Phonon, Population Analyses and Solar Cell Performance", authors: "I. A. Apon, M. A. Hossain, R. Rafiu, M. S. H. Saikot, M. A. Rahman, J. R. Rajabathar, et al.", venue: "Physica B: Condensed Matter", year: 2025, volume: null, doi: null, url: null, citations: 8, type: "journal", abstract: null, tags: ["Double Perovskite", "Solar Cells"], featured: false, sort_order: 7 },
    { title: "Pressure-Tunable Optoelectronic and Photovoltaic Properties of Lead-Free ZnAgF3 and ZnAg(F0.5Cl0.5)3 Perovskites: A First-Principles and Device-Level Study", authors: "M. A. Rahman, R. Rafiu, I. A. Apon, M. S. H. Saikot, I. A. Ovi, N. Elboughdiri, et al.", venue: "Materials Chemistry and Physics", year: 2026, volume: "349, 131777", doi: "10.1016/j.matchemphys.2025.131777", url: "https://doi.org/10.1016/j.matchemphys.2025.131777", citations: 6, type: "journal", abstract: null, tags: ["Pressure Tuning", "Fluoride Perovskite"], featured: false, sort_order: 8 },
    { title: "First-Principles Calculations to Investigate Structural, Electronic, Optical, Elastic, Mechanical and Phonon Properties of Novel Q3GaBr6 (Q = Na, K) for Next-Generation Lead-Free Solar Cells", authors: "R. Rafiu, M. S. Hasan, M. A. Rahman, I. A. Apon, K. Kriaa, M. Benghanem, et al.", venue: "RSC Advances", year: 2026, volume: "16(9), 7803-7829", doi: "10.1039/D5RA10011A", url: "https://doi.org/10.1039/D5RA10011A", citations: 4, type: "journal", abstract: null, tags: ["DFT", "Halide Perovskite"], featured: false, sort_order: 9 },
    { title: "First-Principles Design and Photovoltaic Evaluation of Alkali-Based M3ClO Anti-Perovskites for High-Efficiency Lead-Free Solar Cells", authors: "M. S. Hasan Saikot, R. Rafiu, M. A. Rahman, I. A. Apon, A. El-Rayyes, M. T. Khan, et al.", venue: "New Journal of Chemistry", year: 2025, volume: "49(37)", doi: null, url: null, citations: 4, type: "journal", abstract: null, tags: ["Anti-Perovskite", "Solar Cells"], featured: false, sort_order: 10 },
    { title: "Unveiling the Electronic, Optical, and Mechanical Properties of Lithium-Based Perovskites for Next-Generation Solar Cells", authors: "I. A. Apon, M. R. Hasan, R. Rafiu, R. Kawsar, M. S. Hasan Saikot, M. A. Hossain, et al.", venue: "Journal of Inorganic and Organometallic Polymers and Materials", year: 2026, volume: "36(2)", doi: null, url: null, citations: 4, type: "journal", abstract: null, tags: ["Li Perovskite", "Optoelectronics"], featured: false, sort_order: 11 },
    { title: "Unveiling the Stability and Optoelectronic Potential of Alkali-Based L3FO Anti-Perovskites: A First-Principles Perspective", authors: "R. Rafiu, K. Kriaa, M. A. Rahman, I. A. Apon, S. AlFaify, C. Maatki, M. S. Hasan, et al.", venue: "The European Physical Journal Plus", year: 2026, volume: "141(1), 32", doi: "10.1140/epjp/s13360-025-07239-3", url: "https://doi.org/10.1140/epjp/s13360-025-07239-3", citations: 3, type: "journal", abstract: null, tags: ["Anti-Perovskite", "Stability"], featured: false, sort_order: 12 },
    { title: "First-Principles Study of Lead-Free A3InX6 (A = Rb, Cs; X = Cl, Br, I) Defect-Perovskites: Structural, Electronic, Optical, and Mechanical Properties", authors: "R. Rafiu, M. S. Hasan, I. A. Apon, M. A. Rahman, M. Benghanem, et al.", venue: "RSC Advances", year: 2026, volume: "16(24)", doi: null, url: null, citations: 2, type: "journal", abstract: null, tags: ["Defect Perovskite", "DFT"], featured: false, sort_order: 13 },
    { title: "Theoretical Investigation of Rb-Based Double Halide Perovskites for Photovoltaic, Photocatalytic Water Splitting, and CO2 Reduction Applications", authors: "R. Rafiu, I. A. Apon, M. A. Rahman, A. M. Alsuhaibani, M. S. Refat, M. Benghanem, et al.", venue: "RSC Advances", year: 2026, volume: "16(33)", doi: null, url: null, citations: 1, type: "journal", abstract: null, tags: ["Water Splitting", "CO2 Reduction"], featured: false, sort_order: 14 },
    { title: "Pressure-Tuned Li-Based Perovskites: A DFT-Guided Device-Level Design for Next-Generation Solar Cells", authors: "R. Rafiu, I. A. Apon, M. Benghanem, M. R. Hasan, I. A. Ovi, I. M. Ashraf, M. Shkir, et al.", venue: "Optics Communications", year: 2026, volume: "133084", doi: "10.1016/j.optcom.2026.133084", url: "https://doi.org/10.1016/j.optcom.2026.133084", citations: 1, type: "journal", abstract: null, tags: ["Pressure Tuning", "Device Design"], featured: false, sort_order: 15 },
    { title: "Comprehensive First-Principles Investigation of the Structural, Optical, Mechanical, Phononic, Thermal, Thermodynamic, and Thermoelectric Properties of A2GeX6 Double Halide Perovskites", authors: "M. A. Rahman, M. S. H. Saikot, R. Rafiu, M. S. I. Ria, Z. Bayhan, I. A. Apon, et al.", venue: "Energy Technology", year: 2026, volume: "14(1)", doi: null, url: null, citations: 1, type: "journal", abstract: null, tags: ["Thermoelectric", "Double Perovskite"], featured: false, sort_order: 16 },
    { title: "DFT-Based Study on the Physical and Molecular Dynamics Properties of Some E3IO Alkaline-Metal Anti-Perovskites for Renewable Energy Applications", authors: "R. Rafiu, M. A. Rahman, M. S. Hasan, I. A. Apon, M. Kashif, R. J. Ramalingam, et al.", venue: "International Journal of Modern Physics B", year: 2026, volume: "40(08), 2650078", doi: "10.1142/S0217979226500785", url: "https://doi.org/10.1142/S0217979226500785", citations: 0, type: "journal", abstract: null, tags: ["Molecular Dynamics", "Anti-Perovskite"], featured: false, sort_order: 17 },
    { title: "First-Principles and Device-Level Investigation of Physical and Photovoltaic Properties of Lead-Free JAgO3 (J = Nb, Ta) Oxide Perovskites", authors: "R. Rafiu, A. Attour, M. S. Hasan, M. A. Rahman, I. A. Apon, K. Kriaa, et al.", venue: "Optical Materials Express", year: 2026, volume: "16(5)", doi: null, url: null, citations: 0, type: "journal", abstract: null, tags: ["Oxide Perovskite", "Photovoltaics"], featured: false, sort_order: 18 },
    { title: "Exploring Lead-Free A2AgRhF6 Fluoride Double Perovskites for Photovoltaic Applications: A First-Principles and Device Simulation Study", authors: "I. A. Apon, R. Rafiu, M. S. Hasan, M. A. Rahman, S. S. Sumaia, A. M. Alsuhaibani, et al.", venue: "RSC Advances", year: 2026, volume: "16(26)", doi: null, url: null, citations: 0, type: "journal", abstract: null, tags: ["Fluoride Perovskite", "Device Simulation"], featured: false, sort_order: 19 },
    { title: "Hydrothermally Synthesized Urea-Derived Co3O4 Nanoparticles for Efficient Photocatalytic Degradation of Organic Dye", authors: "M. N. Mahmud, R. Rafiu, S. K. Paul, S. E. Enam, M. M. Hasan", venue: "5th Int. Conf. on Electrical, Computer & Telecommunication Engineering (ICECTE), IEEE", year: 2026, volume: null, doi: "10.1109/ICECTE69292.2026.11429372", url: "https://doi.org/10.1109/ICECTE69292.2026.11429372", citations: 0, type: "conference", abstract: null, tags: ["Nanoparticles", "Photocatalysis", "Experimental"], featured: false, sort_order: 20 },
  ],
};

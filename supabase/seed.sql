-- ===========================================================================
-- Rifat Rafiu — Research Portfolio : Seed data
-- Run AFTER schema.sql. Populates the site with real profile & publication
-- data so the dashboard starts with content you can then edit.
-- Safe to run once; re-running will add duplicate rows (truncate first if so).
-- ===========================================================================

-- Clear existing content (comment out if you want to keep data) --------------
truncate table public.publications, public.research_areas, public.education,
               public.experience, public.skills, public.awards,
               public.peer_reviews, public.certifications restart identity cascade;
delete from public.profile;

-- ---------------------------------------------------------------------------
-- PROFILE
-- ---------------------------------------------------------------------------
insert into public.profile (
  full_name, headline, tagline, bio, photo_url, email, location, institution, department,
  degree, cgpa, citations, h_index, i10_index, publications_count,
  google_scholar, researchgate, linkedin, facebook
) values (
  'Rifat Rafiu',
  'Materials Science & Engineering Researcher',
  'Computational materials scientist designing next-generation lead-free perovskites for clean, efficient solar energy.',
  'I am an undergraduate researcher in the Department of Materials Science & Engineering at Khulna University of Engineering & Technology (KUET). My work sits at the intersection of first-principles theory and real devices: I use Density Functional Theory (DFT) and device simulation (SCAPS-1D) to discover and engineer lead-free perovskite and anti-perovskite materials for high-efficiency, environmentally friendly solar cells and optoelectronics. Alongside computation, I synthesize and characterize nanostructured materials such as Co3O4 for photocatalytic applications, combining experiment and theory to understand structure–property relationships. With 20+ peer-reviewed publications and peer-review service for three Elsevier journals, my goal is to accelerate the design of sustainable energy materials.',
  '/rifat.png',
  'rafiu2027045@stud.kuet.ac.bd',
  'Khulna, Bangladesh',
  'Khulna University of Engineering & Technology (KUET)',
  'Materials Science & Engineering',
  'B.Sc. in Materials Science & Engineering',
  '3.55 / 4.00',
  104, 6, 4, 20,
  'https://scholar.google.com/citations?user=Ul1yGmwAAAAJ&hl=en',
  'https://www.researchgate.net/profile/Rifat-Rafiu',
  'https://www.linkedin.com/in/rifat-rafiu-1545677i/',
  'https://www.facebook.com/rifat.rafiu/'
);

-- ---------------------------------------------------------------------------
-- RESEARCH AREAS
-- ---------------------------------------------------------------------------
insert into public.research_areas (title, description, icon, sort_order) values
('Density Functional Theory (DFT)', 'First-principles modeling of electronic, optical, mechanical and phonon properties of novel materials using CASTEP.', 'atom', 1),
('Lead-Free Perovskite Solar Cells', 'Discovery and device-level design of non-toxic halide, oxide and anti-perovskite absorbers for high-efficiency photovoltaics.', 'sun', 2),
('Computational Materials Science', 'Screening and engineering of energy materials through simulation, thermoelectrics and molecular dynamics.', 'cpu', 3),
('Nanomaterials & Photocatalysis', 'Synthesis and characterization of nanostructures (e.g. Co3O4) for photocatalytic degradation of organic dyes.', 'flask-conical', 4),
('Optoelectronic Materials', 'Tuning band structure and optical response of semiconductors for LEDs, detectors and light harvesting.', 'zap', 5),
('Sustainable Energy Technologies', 'Materials innovation toward clean, affordable and environmentally responsible energy conversion.', 'leaf', 6);

-- ---------------------------------------------------------------------------
-- EDUCATION
-- ---------------------------------------------------------------------------
insert into public.education (degree, institution, field, start_date, end_date, grade, description, sort_order) values
('B.Sc. in Materials Science & Engineering', 'Khulna University of Engineering & Technology (KUET)', 'Materials Science & Engineering', 'March 2022', 'Present', 'CGPA 3.55 / 4.00 (up to 4th Year, 1st Semester)', 'Undergraduate program focused on computational and experimental materials science, nanomaterials, and sustainable energy technologies.', 1);

-- ---------------------------------------------------------------------------
-- EXPERIENCE  (research, training, activities)
-- ---------------------------------------------------------------------------
insert into public.experience (role, organization, category, start_date, end_date, location, description, sort_order) values
('Undergraduate Researcher', 'Khulna University of Engineering & Technology (KUET)', 'research', 'September 2025', 'Present', 'Khulna, Bangladesh',
 'Project: Photocatalytic Performance of Cobalt Oxide Nanostructures — A Combined Experimental-DFT Investigation.
Synthesized and characterized Co3O4 nanostructures via a co-precipitation method for photocatalytic applications.
Investigated photocatalytic degradation performance by correlating optical band gap, charge transport, and surface properties.
Applied DFT calculations alongside experiments to analyze structural and charge morphology, optical response, and photocatalytic activity enhancement.', 1),
('Industrial Training', 'BSRM Steels Ltd., Chattogram', 'training', '27 Feb 2025', '5 Mar 2025', 'Chattogram, Bangladesh',
 'Hands-on industrial training in large-scale steel manufacturing, processing and quality control.', 2),
('Member, Cultural Committee', 'Amar Ekushey Hall, KUET', 'activity', 'October 2024', 'October 2025', 'Khulna, Bangladesh',
 'Planned, coordinated and executed cultural programs, strengthening student engagement through teamwork, communication and organizational management.', 3),
('Q&A Teacher', 'Udvash Academic and Admission Care', 'teaching', 'March 2023', 'August 2025', 'Bangladesh',
 'Conducted Q&A-based academic sessions, clarifying concepts and guiding students to improve problem-solving skills and exam performance.', 4);

-- ---------------------------------------------------------------------------
-- SKILLS
-- ---------------------------------------------------------------------------
insert into public.skills (category, items, sort_order) values
('Simulation Software', array['CASTEP','VESTA','SCAPS-1D','LAMMPS','CES EduPack'], 1),
('Programming', array['Python','C','C++'], 2),
('Characterization', array['XRD','FTIR','SEM','Metallurgical Microscope'], 3),
('Synthesis', array['Hydrothermal synthesis','Co-precipitation method'], 4),
('Data Analysis & Design', array['OriginPro','MS Excel','AutoCAD'], 5),
('Mechanical Testing', array['Universal Testing Machine','Brinell & Rockwell Hardness','Furnace operation','Welding, Machining, Milling'], 6),
('Languages', array['Bangla (Native)','English','Hindi'], 7);

-- ---------------------------------------------------------------------------
-- AWARDS & HONORS
-- ---------------------------------------------------------------------------
insert into public.awards (title, issuer, year, description, sort_order) values
('Government Scholarship — HSC', 'Government of Bangladesh', 'HSC', 'Awarded for outstanding academic results in the Higher Secondary Certificate examination.', 1),
('Government Scholarship — SSC', 'Government of Bangladesh', 'SSC', 'Awarded for outstanding academic results in the Secondary School Certificate examination.', 2),
('Government Scholarship — JSC', 'Government of Bangladesh', 'JSC', 'Awarded for outstanding academic results in the Junior School Certificate examination.', 3);

-- ---------------------------------------------------------------------------
-- PUBLICATIONS  (from Google Scholar + CV)
-- ---------------------------------------------------------------------------
insert into public.publications (title, authors, venue, year, volume, doi, url, citations, type, featured, sort_order) values
('Comprehensive DFT and SCAPS-1D Study of Structural, Electronic, Optical, Mechanical, Phonon, Thermoelectric, and Photovoltaic Properties of Lead-Free Z3BrO (Z = K, Rb, Cs, Fr) Anti-Perovskites',
 'R. Rafiu, M. S. Hasan Saikot, I. A. Apon, I. Boukhris, A. El-Rayyes, M. T. Khan, et al.',
 'Journal of Computational Chemistry', 2025, '46(24)', '10.1002/jcc.70221', 'https://doi.org/10.1002/jcc.70221', 14, 'journal', true, 1),

('Exploring A2CeCl6 (A = K, Rb, Cs, Fr) Lead-Free Double Perovskites via First-Principles and Device Simulation for Photovoltaic Applications',
 'R. Rafiu, S. Hasan, A. El-Rayyes, I. A. Apon, M. Shkir, M. T. Khan, M. A. Sayed, et al.',
 'Journal of Physics and Chemistry of Solids', 2025, '113126', '10.1016/j.jpcs.2025.113126', 'https://doi.org/10.1016/j.jpcs.2025.113126', 11, 'journal', true, 2),

('Comprehensive First-Principles Analysis and Device Simulations of Vacancy-Ordered D2CeX6 Double Perovskites for High-Efficiency Lead-Free Solar Cells',
 'R. Rafiu, K. Kriaa, M. S. H. Saikot, M. A. Rahman, I. A. Apon, N. Sfina, M. T. Khan, et al.',
 'RSC Advances', 2025, '15(52), 44711-44748', '10.1039/d5ra07162c', 'https://doi.org/10.1039/d5ra07162c', 9, 'journal', true, 3),

('Exploring ACdX3 Perovskites: DFT Analysis of Stability, Electronic, Optical, and Mechanical Properties for Solar Applications',
 'I. A. Apon, S. Jubayer, R. Boudissa, R. Kawsar, R. Rafiu, M. S. Refat, et al.',
 'Journal of Inorganic and Organometallic Polymers and Materials', 2025, '35(10)', '10.1007/s10904-025-03821-5', 'https://doi.org/10.1007/s10904-025-03821-5', 18, 'journal', true, 4),

('Comprehensive Investigation of the Structural, Mechanical, Optical, and Thermoelectric Properties and Photovoltaic Performance of Lead-Free Novel Li2PdCl6 and Na2PdCl6 using DFT and SCAPS-1D Simulations',
 'M. S. H. Saikot, R. Rafiu, I. Boukhris, M. A. Rahman, I. A. Apon, R. Kawsar, et al.',
 'New Journal of Chemistry', 2025, '49(39)', '10.1039/d5nj02449h', 'https://doi.org/10.1039/d5nj02449h', 10, 'journal', true, 5),

('First-Principles Investigation of Structural, Electronic, Optical, Mechanical, and Phonon Properties of Pb- and Sn-Based Cubic Oxide Perovskites for Optoelectronic Applications',
 'M. S. H. Saikot, R. Rafiu, I. A. Apon, A. El-Rayyes, M. A. Rahman, M. Shkir, et al.',
 'RSC Advances', 2025, '15(46), 39071-39091', '10.1039/D5RA06065F', 'https://doi.org/10.1039/D5RA06065F', 6, 'journal', false, 6),

('Comprehensive Analysis of Novel In2GeX6 (X = Cl, Br) Double Perovskites: Structural, Electronic, Optical, Mechanical, Phonon, Population Analyses and Solar Cell Performance',
 'I. A. Apon, M. A. Hossain, R. Rafiu, M. S. H. Saikot, M. A. Rahman, J. R. Rajabathar, et al.',
 'Physica B: Condensed Matter', 2025, null, null, null, 8, 'journal', false, 7),

('Pressure-Tunable Optoelectronic and Photovoltaic Properties of Lead-Free ZnAgF3 and ZnAg(F0.5Cl0.5)3 Perovskites: A First-Principles and Device-Level Study',
 'M. A. Rahman, R. Rafiu, I. A. Apon, M. S. H. Saikot, I. A. Ovi, N. Elboughdiri, et al.',
 'Materials Chemistry and Physics', 2026, '349, 131777', '10.1016/j.matchemphys.2025.131777', 'https://doi.org/10.1016/j.matchemphys.2025.131777', 6, 'journal', false, 8),

('First-Principles Calculations to Investigate Structural, Electronic, Optical, Elastic, Mechanical and Phonon Properties of Novel Q3GaBr6 (Q = Na, K) for Next-Generation Lead-Free Solar Cells',
 'R. Rafiu, M. S. Hasan, M. A. Rahman, I. A. Apon, K. Kriaa, M. Benghanem, et al.',
 'RSC Advances', 2026, '16(9), 7803-7829', '10.1039/D5RA10011A', 'https://doi.org/10.1039/D5RA10011A', 4, 'journal', false, 9),

('First-Principles Design and Photovoltaic Evaluation of Alkali-Based M3ClO Anti-Perovskites for High-Efficiency Lead-Free Solar Cells',
 'M. S. Hasan Saikot, R. Rafiu, M. A. Rahman, I. A. Apon, A. El-Rayyes, M. T. Khan, et al.',
 'New Journal of Chemistry', 2025, '49(37)', null, null, 4, 'journal', false, 10),

('Unveiling the Electronic, Optical, and Mechanical Properties of Lithium-Based Perovskites for Next-Generation Solar Cells',
 'I. A. Apon, M. R. Hasan, R. Rafiu, R. Kawsar, M. S. Hasan Saikot, M. A. Hossain, et al.',
 'Journal of Inorganic and Organometallic Polymers and Materials', 2026, '36(2)', null, null, 4, 'journal', false, 11),

('Unveiling the Stability and Optoelectronic Potential of Alkali-Based L3FO Anti-Perovskites: A First-Principles Perspective',
 'R. Rafiu, K. Kriaa, M. A. Rahman, I. A. Apon, S. AlFaify, C. Maatki, M. S. Hasan, et al.',
 'The European Physical Journal Plus', 2026, '141(1), 32', '10.1140/epjp/s13360-025-07239-3', 'https://doi.org/10.1140/epjp/s13360-025-07239-3', 3, 'journal', false, 12),

('First-Principles Study of Lead-Free A3InX6 (A = Rb, Cs; X = Cl, Br, I) Defect-Perovskites: Structural, Electronic, Optical, and Mechanical Properties',
 'R. Rafiu, M. S. Hasan, I. A. Apon, M. A. Rahman, M. Benghanem, et al.',
 'RSC Advances', 2026, '16(24)', null, null, 2, 'journal', false, 13),

('Theoretical Investigation of Rb-Based Double Halide Perovskites for Photovoltaic, Photocatalytic Water Splitting, and CO2 Reduction Applications',
 'R. Rafiu, I. A. Apon, M. A. Rahman, A. M. Alsuhaibani, M. S. Refat, M. Benghanem, et al.',
 'RSC Advances', 2026, '16(33)', null, null, 1, 'journal', false, 14),

('Pressure-Tuned Li-Based Perovskites: A DFT-Guided Device-Level Design for Next-Generation Solar Cells',
 'R. Rafiu, I. A. Apon, M. Benghanem, M. R. Hasan, I. A. Ovi, I. M. Ashraf, M. Shkir, et al.',
 'Optics Communications', 2026, '133084', '10.1016/j.optcom.2026.133084', 'https://doi.org/10.1016/j.optcom.2026.133084', 1, 'journal', false, 15),

('Comprehensive First-Principles Investigation of the Structural, Optical, Mechanical, Phononic, Thermal, Thermodynamic, and Thermoelectric Properties of A2GeX6 Double Halide Perovskites',
 'M. A. Rahman, M. S. H. Saikot, R. Rafiu, M. S. I. Ria, Z. Bayhan, I. A. Apon, et al.',
 'Energy Technology', 2026, '14(1)', null, null, 1, 'journal', false, 16),

('DFT-Based Study on the Physical and Molecular Dynamics Properties of Some E3IO Alkaline-Metal Anti-Perovskites for Renewable Energy Applications',
 'R. Rafiu, M. A. Rahman, M. S. Hasan, I. A. Apon, M. Kashif, R. J. Ramalingam, et al.',
 'International Journal of Modern Physics B', 2026, '40(08), 2650078', '10.1142/S0217979226500785', 'https://doi.org/10.1142/S0217979226500785', 0, 'journal', false, 17),

('First-Principles and Device-Level Investigation of Physical and Photovoltaic Properties of Lead-Free JAgO3 (J = Nb, Ta) Oxide Perovskites',
 'R. Rafiu, A. Attour, M. S. Hasan, M. A. Rahman, I. A. Apon, K. Kriaa, et al.',
 'Optical Materials Express', 2026, '16(5)', null, null, 0, 'journal', false, 18),

('Exploring Lead-Free A2AgRhF6 Fluoride Double Perovskites for Photovoltaic Applications: A First-Principles and Device Simulation Study',
 'I. A. Apon, R. Rafiu, M. S. Hasan, M. A. Rahman, S. S. Sumaia, A. M. Alsuhaibani, et al.',
 'RSC Advances', 2026, '16(26)', null, null, 0, 'journal', false, 19),

('Hydrothermally Synthesized Urea-Derived Co3O4 Nanoparticles for Efficient Photocatalytic Degradation of Organic Dye',
 'M. N. Mahmud, R. Rafiu, S. K. Paul, S. E. Enam, M. M. Hasan',
 '5th Int. Conf. on Electrical, Computer & Telecommunication Engineering (ICECTE), IEEE', 2026, null, '10.1109/ICECTE69292.2026.11429372', 'https://doi.org/10.1109/ICECTE69292.2026.11429372', 0, 'conference', false, 20);

-- ---------------------------------------------------------------------------
-- PEER REVIEWS  (Elsevier reviewer recognitions)
-- ---------------------------------------------------------------------------
insert into public.peer_reviews (journal, publisher, reviews, period, sort_order) values
('Computational Condensed Matter', 'Elsevier', 1, 'June 2026', 1),
('Journal of Power Sources', 'Elsevier', 1, 'June 2026', 2),
('Surfaces and Interfaces', 'Elsevier', 1, 'July 2026', 3);

-- ---------------------------------------------------------------------------
-- CERTIFICATIONS  (conferences, courses, training, recognitions)
-- ---------------------------------------------------------------------------
insert into public.certifications (title, issuer, date, category, description, url, sort_order) values
('Certificate of Contribution — ICECTE 2026', 'IEEE / Rajshahi University of Engineering & Technology', 'January 2026', 'conference',
 'Paper presented at the 5th International Conference on Electrical, Computer & Telecommunication Engineering (ICECTE 2026): “Hydrothermally Synthesized Urea-Derived Co3O4 Nanoparticles for Efficient Photocatalytic Degradation of Organic Dye.”',
 'https://doi.org/10.1109/ICECTE69292.2026.11429372', 1),
('Agent X — Certificate of Achievement', 'NetCom Learning', 'September 2025', 'course',
 'Completed the NetCom Learning “Agent X” professional program.', null, 2),
('Certificate of Industrial Training', 'BSRM Steels Ltd., Chattogram', 'February–March 2025', 'training',
 'Industrial training in the Production (SMS & CCM) department — steel manufacturing, processing and quality control.', null, 3),
('Certificate of Recognition — Cultural Committee', 'Amar Ekushey Hall, KUET', 'September 2025', 'recognition',
 'Recognized for outstanding service and contributions as a member of the Amar Ekushey Hall committee 2024, reflecting teamwork and dedication.', null, 4);

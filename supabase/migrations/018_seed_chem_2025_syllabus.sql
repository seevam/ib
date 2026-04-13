-- Migration 018: Seed IB 2025 Chemistry syllabus topics for CHEM_SL and CHEM_HL
-- 21 topics for SL (Reactivity 1.4 excluded), 22 topics for HL

DO $$
DECLARE
  chem_sl_id INTEGER;
  chem_hl_id INTEGER;
BEGIN
  SELECT id INTO chem_sl_id FROM subjects WHERE name = 'CHEM_SL';
  SELECT id INTO chem_hl_id FROM subjects WHERE name = 'CHEM_HL';

  -- Replace existing curriculum topics for both levels
  DELETE FROM topics WHERE subject_id IN (chem_sl_id, chem_hl_id);

  -- ============================================================
  -- STRUCTURE 1.1 — Models of the particulate nature of matter
  -- ============================================================

  -- SL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_sl_id,
    'Models of the particulate nature of matter',
    'Structure 1.1',
    1,
    5,
    'easy',
    ARRAY[
      'Confusing physical and chemical changes of state',
      'Incorrect particle diagrams for gases (particles too close or too ordered)',
      'Mixing up properties of solids, liquids and gases',
      'Failing to link macroscopic properties to the kinetic model'
    ],
    ARRAY[
      'Describe the kinetic particle model for solids, liquids and gases in terms of arrangement, movement and energy of particles',
      'Explain the macroscopic properties of solids, liquids and gases (compressibility, shape, volume, fluidity) using the kinetic model',
      'Describe and explain changes of state (melting, boiling, sublimation) in terms of energy changes and intermolecular forces',
      'Distinguish between pure substances and mixtures',
      'Describe and explain methods of separating mixtures: distillation, chromatography, filtration and crystallisation',
      'Distinguish between elements and compounds'
    ]
  );

  -- HL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_hl_id,
    'Models of the particulate nature of matter',
    'Structure 1.1',
    1,
    5,
    'easy',
    ARRAY[
      'Confusing physical and chemical changes of state',
      'Incorrect particle diagrams for gases (particles too close or too ordered)',
      'Mixing up properties of solids, liquids and gases',
      'Failing to link macroscopic properties to the kinetic model',
      'Misinterpreting Maxwell-Boltzmann distribution curves'
    ],
    ARRAY[
      'Describe the kinetic particle model for solids, liquids and gases in terms of arrangement, movement and energy of particles',
      'Explain the macroscopic properties of solids, liquids and gases (compressibility, shape, volume, fluidity) using the kinetic model',
      'Describe and explain changes of state (melting, boiling, sublimation) in terms of energy changes and intermolecular forces',
      'Distinguish between pure substances and mixtures',
      'Describe and explain methods of separating mixtures: distillation, chromatography, filtration and crystallisation',
      'Distinguish between elements and compounds',
      'Describe and interpret Maxwell-Boltzmann energy distribution curves for a fixed amount of gas at different temperatures',
      'Explain the effect of temperature on the proportion of particles with energy greater than a given threshold'
    ]
  );


  -- ============================================================
  -- STRUCTURE 1.2 — The nuclear atom
  -- ============================================================

  -- SL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_sl_id,
    'The nuclear atom',
    'Structure 1.2',
    2,
    5,
    'easy',
    ARRAY[
      'Confusing mass number with atomic number',
      'Forgetting that isotopes have the same atomic number but different mass numbers',
      'Incorrectly calculating relative atomic mass from isotopic abundance data',
      'Not appreciating that electrons have negligible mass'
    ],
    ARRAY[
      'Describe the structure of the atom: a dense, positively charged nucleus containing protons and neutrons, surrounded by electrons',
      'Define atomic number (Z) as the number of protons, and mass number (A) as the total number of protons and neutrons',
      'Define isotopes as atoms of the same element with the same atomic number but different mass numbers',
      'Describe how a mass spectrometer is used to determine the relative atomic mass of an element from its isotopic abundances',
      'Calculate relative atomic mass from isotopic abundance and mass data'
    ]
  );

  -- HL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_hl_id,
    'The nuclear atom',
    'Structure 1.2',
    2,
    5,
    'easy',
    ARRAY[
      'Confusing mass number with atomic number',
      'Forgetting that isotopes have the same atomic number but different mass numbers',
      'Incorrectly calculating relative atomic mass from isotopic abundance data',
      'Not appreciating that electrons have negligible mass',
      'Errors in writing nuclear equations for radioactive decay'
    ],
    ARRAY[
      'Describe the structure of the atom: a dense, positively charged nucleus containing protons and neutrons, surrounded by electrons',
      'Define atomic number (Z) as the number of protons, and mass number (A) as the total number of protons and neutrons',
      'Define isotopes as atoms of the same element with the same atomic number but different mass numbers',
      'Describe how a mass spectrometer is used to determine the relative atomic mass of an element from its isotopic abundances',
      'Calculate relative atomic mass from isotopic abundance and mass data',
      'Describe the types of radioactive decay: alpha (α), beta-minus (β⁻) and gamma (γ)',
      'Write and balance nuclear equations for radioactive decay, applying conservation of mass number and atomic number'
    ]
  );


  -- ============================================================
  -- STRUCTURE 1.3 — Electron configurations
  -- ============================================================

  -- SL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_sl_id,
    'Electron configurations',
    'Structure 1.3',
    3,
    5,
    'medium',
    ARRAY[
      'Writing incorrect electron configurations for d-block elements (e.g. Cr, Cu)',
      'Confusing sub-shell notation with shell notation',
      'Misreading successive ionisation energy graphs to determine group number',
      'Forgetting that ionisation energy has a general increase across a period with two anomalies'
    ],
    ARRAY[
      'Describe the arrangement of electrons in main energy levels (shells), sub-levels (s, p, d) and orbitals',
      'State the maximum number of electrons in each sub-level: s (2), p (6), d (10)',
      'Write full and condensed electron configurations for elements up to Z = 36',
      'Explain the trends in successive ionisation energies of an element and use these to deduce its group in the periodic table',
      'Explain the general trend in first ionisation energy across a period and down a group',
      'Explain the anomalies in first ionisation energy between groups 2 and 13, and between groups 15 and 16'
    ]
  );

  -- HL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_hl_id,
    'Electron configurations',
    'Structure 1.3',
    3,
    5,
    'medium',
    ARRAY[
      'Writing incorrect electron configurations for d-block elements (e.g. Cr, Cu)',
      'Confusing sub-shell notation with shell notation',
      'Misreading successive ionisation energy graphs to determine group number',
      'Forgetting the anomalous configurations of Cr ([Ar] 3d⁵ 4s¹) and Cu ([Ar] 3d¹⁰ 4s¹)',
      'Incorrectly applying Hund''s rule when filling degenerate orbitals'
    ],
    ARRAY[
      'Describe the arrangement of electrons in main energy levels (shells), sub-levels (s, p, d) and orbitals',
      'State the maximum number of electrons in each sub-level: s (2), p (6), d (10)',
      'Write full and condensed electron configurations for elements up to Z = 36',
      'Explain the trends in successive ionisation energies of an element and use these to deduce its group in the periodic table',
      'Explain the general trend in first ionisation energy across a period and down a group',
      'Explain the anomalies in first ionisation energy between groups 2 and 13, and between groups 15 and 16',
      'Apply the Aufbau principle, Pauli exclusion principle and Hund''s rule to write orbital diagrams',
      'Explain the anomalous electron configurations of Cr and Cu in terms of the extra stability of half-filled and fully-filled d sub-levels'
    ]
  );


  -- ============================================================
  -- STRUCTURE 1.4 — Counting particles by mass: the mole
  -- ============================================================

  -- SL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_sl_id,
    'Counting particles by mass: the mole',
    'Structure 1.4',
    4,
    6,
    'medium',
    ARRAY[
      'Confusing empirical formula with molecular formula',
      'Forgetting to divide by Avogadro''s constant when converting moles to number of particles',
      'Arithmetic errors when calculating molar mass of compounds',
      'Not simplifying the empirical formula to the lowest whole-number ratio'
    ],
    ARRAY[
      'Define the mole as the amount of substance containing the same number of particles as there are atoms in exactly 12 g of carbon-12',
      'State the value of Avogadro''s constant: Nₐ = 6.02 × 10²³ mol⁻¹',
      'Interconvert between amount in moles, mass and molar mass using n = m / M',
      'Interconvert between amount in moles and number of particles using N = n × Nₐ',
      'Determine the empirical formula of a compound from percentage composition or experimental data',
      'Determine the molecular formula from the empirical formula and the molar mass',
      'Calculate the percentage composition by mass of a compound from its formula'
    ]
  );

  -- HL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_hl_id,
    'Counting particles by mass: the mole',
    'Structure 1.4',
    4,
    6,
    'medium',
    ARRAY[
      'Confusing empirical formula with molecular formula',
      'Forgetting to divide by Avogadro''s constant when converting moles to number of particles',
      'Arithmetic errors when calculating molar mass of compounds',
      'Not simplifying the empirical formula to the lowest whole-number ratio',
      'Errors in combustion analysis calculations (not accounting for all atoms)'
    ],
    ARRAY[
      'Define the mole as the amount of substance containing the same number of particles as there are atoms in exactly 12 g of carbon-12',
      'State the value of Avogadro''s constant: Nₐ = 6.02 × 10²³ mol⁻¹',
      'Interconvert between amount in moles, mass and molar mass using n = m / M',
      'Interconvert between amount in moles and number of particles using N = n × Nₐ',
      'Determine the empirical formula of a compound from percentage composition or experimental data',
      'Determine the molecular formula from the empirical formula and the molar mass',
      'Calculate the percentage composition by mass of a compound from its formula',
      'Determine empirical and molecular formulas from combustion analysis data (mass of CO₂ and H₂O produced)'
    ]
  );


  -- ============================================================
  -- STRUCTURE 1.5 — Ideal gases
  -- ============================================================

  -- SL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_sl_id,
    'Ideal gases',
    'Structure 1.5',
    5,
    5,
    'medium',
    ARRAY[
      'Using Celsius instead of Kelvin in gas law calculations',
      'Forgetting to convert pressure units to Pa when using R = 8.314 J K⁻¹ mol⁻¹',
      'Misidentifying which variables are constant when applying individual gas laws',
      'Not stating standard conditions correctly (STP: 0 °C, 100 kPa)'
    ],
    ARRAY[
      'State the assumptions of the ideal gas model: point particles, no intermolecular forces, elastic collisions',
      'Apply Boyle''s law (P ∝ 1/V at constant T and n) to solve problems',
      'Apply Charles'' law (V ∝ T at constant P and n) to solve problems',
      'Apply Avogadro''s law (V ∝ n at constant T and P) to solve problems',
      'Solve problems using the ideal gas law: PV = nRT',
      'State and use the molar volume of an ideal gas at STP (0 °C, 100 kPa) = 22.7 L mol⁻¹',
      'Convert between Celsius and Kelvin: T(K) = T(°C) + 273'
    ]
  );

  -- HL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_hl_id,
    'Ideal gases',
    'Structure 1.5',
    5,
    5,
    'medium',
    ARRAY[
      'Using Celsius instead of Kelvin in gas law calculations',
      'Forgetting to convert pressure units to Pa when using R = 8.314 J K⁻¹ mol⁻¹',
      'Misidentifying which variables are constant when applying individual gas laws',
      'Incorrectly predicting when real gases deviate most from ideal behaviour'
    ],
    ARRAY[
      'State the assumptions of the ideal gas model: point particles, no intermolecular forces, elastic collisions',
      'Apply Boyle''s law (P ∝ 1/V at constant T and n) to solve problems',
      'Apply Charles'' law (V ∝ T at constant P and n) to solve problems',
      'Apply Avogadro''s law (V ∝ n at constant T and P) to solve problems',
      'Solve problems using the ideal gas law: PV = nRT',
      'State and use the molar volume of an ideal gas at STP (0 °C, 100 kPa) = 22.7 L mol⁻¹',
      'Convert between Celsius and Kelvin: T(K) = T(°C) + 273',
      'Explain why real gases deviate from ideal behaviour at high pressure and low temperature',
      'Explain deviations in terms of non-negligible particle volume and intermolecular attractive forces'
    ]
  );


  -- ============================================================
  -- STRUCTURE 2.1 — The ionic model
  -- ============================================================

  -- SL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_sl_id,
    'The ionic model',
    'Structure 2.1',
    6,
    5,
    'medium',
    ARRAY[
      'Mixing up cation and anion charges for transition metals',
      'Forgetting that ionic compounds must be overall charge-neutral',
      'Confusing ionic radius trends with atomic radius trends',
      'Incorrectly assigning oxidation states in polyatomic ions'
    ],
    ARRAY[
      'Describe ionic bonding as the electrostatic attraction between oppositely charged ions formed by electron transfer',
      'Predict the charges of ions formed by s- and p-block elements from their position in the periodic table',
      'Explain the relationship between ionic charge, ionic radius and the strength of the ionic lattice',
      'Explain the properties of ionic compounds: high melting and boiling points, brittleness, electrical conductivity when molten or dissolved',
      'Write correct formulas for ionic compounds using ion charges to achieve overall charge neutrality',
      'Define oxidation state and assign oxidation states to elements in compounds and ions',
      'Describe the structure of ionic compounds as a three-dimensional lattice of alternating cations and anions'
    ]
  );

  -- HL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_hl_id,
    'The ionic model',
    'Structure 2.1',
    6,
    5,
    'medium',
    ARRAY[
      'Mixing up cation and anion charges for transition metals',
      'Forgetting that ionic compounds must be overall charge-neutral',
      'Direction errors in Born-Haber cycles (endothermic vs exothermic steps)',
      'Confusing lattice enthalpy of formation with lattice enthalpy of dissociation'
    ],
    ARRAY[
      'Describe ionic bonding as the electrostatic attraction between oppositely charged ions formed by electron transfer',
      'Predict the charges of ions formed by s- and p-block elements from their position in the periodic table',
      'Explain the relationship between ionic charge, ionic radius and the strength of the ionic lattice',
      'Explain the properties of ionic compounds: high melting and boiling points, brittleness, electrical conductivity when molten or dissolved',
      'Write correct formulas for ionic compounds using ion charges to achieve overall charge neutrality',
      'Define oxidation state and assign oxidation states to elements in compounds and ions',
      'Construct a Born-Haber cycle for a Group 1 or Group 2 ionic compound and use it to calculate lattice enthalpy',
      'Explain trends in lattice enthalpies in terms of ionic charge and ionic radius'
    ]
  );


  -- ============================================================
  -- STRUCTURE 2.2 — The covalent model
  -- ============================================================

  -- SL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_sl_id,
    'The covalent model',
    'Structure 2.2',
    7,
    7,
    'medium',
    ARRAY[
      'Drawing Lewis structures with incorrect electron counts',
      'Applying VSEPR incorrectly when lone pairs are present on the central atom',
      'Confusing bond polarity with overall molecular polarity',
      'Forgetting that a molecule with polar bonds can still be non-polar due to symmetry'
    ],
    ARRAY[
      'Describe covalent bonding as the sharing of one or more electron pairs between non-metal atoms',
      'Draw Lewis (electron dot) structures for molecules and polyatomic ions, including those with expanded octets',
      'Apply VSEPR theory to predict the electron domain geometry and molecular geometry for species with 2–6 electron domains',
      'Predict and explain bond angles in molecules and ions using VSEPR',
      'Define electronegativity and use Pauling values to predict bond polarity',
      'Distinguish between polar and non-polar bonds, and between polar and non-polar molecules',
      'Differentiate between sigma (σ) bonds (end-on overlap) and pi (π) bonds (sideways overlap)',
      'Relate the number of bonds between two atoms to bond length and bond strength'
    ]
  );

  -- HL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_hl_id,
    'The covalent model',
    'Structure 2.2',
    7,
    7,
    'hard',
    ARRAY[
      'Drawing Lewis structures with incorrect electron counts',
      'Applying VSEPR incorrectly when lone pairs are present on the central atom',
      'Confusing bond polarity with overall molecular polarity',
      'Incorrectly assigning hybridisation — forgetting that triple bonds involve sp hybridisation',
      'Not recognising delocalisation in resonance structures'
    ],
    ARRAY[
      'Describe covalent bonding as the sharing of one or more electron pairs between non-metal atoms',
      'Draw Lewis (electron dot) structures for molecules and polyatomic ions, including those with expanded octets',
      'Apply VSEPR theory to predict the electron domain geometry and molecular geometry for species with 2–6 electron domains',
      'Predict and explain bond angles in molecules and ions using VSEPR',
      'Define electronegativity and use Pauling values to predict bond polarity',
      'Distinguish between polar and non-polar bonds, and between polar and non-polar molecules',
      'Differentiate between sigma (σ) bonds and pi (π) bonds',
      'Relate the number of bonds between two atoms to bond length and bond strength',
      'Describe sp³, sp² and sp hybridisation and relate hybridisation to molecular geometry',
      'Explain delocalisation of electrons in molecules such as benzene and the carbonate ion using resonance structures'
    ]
  );


  -- ============================================================
  -- STRUCTURE 2.3 — The metallic model
  -- ============================================================

  -- SL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_sl_id,
    'The metallic model',
    'Structure 2.3',
    8,
    4,
    'easy',
    ARRAY[
      'Describing metallic bonding without explicitly mentioning delocalised electrons',
      'Confusing metallic properties with ionic properties',
      'Not explaining why metals are malleable in terms of the bonding model'
    ],
    ARRAY[
      'Describe metallic bonding as the electrostatic attraction between a lattice of positive metal ions and a sea of delocalised electrons',
      'Explain the physical properties of metals (electrical conductivity, thermal conductivity, malleability, ductility, high melting point) using the metallic bonding model',
      'Explain why metals are good conductors of electricity in terms of delocalised electrons',
      'Describe alloys as mixtures of metals and explain how alloying changes properties such as hardness and melting point'
    ]
  );

  -- HL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_hl_id,
    'The metallic model',
    'Structure 2.3',
    8,
    4,
    'medium',
    ARRAY[
      'Describing metallic bonding without explicitly mentioning delocalised electrons',
      'Confusing metallic properties with ionic properties',
      'Not explaining why metals are malleable in terms of the bonding model',
      'Confusing conductors, semiconductors and insulators in band theory'
    ],
    ARRAY[
      'Describe metallic bonding as the electrostatic attraction between a lattice of positive metal ions and a sea of delocalised electrons',
      'Explain the physical properties of metals (electrical conductivity, thermal conductivity, malleability, ductility, high melting point) using the metallic bonding model',
      'Explain why metals are good conductors of electricity in terms of delocalised electrons',
      'Describe alloys as mixtures of metals and explain how alloying changes properties such as hardness and melting point',
      'Describe band theory: the formation of valence bands and conduction bands from atomic orbitals',
      'Distinguish between electrical conductors, semiconductors and insulators using band theory'
    ]
  );


  -- ============================================================
  -- STRUCTURE 2.4 — From models to materials
  -- ============================================================

  -- SL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_sl_id,
    'From models to materials',
    'Structure 2.4',
    9,
    4,
    'medium',
    ARRAY[
      'Incorrectly classifying network covalent solids (e.g. SiO₂) as molecular',
      'Confusing intermolecular forces with intramolecular bonds when comparing structures',
      'Not distinguishing allotropes from isotopes'
    ],
    ARRAY[
      'Classify substances as ionic, metallic, covalent molecular or covalent network based on their properties',
      'Explain the relationship between structure, bonding type and physical properties (melting point, conductivity, solubility)',
      'Describe the giant covalent (network) structures of diamond, graphite and silicon dioxide and explain their properties',
      'Define allotropes as different structural forms of the same element',
      'Describe the allotropes of carbon: diamond, graphite, C₆₀ fullerene and graphene, and relate their structures to their properties'
    ]
  );

  -- HL
  INSERT INTO topics (subject_id, name, sub_topic, order_index, weightage, difficulty_level, common_weaknesses, syllabus_points)
  VALUES (
    chem_hl_id,
    'From models to materials',
    'Structure 2.4',
    9,
    4,
    'medium',
    ARRAY[
      'Incorrectly classifying network covalent solids (e.g. SiO₂) as molecular',
      'Confusing intermolecular forces with intramolecular bonds when comparing structures',
      'Not distinguishing allotropes from isotopes',
      'Vague descriptions of how nanostructure properties differ from bulk material properties'
    ],
    ARRAY[
      'Classify substances as ionic, metallic, covalent molecular or covalent network based on their properties',
      'Explain the relationship between structure, bonding type and physical properties (melting point, conductivity, solubility)',
      'Describe the giant covalent (network) structures of diamond, graphite and silicon dioxide and explain their properties',
      'Define allotropes as different structural forms of the same element',
      'Describe the allotropes of carbon: diamond, graphite, C₆₀ fullerene and graphene, and relate their structures to their properties',
      'Explain how the properties of nanoparticles (e.g. large surface area to volume ratio) differ from bulk materials',
      'Describe the structure and properties of polymers as an example of engineered covalent materials'
    ]
  );

END $$;

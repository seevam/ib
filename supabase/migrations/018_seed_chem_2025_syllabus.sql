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

END $$;

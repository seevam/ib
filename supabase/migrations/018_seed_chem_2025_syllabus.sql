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

END $$;

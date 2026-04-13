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

END $$;

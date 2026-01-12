import { db } from './index';
import { subjects, questions } from './schema';

async function seed() {
  console.log('Seeding database...');

  // Insert subjects
  const subjectData = [
    { name: 'mathematics', displayName: 'Mathematics', description: 'IB Mathematics questions', icon: '🔢' },
    { name: 'physics', displayName: 'Physics', description: 'IB Physics questions', icon: '⚛️' },
    { name: 'chemistry', displayName: 'Chemistry', description: 'IB Chemistry questions', icon: '🧪' },
    { name: 'biology', displayName: 'Biology', description: 'IB Biology questions', icon: '🧬' },
    { name: 'english', displayName: 'English', description: 'IB English questions', icon: '📚' },
    { name: 'history', displayName: 'History', description: 'IB History questions', icon: '🏛️' },
    { name: 'geography', displayName: 'Geography', description: 'IB Geography questions', icon: '🌍' },
    { name: 'economics', displayName: 'Economics', description: 'IB Economics questions', icon: '💹' },
    { name: 'business_management', displayName: 'Business Management', description: 'IB Business Management questions', icon: '💼' },
    { name: 'psychology', displayName: 'Psychology', description: 'IB Psychology questions', icon: '🧠' },
    { name: 'computer_science', displayName: 'Computer Science', description: 'IB Computer Science questions', icon: '💻' },
  ];

  const insertedSubjects = await db.insert(subjects).values(subjectData as any).returning();
  console.log(`Inserted ${insertedSubjects.length} subjects`);

  // Sample questions for Mathematics
  const mathSubject = insertedSubjects.find((s) => s.name === 'mathematics');
  if (mathSubject) {
    const mathQuestions = [
      {
        subjectId: mathSubject.id,
        questionType: 'multiple_choice' as const,
        difficulty: 'easy' as const,
        title: 'Quadratic Equations',
        content: 'Solve for x: x² - 5x + 6 = 0',
        options: { A: 'x = 2 or x = 3', B: 'x = 1 or x = 6', C: 'x = -2 or x = -3', D: 'x = 0 or x = 5' },
        correctAnswer: 'A',
        explanation: 'Factoring the equation: (x - 2)(x - 3) = 0, therefore x = 2 or x = 3',
        tags: ['algebra', 'quadratic equations', 'factoring'],
        learningObjectives: ['Solve quadratic equations by factoring', 'Understand the zero product property'],
      },
      {
        subjectId: mathSubject.id,
        questionType: 'calculation' as const,
        difficulty: 'medium' as const,
        title: 'Differentiation',
        content: 'Find the derivative of f(x) = 3x³ - 2x² + 5x - 1',
        options: null,
        correctAnswer: "f'(x) = 9x² - 4x + 5",
        explanation: 'Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹. Apply to each term: 3(3x²) - 2(2x) + 5(1) - 0 = 9x² - 4x + 5',
        tags: ['calculus', 'differentiation', 'power rule'],
        learningObjectives: ['Apply the power rule for differentiation', 'Differentiate polynomial functions'],
      },
      {
        subjectId: mathSubject.id,
        questionType: 'short_answer' as const,
        difficulty: 'hard' as const,
        title: 'Integration and Area',
        content: 'Calculate the area under the curve y = x² from x = 0 to x = 3',
        options: null,
        correctAnswer: '9',
        explanation: 'Integrate x² from 0 to 3: ∫₀³ x² dx = [x³/3]₀³ = (3³/3) - (0³/3) = 27/3 - 0 = 9 square units',
        tags: ['calculus', 'integration', 'area'],
        learningObjectives: ['Calculate definite integrals', 'Find area under curves using integration'],
      },
    ];

    await db.insert(questions).values(mathQuestions as any);
    console.log(`Inserted ${mathQuestions.length} Mathematics questions`);
  }

  // Sample questions for Physics
  const physicsSubject = insertedSubjects.find((s) => s.name === 'physics');
  if (physicsSubject) {
    const physicsQuestions = [
      {
        subjectId: physicsSubject.id,
        questionType: 'multiple_choice' as const,
        difficulty: 'easy' as const,
        title: "Newton's Second Law",
        content: 'A force of 10N is applied to an object with a mass of 2kg. What is the acceleration?',
        options: { A: '5 m/s²', B: '20 m/s²', C: '2 m/s²', D: '10 m/s²' },
        correctAnswer: 'A',
        explanation: "Using Newton's Second Law: F = ma, therefore a = F/m = 10N / 2kg = 5 m/s²",
        tags: ['mechanics', 'force', 'acceleration'],
        learningObjectives: ["Apply Newton's Second Law", 'Calculate acceleration from force and mass'],
      },
      {
        subjectId: physicsSubject.id,
        questionType: 'calculation' as const,
        difficulty: 'medium' as const,
        title: 'Kinetic Energy',
        content: 'Calculate the kinetic energy of a car with mass 1000kg moving at 20 m/s.',
        options: null,
        correctAnswer: '200000 J or 200 kJ',
        explanation: 'Kinetic Energy = ½mv² = ½ × 1000kg × (20 m/s)² = ½ × 1000 × 400 = 200,000 J = 200 kJ',
        tags: ['energy', 'kinetic energy', 'mechanics'],
        learningObjectives: ['Calculate kinetic energy', 'Understand the relationship between mass, velocity, and energy'],
      },
      {
        subjectId: physicsSubject.id,
        questionType: 'short_answer' as const,
        difficulty: 'hard' as const,
        title: 'Wave Interference',
        content: 'Two waves with the same frequency and amplitude meet. They are 180° out of phase. What type of interference occurs and what is the resulting amplitude?',
        options: null,
        correctAnswer: 'Destructive interference, resulting amplitude is zero',
        explanation: 'When two waves are 180° out of phase (or π radians), they undergo destructive interference. The crest of one wave aligns with the trough of the other, canceling each other out completely if they have equal amplitudes, resulting in zero amplitude.',
        tags: ['waves', 'interference', 'phase'],
        learningObjectives: ['Understand wave interference', 'Distinguish between constructive and destructive interference', 'Explain the effect of phase difference'],
      },
    ];

    await db.insert(questions).values(physicsQuestions as any);
    console.log(`Inserted ${physicsQuestions.length} Physics questions`);
  }

  // Sample questions for Chemistry
  const chemistrySubject = insertedSubjects.find((s) => s.name === 'chemistry');
  if (chemistrySubject) {
    const chemistryQuestions = [
      {
        subjectId: chemistrySubject.id,
        questionType: 'multiple_choice' as const,
        difficulty: 'easy' as const,
        title: 'Atomic Structure',
        content: 'What is the atomic number of an element?',
        options: {
          A: 'The number of neutrons in the nucleus',
          B: 'The number of protons in the nucleus',
          C: 'The number of electrons in the outermost shell',
          D: 'The total number of protons and neutrons',
        },
        correctAnswer: 'B',
        explanation: 'The atomic number is defined as the number of protons in the nucleus of an atom. This determines the element\'s identity and position in the periodic table.',
        tags: ['atomic structure', 'periodic table', 'atoms'],
        learningObjectives: ['Define atomic number', 'Understand the structure of atoms'],
      },
      {
        subjectId: chemistrySubject.id,
        questionType: 'calculation' as const,
        difficulty: 'medium' as const,
        title: 'Mole Calculations',
        content: 'Calculate the number of moles in 88g of carbon dioxide (CO₂). (Molar mass: C=12, O=16)',
        options: null,
        correctAnswer: '2 moles',
        explanation: 'Molar mass of CO₂ = 12 + (16 × 2) = 44 g/mol. Number of moles = mass / molar mass = 88g / 44 g/mol = 2 moles',
        tags: ['stoichiometry', 'moles', 'calculations'],
        learningObjectives: ['Calculate number of moles', 'Use molar mass in calculations'],
      },
      {
        subjectId: chemistrySubject.id,
        questionType: 'short_answer' as const,
        difficulty: 'hard' as const,
        title: 'Equilibrium',
        content: "For the reaction N₂(g) + 3H₂(g) ⇌ 2NH₃(g), explain what happens to the equilibrium position if the pressure is increased, according to Le Chatelier's principle.",
        options: null,
        correctAnswer: 'The equilibrium shifts to the right (towards products) because there are fewer moles of gas on the product side (2 moles) compared to the reactant side (4 moles total)',
        explanation: "According to Le Chatelier's principle, when pressure is increased, the equilibrium shifts to the side with fewer moles of gas to reduce the pressure. Reactants: 1 + 3 = 4 moles of gas. Products: 2 moles of gas. Therefore, equilibrium shifts right.",
        tags: ['equilibrium', 'le chateliers principle', 'pressure'],
        learningObjectives: ["Apply Le Chatelier's principle", 'Predict equilibrium shifts', 'Understand the effect of pressure on equilibrium'],
      },
    ];

    await db.insert(questions).values(chemistryQuestions as any);
    console.log(`Inserted ${chemistryQuestions.length} Chemistry questions`);
  }

  // Sample questions for Biology
  const biologySubject = insertedSubjects.find((s) => s.name === 'biology');
  if (biologySubject) {
    const biologyQuestions = [
      {
        subjectId: biologySubject.id,
        questionType: 'multiple_choice' as const,
        difficulty: 'easy' as const,
        title: 'Cell Structure',
        content: 'Which organelle is responsible for photosynthesis in plant cells?',
        options: { A: 'Mitochondria', B: 'Chloroplast', C: 'Nucleus', D: 'Ribosome' },
        correctAnswer: 'B',
        explanation: 'Chloroplasts contain chlorophyll and are the site of photosynthesis in plant cells, converting light energy into chemical energy (glucose).',
        tags: ['cell biology', 'organelles', 'photosynthesis'],
        learningObjectives: ['Identify cell organelles and their functions', 'Understand photosynthesis location'],
      },
      {
        subjectId: biologySubject.id,
        questionType: 'short_answer' as const,
        difficulty: 'medium' as const,
        title: 'DNA Replication',
        content: 'Explain the role of DNA helicase in DNA replication.',
        options: null,
        correctAnswer: 'DNA helicase unwinds and separates the double-stranded DNA by breaking the hydrogen bonds between base pairs, creating a replication fork',
        explanation: 'DNA helicase is an enzyme that unzips the DNA double helix by breaking the hydrogen bonds between complementary base pairs. This creates two single strands that serve as templates for replication, forming a Y-shaped structure called the replication fork.',
        tags: ['molecular biology', 'DNA replication', 'enzymes'],
        learningObjectives: ['Understand the role of enzymes in DNA replication', 'Explain the function of DNA helicase'],
      },
      {
        subjectId: biologySubject.id,
        questionType: 'essay' as const,
        difficulty: 'hard' as const,
        title: 'Evolution and Natural Selection',
        content: "Using Darwin's theory of natural selection, explain how antibiotic resistance in bacteria is an example of evolution. Include discussion of variation, inheritance, selection pressure, and differential survival.",
        options: null,
        correctAnswer: 'A comprehensive answer discussing: 1) Genetic variation in bacterial populations (some bacteria have genes for antibiotic resistance), 2) Inheritance of these traits, 3) Selection pressure from antibiotic use, 4) Differential survival and reproduction of resistant bacteria, 5) Increase in frequency of resistance genes over generations',
        explanation: 'This is a classic example of evolution by natural selection: Bacteria show genetic variation, including resistance genes. When antibiotics are used (selection pressure), susceptible bacteria die while resistant ones survive (differential survival). Resistant bacteria reproduce, passing on resistance genes (inheritance). Over time, the population becomes predominantly resistant. This demonstrates all key principles of natural selection and evolution occurring in real-time.',
        tags: ['evolution', 'natural selection', 'antibiotic resistance'],
        learningObjectives: ['Apply natural selection theory to real-world examples', 'Explain mechanisms of evolution', 'Understand antibiotic resistance as evolution'],
      },
    ];

    await db.insert(questions).values(biologyQuestions as any);
    console.log(`Inserted ${biologyQuestions.length} Biology questions`);
  }

  console.log('Seeding completed!');
}

seed().catch(console.error);

// Unit Tests for Local Intelligence Finder Engines
import assert from 'assert';

// 1. Test City Normalization Logic
function testCityNormalization() {
  const benchmarkCities = [
    { city: 'Pune', aliases: ['poona', 'punawale'] },
    { city: 'Mumbai', aliases: ['bombay'] },
    { city: 'Parbhani', aliases: ['prabhavati'] },
    { city: 'Nashik', aliases: ['nasik'] },
  ];

  function resolveCity(raw) {
    const input = raw.toLowerCase().trim();
    for (const c of benchmarkCities) {
      if (c.city.toLowerCase() === input || c.aliases.includes(input)) {
        return c.city;
      }
    }
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  assert.strictEqual(resolveCity('poona'), 'Pune');
  assert.strictEqual(resolveCity('Pune'), 'Pune');
  assert.strictEqual(resolveCity('bombay'), 'Mumbai');
  assert.strictEqual(resolveCity('prabhavati'), 'Parbhani');
  assert.strictEqual(resolveCity('nasik'), 'Nashik');
  console.log('✓ City normalization unit tests passed');
}

// 2. Test Duplicate Detection Engine Logic
function testDuplicateDetection() {
  function calculateSimilarity(a, b) {
    let score = 0;
    const cleanPhoneA = (a.phone || '').replace(/\D/g, '').slice(-10);
    const cleanPhoneB = (b.phone || '').replace(/\D/g, '').slice(-10);

    if (cleanPhoneA && cleanPhoneB && cleanPhoneA === cleanPhoneB) {
      score += 35;
    }

    if (a.domain && b.domain && a.domain.toLowerCase() === b.domain.toLowerCase()) {
      score += 25;
    }

    const nameA = a.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const nameB = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (nameA === nameB || nameA.includes(nameB) || nameB.includes(nameA)) {
      score += 40;
    }

    return score;
  }

  // Exact duplicate with phone and name
  const match1 = calculateSimilarity(
    { name: 'ABC Computer Institute', phone: '+91 20 2567 8901', domain: 'abcinstitute.com' },
    { name: 'ABC Computer Institute Pune', phone: '020-25678901', domain: 'abcinstitute.com' }
  );
  assert.ok(match1 >= 85, `Expected high duplicate score, got ${match1}`);

  // Non duplicate (completely distinct entities)
  const match2 = calculateSimilarity(
    { name: 'Ruby Hall Clinic', phone: '+91 20 6645 5100', domain: 'rubyhall.com' },
    { name: 'Kalyan Bhel Center', phone: '+91 94220 11982', domain: null }
  );
  assert.ok(match2 < 40, `Expected low duplicate score, got ${match2}`);

  console.log('✓ Duplicate detection unit tests passed');
}

// 3. Test Confidence Scoring Logic
function testConfidenceScoring() {
  function calculateConfidence(provenance) {
    const keys = Object.keys(provenance);
    if (keys.length === 0) return { score: 40, level: 'Low' };

    let total = 0;
    for (const key of keys) {
      total += provenance[key].confidence;
    }
    const avg = Math.round(total / keys.length);
    let level = 'Low';
    if (avg >= 90) level = 'High';
    else if (avg >= 70) level = 'Medium';
    return { score: avg, level };
  }

  const resultHigh = calculateConfidence({
    phone: { confidence: 98 },
    website: { confidence: 95 },
    address: { confidence: 96 },
  });
  assert.strictEqual(resultHigh.level, 'High');
  assert.ok(resultHigh.score >= 90);

  const resultMed = calculateConfidence({
    address: { confidence: 80 },
    phone: { confidence: 75 },
  });
  assert.strictEqual(resultMed.level, 'Medium');

  console.log('✓ Confidence scoring unit tests passed');
}

function runAll() {
  console.log('Running Local Intelligence Finder Unit Test Suite...');
  testCityNormalization();
  testDuplicateDetection();
  testConfidenceScoring();
  console.log('ALL UNIT TESTS COMPLETED SUCCESSFULLY!');
}

runAll();

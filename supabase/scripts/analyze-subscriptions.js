/**
 * Analyze subscription status in Memberstack export
 */

const { parse } = require('csv-parse/sync');
const fs = require('fs');

const csv = fs.readFileSync('/Users/paulmosig/Downloads/member-export-2026-02-06T05-35-58-410Z.csv', 'utf-8');
const records = parse(csv, { columns: true, skip_empty_lines: true, relax_quotes: true, relax_column_count: true });

// Check the 2 missing accounts
const missing = ['iggi.russell@gmail.com', 'art@500voices.com.au'];

console.log('=== MISSING ACCOUNTS (inactive/incomplete) ===\n');
for (const email of missing) {
  const r = records.find(rec => rec.email === email);
  if (r) {
    console.log('Email:', r.email);
    console.log('  Stripe Customer ID:', r['Stripe Customer ID'] || '(none)');
    console.log('  Free Plans:', r['Free Plans (plan ids)'] || '(none)');
    console.log('  Paid Plans:', r['Paid Plans (price ids)'] || '(none)');
    console.log('  Last Login:', r['Last Login'] || '(never)');
    console.log('  Verified:', r['Verified']);
    console.log();
  }
}

// Check a few known active accounts for comparison
console.log('=== SAMPLE ACTIVE ACCOUNTS ===\n');
const active = records.filter(r => r['Paid Plans (price ids)'] && r['Paid Plans (price ids)'].length > 5).slice(0, 3);
for (const r of active) {
  console.log('Email:', r.email);
  console.log('  Stripe Customer ID:', r['Stripe Customer ID'] || '(none)');
  console.log('  Free Plans:', r['Free Plans (plan ids)'] || '(none)');
  console.log('  Paid Plans:', r['Paid Plans (price ids)'] || '(none)');
  console.log('  Last Login:', r['Last Login'] || '(never)');
  console.log();
}

// Summary stats
const withPaidPlans = records.filter(r => r['Paid Plans (price ids)'] && r['Paid Plans (price ids)'].trim()).length;
const withStripe = records.filter(r => r['Stripe Customer ID'] && r['Stripe Customer ID'].trim()).length;
const withLastLogin = records.filter(r => r['Last Login'] && r['Last Login'].trim()).length;
const noPaidPlans = records.filter(r => {
  const plans = r['Paid Plans (price ids)'];
  return !plans || !plans.trim();
}).length;

console.log('=== SUMMARY ===');
console.log('Total records:', records.length);
console.log('With Paid Plans:', withPaidPlans);
console.log('Without Paid Plans:', noPaidPlans);
console.log('With Stripe Customer ID:', withStripe);
console.log('With Last Login:', withLastLogin);

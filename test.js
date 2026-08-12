const { diff, breakdown } = require("./dist/index");

console.log("=== Human Date Diff Demo ===\n");

const now = new Date();

// Past dates
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

console.log("Relative time (past):");
console.log(`  Yesterday: ${diff(yesterday, now)}`);
console.log(`  2 hours ago: ${diff(twoHoursAgo, now)}`);
console.log(`  5 minutes ago: ${diff(fiveMinutesAgo, now)}\n`);

// Future dates (swap order for correct semantic)
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const inThreeHours = new Date(now.getTime() + 3 * 60 * 60 * 1000);

console.log("Relative time (future):");
console.log(`  Tomorrow: ${diff(tomorrow, now)}`);
console.log(`  In 3 hours: ${diff(inThreeHours, now)}\n`);

// Duration breakdown
console.log("Duration breakdown:");
const ms = 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 30 * 60 * 1000 + 45 * 1000;
const bd = breakdown(ms);
console.log(`  ${ms}ms ->`);
console.log(`  ${JSON.stringify(bd)}`);

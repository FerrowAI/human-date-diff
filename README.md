# human-date-diff
![CI](https://github.com/FerrowAI/human-date-diff/actions/workflows/ci.yml/badge.svg)

Relative time formatting: diff(a, b) → "3 days ago", configurable thresholds, duration breakdown, Intl.RelativeTimeFormat.

## Quick Start

```typescript
import { diff, breakdown } from "human-date-diff";

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

diff(yesterday, now);  // "yesterday" or "1 day ago"
diff(tomorrow, now);   // "tomorrow" or "in 1 day"

// Duration breakdown
breakdown(5 * 60 * 1000 + 30 * 1000);  // {days: 0, hours: 0, minutes: 5, seconds: 30}
```

## API

### `diff(from: Date, to?: Date = new Date(), opts?: DiffOptions): string`

Format relative time difference from `from` to `to`.

**Options:**
- `locale?: string` — BCP 47 language tag (default: "en-US"). Used with Intl.RelativeTimeFormat.
- `thresholds?: {seconds?, minutes?, hours?, days?}` — Threshold before switching units (default: 45s, 45m, 22h, 26d)

**Behavior:**
- Uses `Intl.RelativeTimeFormat` if available (modern browsers + Node 12+)
- Falls back to manual English strings ("3 days ago", "in 2 hours")
- Auto-selects unit (seconds, minutes, hours, days, weeks) based on delta and thresholds

### `breakdown(ms: number): DurationBreakdown`

Break down millisecond duration into days/hours/minutes/seconds.

```typescript
interface DurationBreakdown {
  days: number;
  hours: number;     // 0-23
  minutes: number;   // 0-59
  seconds: number;   // 0-59
}
```

## Limitations

- Month/year approximations: 30.44 days/month, 365.25 days/year (documented in code).
- Intl.RelativeTimeFormat availability varies by runtime and locale.
- Fallback strings are English-only (add translations to modify).

---

Part of the [ferrow-toolkit](https://github.com/Ruzylo-cloud/ferrow-toolkit) collection · Sponsored by [Ferrow](https://ferrow.ai)

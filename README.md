# ALBA — Wake up consciously

Minimal app for the **ALBA Dock + App** concept: 3 screens and conscious confirmation so you don't turn off the alarm unconsciously.

## How to run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Screens

1. **Alarm list** — Cards with time, days, switch, and "New alarm" entry point.
2. **Create / edit alarm** — Time, days (S M T W T F S), aroma toggle, and "All alarms use conscious confirmation (slide to wake up)."
3. **Alarm ringing** — Dark screen, "Good morning", time, "Slide to wake up" bar. Hold the bar for **2 seconds** to confirm; then "Wake-up confirmed" appears and the alarm stops.

## Innovation: conscious confirmation

Instead of a single tap, you must **hold the bar for 2 seconds**. That shifts from an automatic gesture to a conscious one and reduces unconsciously turning off the alarm.

## Try the alarm

On the alarm list, use the **"Test"** button on an alarm to simulate it ringing and try the confirmation screen (hold the bar for 2 s).

## Responsive

The app works on mobile and desktop; on wide screens the content is centered with a max width.

## Data

Alarms are stored in `localStorage` (key `alba-alarms`).

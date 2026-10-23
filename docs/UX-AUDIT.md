# UX audit

Walked on 23 Oct 2026 against `main` at `0fee202` (standing rules). Headless Chrome, no sandbox. Phone viewport **390×844**. Laptop viewport **1366×768**. Served the working tree locally. Nothing was sent off the machine. No horizontal page overflow: `scrollWidth` matched the viewport on every screen below.

Tap targets were counted when a visible button was under **44×44 px**. Contrast is the WCAG ratio for the colours in the stylesheet.

Screenshots are in `docs/ux/`, named `before-<screen>-phone.png` and `before-<screen>-laptop.png`. The render shots are the planner scrolled so the AI render card is at the top. The planner-controls shots are scrolled to the room and fixture controls.

## Severity

- **High.** The main thing on that screen is hard to do on a phone.
- **Medium.** It works, but it is cramped, easy to miss, or asks for too many choices at once.
- **Low.** Inconsistent or quiet. It does not block the task.

## What hurts most

1. **High.** The planner is one long screen: a 439 px 3D stage, then the render card, then room size, look, and every fixture. There is no step, no undo, and two AI render buttons. On the phone, 25 planner buttons are under 44 px tall. Nudge arrows are 69×28. Most “add fixture” buttons are 165×26. Toolbar buttons (Client view, Save image, AI render, Plan view, Walk through) are 28 px tall.
2. **High.** On Start at 390×844 the chat log is **66 px** tall. The reply field sits under an “Add to home screen” banner (buttons 28 px tall). The latest line is easy to lose. At 1366×768 the same log is **170 px**.
3. **High.** Seven nav buttons wrap to two rows on the phone and are **33 px** tall (32 px on the laptop). Share is **55×28**.
4. **Medium.** Secondary buttons are teal `#0e7c86` on `#e9f5f6`, contrast **4.44:1** (below 4.5:1). Hint grey `#66758a` on the page background `#f4f6f8` is **4.33:1**. White on the primary teal is **4.95:1**.
5. **Medium.** The quote is a long form (controls were measured past y=4400 on the phone). Open assistant is 38 px tall. Copy code is 28 px. The sticky total bar’s button uses 7 px of vertical padding, so it is under 44 px.
6. **Low.** About, suburbs, tracker, and the marketing drafts do not share one spacing scale, and none of them has a sticky next step on a phone. The flyer is an A4 sheet squeezed into the phone width.

## Start (`index.html`, Assistant)

Screenshots: `docs/ux/before-start-phone.png`, `docs/ux/before-start-laptop.png`.

| | Phone 390×844 | Laptop 1366×768 |
|---|---|---|
| Chat log height | 66 px | 170 px |
| Buttons under 44 px | 13 | 13 |

- **High, phone.** The log is shorter than one useful reply. Hints, photos, the size form, and the estimate all sit in the same column and push the log down. There is no reserved height.
- **Medium.** Suggested replies (About 3-4 m2, About 6 m2, Not sure yet) are 40 px tall.
- **Medium.** “Add to home screen” and “Not now” (28 px) cover the bottom of the phone, including the reply field. The banner also shows on the laptop.
- **Medium.** The first screen offers Start, Quote, Planner, Projects, Gallery, Pipeline, and Settings before the person has answered anything. Pipeline and Settings are owner tools.
- **Low, laptop.** The log is usable. The same small header controls remain.

## Quote

Screenshots: `docs/ux/before-quote-phone.png`, `docs/ux/before-quote-laptop.png`.

Buttons under 44 px: **22** on the phone, **21** on the laptop. No page-level horizontal overflow.

- **High, phone.** Room size, package, products, and extras are one scroll. The total is easy to miss until the sticky bar, and that bar’s “View quote” control is short (padding 7 px 12 px).
- **Medium.** “+ Add custom extra” is 138×28. “Open assistant” is 38 px tall. “Copy code” is 28 px. “Copy SMS” is 38 px.
- **Medium.** Length, width, and area stay in three columns even under 520 px (the phone rule keeps `.row3` as three columns). The fields are tight.
- **Low, laptop.** The two-column layout is readable. The same short buttons and the home-screen banner remain.

## Planner

Screenshots: `docs/ux/before-planner-phone.png`, `docs/ux/before-planner-laptop.png`.

The 3D stage is **439 px** tall on the phone (52 vh, minimum 300 px) and **538 px** on the laptop (70 vh). The render card, measured at the top of the scrolled view, is only **152 px** tall, so the picture area is a thin strip until an image exists.

- **High.** One primary action is not obvious. The overlay offers Client view, Save image, AI render, Plan view, and Walk through at once, and the card repeats AI render.
- **High.** No step indicator. Room size, layout, fixtures, style, and render are stacked.
- **High.** No Undo. Clear all asks a confirm, then wipes every fixture. Reset is not a separate control.
- **Medium.** The empty room defaults to 2.50 × 2.00 × 2.40 m, which is fine, but nothing says that, and the quote area is not called out next to the fields until lower on the page.
- **Medium, laptop.** The stage and the side panel sit side by side, which is better, but the same 28 px tools and 26 px fixture buttons are still there (25 undersized planner buttons).
- **Low.** Drag, orbit, and pinch are explained in 12 px type over the canvas.

## Render (same planner page, scrolled)

Screenshots: `docs/ux/before-render-phone.png`, `docs/ux/before-render-laptop.png`.

- **High, phone.** The render card is below the 439 px stage, so it is off the first screen. Generating one means finding the second AI render button.
- **Medium.** Loading copy exists (“Generating a photo-style render. This often takes 10–60 seconds.”) and errors turn red, but the status line is 12 px hint text and is easy to miss under the fold. A slow or failed Pollinations call does not say the service is slow or down in a block of its own.
- **Medium.** The card button is 94×38, still under 44 px. Regenerate, Save, and Add to quote appear only after a picture, which is right, but they share the card with the rest of the form.
- **Low, laptop.** The card is in the side column from the start, still short, with the same status treatment.

## Planner controls (scrolled)

Screenshots: `docs/ux/before-planner-controls-phone.png`, `docs/ux/before-planner-controls-laptop.png`.

- **High.** Fixture buttons measured: Bath and Shower 165×26, Vanity and Toilet 165×43, Tap, Mirror, Towel rail, and Grab rail 165×26. Add door 88×28. Add window 106×28.
- **High.** Move arrows and rotate are 69×28. Delete item is 90×28. Clear all is 69×28.
- **Medium.** L-shape notch fields, openings, tile picks, and tapware finish are always open. There is no “More” toggle.
- **Medium.** The palette is a two-column grid of small buttons, which reads as a cramped list rather than a set of choices.

## Projects

Screenshots: `docs/ux/before-projects-phone.png`, `docs/ux/before-projects-laptop.png`.

- **Medium.** Empty state is clear (“No projects yet.”). The only action is “Export leads CSV”, 146×38, so it is short, and it does nothing useful until a lead exists.
- **Low.** The home-screen banner covers the bottom on both sizes. Nav and Share match the other app screens (11 short buttons, mostly the chrome).

## Gallery

Screenshots: `docs/ux/before-gallery-phone.png`, `docs/ux/before-gallery-laptop.png`.

- **Low.** The empty state is honest: no finished jobs, no stock photos. Nothing is broken. There is no next step other than the nav.
- **Low.** Same short nav, Share, and home-screen banner (10 short buttons).

## Pipeline

Screenshots: `docs/ux/before-pipeline-phone.png`, `docs/ux/before-pipeline-laptop.png`.

- **Medium.** Unlock is 76×38. The PIN field is usable. The convenience-lock warning is on this build’s copy only where later PRs added it; on this `main` the screen is a lock with a short button.
- **Low.** Owner-only, so the empty public gallery is not the comparison. The home-screen banner still covers the bottom.

## Settings

Screenshots: `docs/ux/before-settings-phone.png`, `docs/ux/before-settings-laptop.png`.

Buttons under 44 px: **25** on each size.

- **Medium.** Remove logo, Remove photo, and the availability Remove buttons are 28 px tall. The form is long (those buttons sit past y=1800 on the phone).
- **Medium.** Business name, ABN, licence, rates, and the owner photo are one scroll with no grouping the person can collapse. Placeholder photo and story are labelled as placeholders, which is correct.
- **Low, laptop.** The same form is wider and easier to scan, with the same short remove buttons.

## About

Screenshots: `docs/ux/before-about-phone.png`, `docs/ux/before-about-laptop.png`.

- **Low.** No buttons under 44 px. Type is 16 px, system font, readable. The photo is a dashed placeholder, which matches the page’s own wording.
- **Medium, phone.** There is no sticky action. Getting a quote means tapping a text link and leaving the page. Links use `#0e7c86` on white (4.95:1), which passes.

## Job tracker

Screenshots: `docs/ux/before-tracker-phone.png`, `docs/ux/before-tracker-laptop.png`.

Opened with no hash, so this is the empty state.

- **Low.** No short buttons. The message is one line: the page needs a tracker link from Nico. Stages are not listed until a real link is opened.
- **Medium.** Nothing on the page tells a client what to do next, and there is no sticky bar. The header link back to the quote builder is the only way on.

## Suburb index and one suburb (Ashgrove)

Screenshots: `docs/ux/before-suburbs-phone.png`, `docs/ux/before-suburbs-laptop.png`, `docs/ux/before-suburb-phone.png`, `docs/ux/before-suburb-laptop.png`.

- **Low.** No horizontal overflow and no short buttons. Copy is readable. Prices are the catalogue from-prices.
- **Medium.** The index is a long list of text links with no sticky “Get a quote”. A suburb page ends in the same text links. Link colour is the same teal (4.95:1 on white).
- **Low.** These pages do not use the app’s button style, so they feel like a different site even though the colours match.

## Marketing kit, flyer, Google Business Profile checklist

Screenshots: `docs/ux/before-marketing-phone.png`, `docs/ux/before-marketing-laptop.png`, `docs/ux/before-flyer-phone.png`, `docs/ux/before-flyer-laptop.png`, `docs/ux/before-gbp-phone.png`, `docs/ux/before-gbp-laptop.png`.

- **Low.** All three are drafts for Nico, not the public quote flow. No short buttons were measured. No horizontal overflow.
- **Medium, flyer on a phone.** An A4 flyer is scaled into 390 px, so the type is small and the page is a poster, not a phone screen. That is acceptable for a print draft and poor if someone opens it on a phone to read it.
- **Low.** Marketing and the checklist use the same ink and teal, with tighter type (headings about 1.05–1.4 rem) and no shared spacing scale with the quote app. The checklist is a long single column, which is fine on both sizes.

## Tester pass on the live site, 23 Oct 2026

Checked again at **390×844** on https://ndefe.github.io/Bath-reno-/ (the published `main`). Headless Chrome. Nothing was rendered and nothing was sent. Two shots from this pass: `docs/ux/tester-planner-phone.png`, `docs/ux/tester-nudge-phone.png`.

These are the same screens as the audit above. The numbers below are the ones measured on that pass. Where a note from the tester does not match the page, the measured result is the one recorded.

1. **High. AI render.** Two buttons: the canvas one is **77×28** (“AI render”), and the card one is **94×38**, also “AI render”, at y=737. The card copy says a picture often takes 10–60 seconds. The code aborts the request at **90 seconds** and only then writes a hint. Until that, the button is disabled and labelled “Rendering…” with a spinner. There is no Cancel, no Retry, and no progress. Save image on the canvas is **not** disabled; it is a secondary button, so it looks inactive. No second press was sent to the render service during this check.
2. **High. Nudge pad.** The up arrow starts about **1,360 px** below the canvas (canvas bottom at y=625, arrow at y=1,989). Arrows and rotate are **69×28**. Delete item is **90×28** and Clear all is **69×28**, with **8 px** between them. Delete removes the item with no question. Clear all does call `confirm('Remove all items?')`, but nothing on the button says that, so the two actions look the same. There is no Undo.
3. **Medium. Canvas touch.** The canvas is **370×439** (the stage fills the 370 px column; a 355 px width was not what this viewport drew). `touch-action` is `none`, so a one-finger swipe on the picture does not scroll the page. The hint sits on the canvas, **360×40**, at 12 px: “Drag an item to move it · drag empty space to orbit · scroll/pinch to zoom”.
4. **Medium. Add item.** Bath, Shower, Tap, Mirror, Towel rail, and Grab rail are **165×26**. Vanity, Toilet, seat, and basin wrap to **165×43**. Labels include raw millimetres, for example “+ Towel rail 799×600”. Gap in the grid is 6 px. Adding an item does not show a toast. The 3D selection outline is the only highlight.
5. **Medium. Canvas toolbar.** Client view **86×28**, Save image **90×28**, AI render **77×28**, Plan view **77×28** sit on one row. Walk through is **103×28** and wraps underneath. Plan and Walk use the same button style as the actions, and neither sets a pressed state. Save image is enabled.
6. **Medium. Doors and windows.** Add door is **88×28**. Add window is **106×28**. The empty lines are “No doors yet.” and “No windows yet.”
7. **Medium. One long planner.** The planner view is about **2,015 px** tall and the document is **2,210 px**. Room size, shape, doors, windows, style, two tile lists, tapware, ten add buttons, and the nudge pad are all open. Tile names mix “White subway” with product names such as “Stone Code grey 600×600”. Changing a finish does not show a swatch next to the select. The picture is the only preview, and it is off screen by then.
8. **Medium. Header.** Seven tabs. Start, Quote, Planner, Projects, and Gallery are **33 px** tall on the first row. Pipeline (**181×33**) and Settings (**181×33**) wrap. The header is **176 px** tall. It **is** sticky: after scrolling the quote to y=5,375 the header stayed at y=0. The problem is the height and the owner tabs, not a missing sticky rule.
9. **Low/Medium. Quote bar and the way back.** The fixed total bar is **54 px** tall and sits at y=790. Scrolled to the end, the quote view finishes **42 px** above that bar, so the last control is not covered on this build. The gap is still tight. The planner has no “Back to quote” control. The Quote tab is the only way back.
10. **Low. Small controls.** The Quote tab has **17** checkboxes (16 extras and 1 approval), each box **13×13**. The extra’s box sits inside its label, so the row is a larger target, but the box itself is 13 px. “+ Add custom extra” is **138×28**. “Copy code” is **83×28**. Copy SMS is **97×38** and Copy email is **106×38**, in the same row as “Print / Save as PDF” on the follow-up card. Print on the summary is **159×38** and Share is **68×38**. “Selected: none” is with the nudge pad, about 1,360 px below the canvas.

Kept, and still true on this pass: the room opens furnished, the render card says the picture is an AI illustration and may not match the layout, and the quote’s length, width, package, and tile selects are full-size fields.

## What the follow-up changes should do

These are the notes for the two later drafts. This audit does not change the site.

- Planner and render: five steps (room, layout, fixtures, style, render), one primary button, targets at least 44 px, Undo and Reset visible, L-shape and tile overrides behind More, and a clear Pollinations loading and error state.
- Everywhere else: one spacing and type scale, the same buttons and a darker teal so secondary text clears 4.5:1, a sticky phone action, and a chat log that stays at least about 120 px on a 360×740 and 375×667 phone.

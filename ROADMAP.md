# Roadmap

## Done

- Bathroom quote builder and 3D planner, published at https://ndefe.github.io/Bath-reno-/
- Quotes saved in the browser, with print / save as PDF
- Real product catalogue (`catalogue.json`): Budget Compact, Grey Modern, Beige Copper, and Marble Luxe, with National Tiles and Reece products
- Pricing is a GST-inclusive base fee plus a rate per m² of floor. Rates stay editable in Settings
- Catalogue extras are selectable on the quote, including area-based and package-specific items
- Each package's included products are shown on the quote with name, code, and a local thumbnail
- Planner looks for each package. Fixture sizes come from the products' real dimensions
- Free AI photo-style renders from the planner (Pollinations). The picture can be saved or added to the printed quote. An optional API key is stored only in this browser for a future paid provider
- First-person walk-through in the planner, at eye height from the doorway. A phone uses a joystick and drag-to-look. A desktop uses WASD or arrows and mouse look. Walls and fixtures block movement
- Planner doors, windows and L-shaped rooms. A door can go on any wall, at 720, 770, 820 or 870 mm or a custom width, with its position, hinge side and swing, or as a cavity slider. The swing shows on the plan and the frame and leaf show in 3D. Windows are openings with glazing. An L-shaped room is priced on its true floor area. The shape and openings are saved with the project
- Before/after gallery, driven by `gallery.json` and photos in `gallery/`. It ships with an empty list and says the first jobs are coming soon. A Google review link can be saved in Settings. Marking a lead Won drafts an SMS and email. Nothing is sent until that wording is approved

## CHANGELOG

### 2026-10-22

- Planner doors: any wall, widths 720, 770, 820 and 870 mm or a custom width, position along the wall, hinge side, swing in or out, or a cavity slider. The swing shows on the plan and the frame and leaf show in 3D. A fixture cannot be left inside the swing or the opening.
- Planner windows: width, height and sill height on any wall, drawn as an opening with glazing. A window in the shower zone shows a note to check wet-area glazing with the builder.
- L-shaped rooms: overall length and width, notch size and which corner is missing. Floor area is the true L, and that area is what the quote prices per m². Walls, tiles, snapping and the walk-through follow the L.
- Doors, windows and the room shape save with the project and are included in the AI render description.
- Gallery page for finished jobs, with a before/after slider, suburb, package and a short note. The job list is empty, and no stock or AI photos are shown as completed work.
- Settings can store a Google review link, blank until it is pasted. Moving a lead to Won drafts a review request for SMS or email. The draft is not sent. A blank link is marked in the wording.

### 2026-10-21

- Lead capture on every quote: name, phone, email and suburb are required; notes and photos are optional. Each lead and its design and quote are stored on this device.
- Projects list to reopen, edit or delete a saved lead. Leads export as CSV with field names suited to Tradify, Fergus or Ascora.
- Send to Nico opens a mail draft with the quote summary. An optional form endpoint (Formspree or Web3Forms) can be set in Settings and stays off until a URL is saved.
- Every customer price is shown as "from $X incl. GST", and the quote says the estimate is subject to a free site measure.
- Budget Compact package for a small bathroom, under $20,000 at about 3–4 m². It uses National Tiles Stone Code and Whoosh, and cheaper Reece fixtures already in the catalogue. Workings are in `docs/pricing-notes.md`.
- Business name and logo in Settings, the header and the quote. ABN and QBCC licence number stay blank until they are typed, and the quote marks the empty spots. Deposit defaults are 10% under $20,000 and 5% from $20,000, labelled verify with QBCC. Warranty, progress payments, the waterproofing note, and a Book a free measure & quote button are on the quote.
- Branded PDF quote with an itemised scope, inclusions, exclusions, a validity period, the deposit and progress payments, and the compliance and warranty notes.
- AI intake assistant replaces the static client form. A mobile chat asks for room size, style, budget, timeline, suburb, name, phone and email, and accepts photos. It uses the free Pollinations text endpoint and falls back to scripted questions. The lead and project stay on this phone. Nothing is sent until Nico reviews it.
- Photo check on the intake: the client enters length, width or area, and ticks retile, relocate fixtures, or waterproof, then confirms or corrects. The vision call sits behind a provider interface and is not connected, because the free model cannot see photos.
- AI estimate: the look maps to a package, and the figure is that package's base fee plus its rate per m². It is shown as "from $X incl. GST, subject to site measure". The text model writes the explanation only and cannot set the number. Nico confirms it before it is final.
- AI design: the chosen package preloads the planner and the walk-through with that package's real products. Opening the planner starts a Pollinations render of that room. The picture is marked as an AI illustration.
- Quote and follow-up: the branded PDF is printed from the project. SMS and email stay as drafts until the wording is approved, then they can be copied or opened in an email draft. Nothing is sent automatically. Nico's lead summary still goes out by mailto or CSV.
- Owner pipeline behind a PIN set in Settings. Stages are New, Contacted, Measure booked, Quoted, Won and Lost. Each lead has a score from budget fit, timeline and how complete the details are, plus a next action. Changing a stage does not send anything.

## Next

- Referral codes ($250 per completed job)
- Accessible / NDIS package

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

## CHANGELOG

### 2026-10-21

- Lead capture on every quote: name, phone, email and suburb are required; notes and photos are optional. Each lead and its design and quote are stored on this device.
- Projects list to reopen, edit or delete a saved lead. Leads export as CSV with field names suited to Tradify, Fergus or Ascora.
- Send to Nico opens a mail draft with the quote summary. An optional form endpoint (Formspree or Web3Forms) can be set in Settings and stays off until a URL is saved.
- Every customer price is shown as "from $X incl. GST", and the quote says the estimate is subject to a free site measure.
- Budget Compact package for a small bathroom, under $20,000 at about 3–4 m². It uses National Tiles Stone Code and Whoosh, and cheaper Reece fixtures already in the catalogue. Workings are in `docs/pricing-notes.md`.
- Business name and logo in Settings, the header and the quote. ABN and QBCC licence number stay blank until they are typed, and the quote marks the empty spots. Deposit defaults are 10% under $20,000 and 5% from $20,000, labelled verify with QBCC. Warranty, progress payments, the waterproofing note, and a Book a free measure & quote button are on the quote.
- Branded PDF quote with an itemised scope, inclusions, exclusions, a validity period, the deposit and progress payments, and the compliance and warranty notes.

## Next

- Modeller upgrades: doors, windows and L-shaped rooms
- Instant estimator with photo upload and measure booking
- Client project tracker
- Before/after gallery with a Google review prompt
- Referral codes ($250 per completed job)
- Accessible / NDIS package

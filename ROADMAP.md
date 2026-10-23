# Roadmap

## Standing rules

These rules sit above the feature list. They do not change the site.

1. Never contact anyone outside the team. No emails, texts, posts, outreach, or messages to clients, agents, OTs, or anyone else. Outreach, flyers, captions, and nudges stay drafts only.
2. Do not ask Nico for approval to contact people. When the business is ready for outreach, tell him plainly that it is time, and he takes over.
3. No spending money, no sign-ups, and nothing merged without Nico's yes.
4. Free tools only.

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
- Referral codes. Each saved lead has its own code. A new lead can record someone else's code, and the pipeline shows the match. A $250 reward is considered only after that job is marked Won, and only if Nico approves the reward and any message. Nothing is paid or sent automatically, and the reward is not taken off the quote
- Accessible Care package. From $30,600 incl. GST at 5 m² ($27,500 + $620/m²), subject to a free site measure. Grab rails and a fold-down seat can be placed in the planner, and the shower can be step-free. Slab set-down and door widening are extras to be quoted, not priced. Three $600 allowances sit inside the price and are labelled as allowances to confirm. Gert's Reno is not an NDIS-registered provider
- A page for each Brisbane suburb the site quotes, with its own title and description, LocalBusiness details, a sitemap and robots.txt
- A draft marketing kit: a local QR code, a one-page A4 flyer, eight social captions, and two outreach notes. Nothing is sent
- A 15-minute Google Business Profile checklist, with the description and service list written out
- Share buttons, an add-to-home-screen prompt, and a smaller first load. The 3D planner loads only when it is opened
- A client can request a free site measure after seeing an estimate. Nico sets the days and times. The request is saved on the lead as Measure requested. Nothing is booked or sent on its own
- The assistant answers cost, inclusions, waterproofing, and timing from facts on this site before it calls the text model. It does not invent a week-by-week program
- On a phone, the opening question has the tall part of the chat, so "How big is the bathroom?" is fully on screen at 360×740 and 375×667. When Check the bathroom is open, the log stays at least 120px and the form keeps the rest of the screen. The estimate sits under the form in that scroll, so it does not cover Confirm details or the Waterproof tick. Typing a length and width updates the area straight away, and Confirm applies that size to the room and the total. An area with no length or width prices from that area. The planner draws a default shape and does not change the area
- A client job tracker. Nico sets each stage by hand in the pipeline. The shareable link is a snapshot of those stages and does not include a phone number or email
- A warranty and process page, and a Meet Gert's Reno section. The photo and story stay as placeholders until Nico adds the real ones in Settings
- The pipeline flags a saved quote with no reply after 3 days and offers a draft nudge. Nico approves it before it is copied or opened. Nothing is sent on its own

## CHANGELOG

### 2026-10-23

- Add to home screen sits in the page, one short line, and can be dismissed. That choice stays on this phone. It does not cover the chat box, Send, or the quote bar.
- The quote table fits a 360px-wide phone, including after an extra is added. View quote is at least 44px tall and stays fully visible in the bottom bar.
- A blank phone or email is left off the contact line. When an extra is priced after a measure, the total says the from-price plus items to confirm.
- A model reply is shown only when it is a short intake question. Anything else, including a price, a warranty, a rating, or a superlative, is replaced with the stored answer or the next intake question. A licence number or an NDIS year uses that stored line, not the price answer. The chat says typed text and render prompts go to Pollinations.
- Phone chat layout. The opening question is fully on screen at 360×740 and 375×667. With Check the bathroom open, the log stays visible (at least 120px at 360×740, 375×667, 390×844 and 412×915) and the form keeps the remaining height. The estimate is not sticky and does not cover Confirm details. Length and width update the area as you type, and Confirm writes that size onto the room and the total. An area-only size, such as 6 m², prices from that area. The planner uses a default shape and does not change the area.
- Standing rules written at the top of this roadmap. No contact outside the team. Do not ask Nico for approval to contact people; when outreach is ready, tell him plainly and he takes over. No spending, no sign-ups, and nothing merged without his yes. Free tools only. Notes only. The site is unchanged.
- Site measure requests. After an estimate is on screen, the client picks a day and a time from the list in Settings. The lead is saved through the existing save adapter, with a local fallback, and the status is Measure requested. Nico sees the request and a draft in the pipeline. Nothing is sent.
- Instant answers in the assistant for cost, what is included, waterproofing, and timing. The wording comes from `faq-facts.json` and the live catalogue, before any call to the text model. Prices stay "from $X incl. GST, subject to a site measure". The deposit line says verify with QBCC. There is no week-by-week schedule. If the facts file does not load, the assistant does not guess and does not ask the text model.
- Client job tracker at `tracker.html`. The stages are site measure, design, demolition, waterproofing, tiling, fit-off and handover. Nico sets each one by hand in the pipeline. The link carries that snapshot, because this is a static site. It is not a live login, it changes only when a new link is copied, and it does not include a phone number or email. Nothing is sent.
- Warranty and process page at `about.html`, using the warranty, deposit, progress payments and waterproofing wording already on the quote. Meet Gert's Reno shows a dashed photo placeholder and a story placeholder until Nico saves his real photo and story in Settings. Nothing is invented or uploaded.
- Quote follow-up reminders. A saved quote with a number and a price, not Won or Lost, is flagged after 3 days with no reply. Nico can mark that the client replied. The nudge is a short draft he approves, then copies or opens in his own SMS or email app. Nothing is sent on its own.
- Suburb pages for 24 Brisbane suburbs, plus an index. Each page has its own title, meta description and copy. Prices are catalogue from-prices, incl. GST, subject to a site measure. No reviews or job counts are shown.
- LocalBusiness JSON-LD names Gert's Reno and Brisbane. ABN and QBCC are left out of the markup because they are still blank. No phone number or email is invented.
- `sitemap.xml` and `robots.txt` list the quote builder and the suburb pages.
- Marketing drafts for Nico to approve: a QR code made on this computer for https://ndefe.github.io/Bath-reno-/, a printable A4 flyer, eight weekly Facebook and Instagram captions, and outreach drafts for real estate agents and for OTs and support coordinators. Captions do not claim finished jobs. Nothing is posted or sent.
- Google Business Profile checklist for Nico at `docs/google-business-profile.html`. It is a list to follow by hand. It does not create the profile, send anything, or start ads. The description and services are written. ABN, phone and reviews are left for Nico to add only when they are real.
- Share buttons on the header and the quote. They open the device share sheet, or copy https://ndefe.github.io/Bath-reno-/ if the sheet is not available. Nothing is sent on its own. No Facebook or Instagram scripts are loaded.
- Add to home screen uses `manifest.webmanifest` and a simple icon. Chrome and Edge can show an Add button when the browser allows it. On iPhone the prompt says to tap Share, then Add to Home Screen. It can be dismissed, and that choice stays on this phone.
- A small service worker caches this site only. It does not cache the AI render service or any other website. If it fails to install, the page still works.
- three.js, OrbitControls and the planner load when the planner is opened, so the first page is smaller.
- Accessible Care package in the catalogue, the intake look list, the estimate, the planner, the quote and the PDF. The from price is $27,500 + $620 per m², so 5 m² is from $30,600 incl. GST, subject to a free site measure.
- Products are the Reece and National Tiles items checked on 23 Oct 2026. No other package's prices changed.
- Slab set-down and door widening show as extras with "Price to confirm". They are not in the from price. The three $600 allowances are labelled as allowances to confirm.
- The quote and the PDF say Gert's Reno is not an NDIS-registered provider, that the quote is for self-managed and plan-managed participants, that NDIS-funded work needs an OT assessment and the OT's spec overrides the package, and that AS 1428.1 is a design reference. The NCC 2022 H4 / AS 3740 waterproofing note stays. A curtain setup is waterproofed across the whole floor.
- The planner can place grab rails and a fold-down seat, and it has a step-free shower option (no hob, linear channel, curtain).

### 2026-10-22

- Planner doors: any wall, widths 720, 770, 820 and 870 mm or a custom width, position along the wall, hinge side, swing in or out, or a cavity slider. The swing shows on the plan and the frame and leaf show in 3D. A fixture cannot be left inside the swing or the opening.
- Planner windows: width, height and sill height on any wall, drawn as an opening with glazing. A window in the shower zone shows a note to check wet-area glazing with the builder.
- L-shaped rooms: overall length and width, notch size and which corner is missing. Floor area is the true L, and that area is what the quote prices per m². Walls, tiles, snapping and the walk-through follow the L.
- Doors, windows and the room shape save with the project and are included in the AI render description.
- Gallery page for finished jobs, with a before/after slider, suburb, package and a short note. The job list is empty, and no stock or AI photos are shown as completed work.
- Settings can store a Google review link, blank until it is pasted. Moving a lead to Won drafts a review request for SMS or email. The draft is not sent. A blank link is marked in the wording.
- Referral codes: each lead gets a code, and the pipeline tracks when another lead uses it. A $250 reward waits until the referred job is marked Won and Nico approves it. The message stays a draft. The quote price does not change.

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

- The lead-delivery wording, the chat privacy wording, the published cost data, the PIN wording, and the layout and image fixes are separate drafts. They are not part of this branch.

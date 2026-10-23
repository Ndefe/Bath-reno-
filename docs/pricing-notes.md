# Gert's Reno – pricing notes (checked 2026-10-21)

All figures AUD inc GST. Product prices taken live from nationaltiles.com.au (schema.org offer data on each product page) and reece.com.au (public listed price the product page loads for anonymous visitors, postcode 4000). **No prices are unverified or estimated** – every product price came from the supplier's own site. The only derived figures are per-m² prices for tiles sold per piece/sheet (Ontario Sand, Zellige is per m²) – flagged in `price_note`.

## Market benchmarks (sources)
| Item | Market range | Model cost used | Source |
|---|---|---|---|
| Brisbane full reno total | $22k–$45k (standard 5–8 m² $22k–$35k) | — | https://creativetiling.com.au/brisbane-bathroom-renovation-cost-guide |
| Per m² (national) | $2,300–$4,600/m² | — | https://hipages.com.au/article/how_much_does_bathroom_renovation_cost |
| Brisbane mid-range | $21k–$36.75k | — | https://whatsthedamage.com.au/bathroom-renovation-cost/ |
| Demolition & waste | $800–$2,500 | $1,300 labour + $550 skip | https://www.homeimprovementaustralia.com.au/how-much-does-a-bathroom-renovation-cost-in-australia-2026-guide/ |
| 4 m³ skip Brisbane (mixed heavy) | $440–$660 | $550 | https://skippybinsbrisbane.com.au/bin-sizes/4m3-skip-bin.php ; https://www.shelbyskips.au/what-size-skip-bin-do-i-need |
| Waterproofing AS 3740 | $60–$140/m², $1.2k–$4.5k per bathroom | $65/m² × (floor+5.5 m²), min $1,300 | https://brisbane-waterproofing.com/cost/bathroom-waterproofing-cost |
| Plumbing rough-in (existing layout) / fit-off | $2k–$4k / $1.2k–$2.5k | $2,800 / $1,600 | https://www.thequoteyard.com.au/services/bathroom-renovation-plumbing-qld |
| Electrical | $800–$2,000 | $1,300 allowance (fan, 2 lights, GPO, certificate) | https://capbathrooms.com.au/bathroom-renovation-cost-in-australia/ |
| Screed / floor prep | $15–$50/m² | $45/m² + $350 shower falls | https://whatsthedamage.com.au/tiling-cost-brisbane/ |
| Tiling labour | $40–$100/m² (avg ~$60); large format $60–$110; mosaic $80–$170; Brisbane tiler $65–$95 | $70 std, $90 large-format, $120 feature + $14/m² adhesive/grout | https://whatsthedamage.com.au/tiling-cost-brisbane/ ; https://creativetiling.com.au/bathroom-tiler-brisbane ; https://hipages.com.au/article/how_much_does_bathroom_renovation_cost |
| Plaster/sheeting repairs | $500–$1,500 | $700 + $500 ceiling patch/paint | https://www.homeimprovementaustralia.com.au/how-much-does-a-bathroom-renovation-cost-in-australia-2026-guide/ |

Other fixed allowances: crew fit-off of vanity/screen/accessories $900; QBCC home-warranty insurance + admin $650; consumables $250. Tile waste 10%.

## Method
1. Geometry: floor area A; square-ish room; walls tiled to 2.1 m (wall m² = 4·√A·2.1 − 1.8 door), of which 2.5 m² is the feature tile. 6 m² room ≈ 19 m² wall tiling.
2. Cost = tiles (supply +10%) + tiling labour + waterproofing + screed + fixed trades ($10,900) + package fixtures (Reece RRP, non-optional items).
3. Sell = cost / (1 − 0.27) → **27% gross margin** (≈37% markup).
4. Sell prices at 5, 6, 7, 8 m² fitted by least squares → `base_fee + rate_per_m2 × A` (rounded up). Because ~70% of cost is fixed, the base fee dominates – a pure per-m² rate would underprice small rooms and overprice big ones (see creativetiling guide).

## Results
| Package | Base fee | Per m² | 3 m² | 4 m² | 5 m² | 6 m² | Fixtures RRP |
|---|---|---|---|---|---|---|---|---|
| Budget Compact | $17,400 | $620 | $19,260 | $19,840 | $20,500 | $21,120 | $2,398 |
| Grey Modern | $23,100 | $590 | — | — | $26,050 | $26,640 | $3,280 |
| Beige Copper | $23,600 | $560 | — | — | $26,400 | $26,960 | $3,554 |
| Marble Luxe (suggested premium) | $29,150 | $970 | — | — | $34,000 | $34,970 | $6,777 |

6 m² cost breakdowns (pre-margin), plus the compact room at 4 m²:

- Budget Compact at 4 m²: tiles $791, tile_labour $1,801, waterproofing $1,300, screed $180, fixed_trades $8,040, fixtures $2,398, total $14,510. Sell $19,880, margin 27.0%.
- Budget Compact at 6 m²: tiles $1,023, tile_labour $2,327, waterproofing $1,300, screed $270, fixed_trades $8,040, fixtures $2,398, total $15,358. Sell $21,120, margin 27.3%.
- Grey Modern: tiles $1,484, tile_labour $2,207, waterproofing $1,300, screed $270, fixed_trades $10,900, fixtures $3,280, total $19,441
- Beige Copper: tiles $1,289, tile_labour $2,327, waterproofing $1,300, screed $270, fixed_trades $10,900, fixtures $3,554, total $19,639
- Marble Luxe (suggested premium): tiles $3,597, tile_labour $2,652, waterproofing $1,300, screed $270, fixed_trades $10,900, fixtures $6,777, total $25,496

Grey Modern, Beige Copper and Marble Luxe land in the Brisbane standard range ($22k–$35k). Marble Luxe sits at the premium entry point (~$35k). Budget Compact is a smaller scope and is priced below that band on purpose.

## Budget Compact workings
The standard fixed-trades block is $10,900 and on its own sells for about $14,900, so a full-scope package cannot start under $20,000. Compact keeps the same geometry, 10% tile waste, waterproofing, screed, tiling rates and 27% margin, and uses smaller trade allowances that still sit inside the ranges above:

| Allowance | Compact | Standard | Why it is lower |
|---|---|---|---|
| Demolition labour | $900 | $1,300 | Small strip-out, bottom of the $800–$2,500 band |
| 4 m³ skip | $440 | $550 | Bottom of the Brisbane $440–$660 mixed-heavy range |
| Plumbing rough-in | $2,000 | $2,800 | Existing layout, bottom of the $2k–$4k band |
| Plumbing fit-off | $1,200 | $1,600 | Fewer fixtures, bottom of the $1.2k–$2.5k band |
| Electrical | $800 | $1,300 | Bottom of the $800–$2,000 band |
| Sheeting | $500 | $700 | Bottom of the $500–$1,500 band |
| Ceiling patch and paint | $400 | $500 | Smaller ceiling |
| Crew fit-off | $600 | $900 | No shower rail to fit |
| Shower falls | $350 | $350 | Same as the other packages |
| QBCC / admin | $650 | $650 | Unchanged |
| Consumables | $200 | $250 | Smaller room |
| Fixed trades | $8,040 | $10,900 | |

Tiles, checked 21 Oct 2026 on nationaltiles.com.au, inc GST:

- Floor: Stone Code Grey Matt 600×600, NT18-4101FL, $29.95/m², box $43.13 (1.44 m²). Matt rectified ceramic, 10 mm. Large-format labour ($90/m²) applies. https://www.nationaltiles.com.au/stone-code-grey-matt
- Walls, including the 2.5 m² feature area: Whoosh White Gloss 75×300, NT18-4080WL, $39.95/m², box $79.10 (1.98 m²). Gloss ceramic, 9 mm. Standard wall labour ($70/m²). The feature area uses this same tile so no third price is introduced; feature labour ($120/m²) still applies to that 2.5 m². https://www.nationaltiles.com.au/whoosh-white-gloss-tile-nt18-4080wl

Fixtures are Reece products already price-checked in this catalogue (RRP inc GST): Posh Bristol MK2 750 vanity $638, Mizu Soothe MK2 basin mixer matte black $195, Mizu Soothe MK2 shower mixer matte black $130, Caroma Forma suite $499, Kado Lux 1400 chrome screen $367, Posh Domaine 600×800 mirror $215, Roca Ona 800 matte black rail $231, Mizu Soothe matte black toilet-roll holder $57, Mizu Drift 100 mm brushed brass grate $66. Sum $2,398. There is no hand shower or slide rail. The grate is brushed brass because that is the verified grate on file; a cheaper chrome grate was not given its own product record.

4 m² cost, before margin: floor 4 × $29.95 and walls 15.00 m² (12.50 m² wall labour, 2.50 m² feature) of Whoosh, plus 10% waste = $791 of tiles. Labour $1,801. Waterproofing stays at the $1,300 minimum. Screed 4 × $45 = $180. Fixed trades $8,040. Fixtures $2,398. Cost $14,510. Sell at 27% would be $19,877. The fitted price is $17,400 + $620 × 4 = $19,880 (27.0% margin).

The same fit at 3 m² is $19,260 (cost $14,040, margin 27.1%). At 5 m² it is $20,500, so the under-$20,000 figure is for about 3–4 m², not for every size. Least squares on the 3, 3.5, 4 and 5 m² sell prices (cost / 0.73) gave about $17,391 + $618/m², rounded up to $17,400 + $620/m² so the margin stays at or just above 27%. Customer-facing amounts are shown as "from $X incl. GST" and are an estimate, subject to a free site measure.

## Extras (sell price, inc GST)
| Extra | Price | Unit | Basis | Sources |
|---|---|---|---|---|
| Bath install (labour, plumbing, extra waterproofing/tiling); add package bath RRP | $1,450 | job | Plumber ~4h + crew 1 day + materials, /(1-27%) | https://www.homeimprovementaustralia.com.au/how-much-does-a-bathroom-renovation-cost-in-australia-2026-guide/ |
| Bath supply+install - Budget Compact (Posh Bristol Freestanding Bath 1560 x 750 x 560mm White) | $2,930.0 | job | Install + Reece RRP + 15% handling. Same bath as Grey Modern | https://www.reece.com.au/product/posh-bristol-freestanding-bath-1560-x-750-x-9504428 |
| Bath supply+install - Grey Modern (Posh Bristol Freestanding Bath 1560 x 750 x 560mm White) | $2,930.0 | job | Install + Reece RRP + 15% handling | https://www.reece.com.au/product/posh-bristol-freestanding-bath-1560-x-750-x-9504428 |
| Bath supply+install - Beige Copper (Posh Domaine Back to Wall Freestanding Bath 1500 x 720mm White) | $3,300.0 | job | Install + Reece RRP + 15% handling | https://www.reece.com.au/product/posh-domaine-back-to-wall-freestanding-bath-1500-9508056 |
| Bath supply+install - Marble Luxe (suggested premium) (Kado Lux Freestanding Bath 1500mm x 700mm x 580mm with Overflow Gloss White) | $3,520.0 | job | Install + Reece RRP + 15% handling | https://www.reece.com.au/product/kado-lux-freestanding-bath-1500mm-x-700mm-x-26954 |
| Recessed tiled shower niche (approx 600x300) | $550 | each | Market $300-$800 each | https://www.homeimprovementaustralia.com.au/how-much-does-a-bathroom-renovation-cost-in-australia-2026-guide/ |
| Floor-to-ceiling tiling - Budget Compact (6 m2 room; scales with wall area) | $1,030.0 | job | Extra ~5.9 m² Whoosh at $39.95 × 1.10 waste + $84/m² labour = $755, / 0.73 = $1,034, rounded to $1,030 | https://www.nationaltiles.com.au/whoosh-white-gloss-tile-nt18-4080wl |
| Floor-to-ceiling tiling - Grey Modern (6 m2 room; scales with wall area) | $1,160.0 | job | Extra ~5.9 m2 wall tile supply + labour at package rates, /(1-27%) | https://jtmasterbuilders.com.au/renovation-costs-gold-coast/bathroom-renovation-cost/ |
| Floor-to-ceiling tiling - Beige Copper (6 m2 room; scales with wall area) | $1,030.0 | job | Extra ~5.9 m2 wall tile supply + labour at package rates, /(1-27%) | https://jtmasterbuilders.com.au/renovation-costs-gold-coast/bathroom-renovation-cost/ |
| Floor-to-ceiling tiling - Marble Luxe (suggested premium) (6 m2 room; scales with wall area) | $1,990.0 | job | Extra ~5.9 m2 wall tile supply + labour at package rates, /(1-27%) | https://jtmasterbuilders.com.au/renovation-costs-gold-coast/bathroom-renovation-cost/ |
| Electric underfloor heating (mat, thermostat, dedicated circuit) | $190 | m2 + $450 fixed | Market $80-$180/m2 installed | https://www.tfo.com.au/post/bathroom-renovation-cost/ ; https://jtmasterbuilders.com.au/renovation-costs-gold-coast/bathroom-renovation-cost/ |
| Relocate toilet (slab cut, new drainage, re-pour) | $3,200 | job | Market $1,500-$5,000+ | https://www.elitetouchrenovations.au/blog/bathroom-layout-changes-renovation/ ; https://www.homeimprovementaustralia.com.au/how-much-does-a-bathroom-renovation-cost-in-australia-2026-guide/ |
| Relocate shower/floor waste | $2,000 | job | Market $1,000-$3,000 | https://www.elitetouchrenovations.au/blog/bathroom-layout-changes-renovation/ |
| Relocate basin/vanity plumbing | $1,000 | job | Market $500-$1,500 | https://www.elitetouchrenovations.au/blog/bathroom-layout-changes-renovation/ |
| Upgrade to wall-hung toilet: Caroma Urbane Invisi II suite (Reece 1817272 RRP $1,973.17) incl. frame, stud wall & install, less package toilet | $3,710.0 | job | Suite RRP + $1,100 install/framing (market $600-$1,200), margin, credit ~$500 | https://capbathrooms.com.au/bathroom-renovation-cost-in-australia/ ; https://www.tfo.com.au/post/bathroom-renovation-cost/ ; https://www.reece.com.au/product/caroma-urbane-invisi-series-ii-wall-hung-toilet-1817272 |
| Heated towel rail Hydrotherm Pure 500x800 (Reece 2299545 matte black / 2299541 chrome, RRP $1,260) incl. electrician | $2,140.0 | each | RRP + $300 electrical connection | https://www.reece.com.au/product/hydrotherm-pure-heated-towel-rail-500-x-800mm-2299545 ; https://capbathrooms.com.au/bathroom-renovation-cost-in-australia/ |
| Additional 4m3 skip (mixed heavy) | $600 | each | Brisbane 4m3 $440-$660 | https://skippybinsbrisbane.com.au/bin-sizes/4m3-skip-bin.php ; https://www.shelbyskips.au/what-size-skip-bin-do-i-need |
| Asbestos removal allowance (licensed removalist, pre-1990 homes) | $2,500 | from | Market $1,500-$5,000 | https://www.homeimprovementaustralia.com.au/how-much-does-a-bathroom-renovation-cost-in-australia-2026-guide/ |
| Extra downlight / LED mirror point | $250 | each | Market $120-$400 per point | https://www.tfo.com.au/post/bathroom-renovation-cost/ |
| Ducted exhaust fan upgrade to outside | $650 | job | Market $300-$600 installed | https://capbathrooms.com.au/bathroom-renovation-cost-in-australia/ |
| Herringbone/diagonal floor lay | $25 | % of tiling labour | +15-30% labour | https://jtmasterbuilders.com.au/renovation-costs-gold-coast/bathroom-renovation-cost/ |
| Full re-plumb (old galvanised/copper) | $4,500 | from | QLD $6k-$12k full re-plumb vs $5k standard already included | https://www.thequoteyard.com.au/services/bathroom-renovation-plumbing-qld |

## Caveats
- Reece has no brushed-copper bathroom tapware in its AU product sitemap (183k URLs searched); Beige Copper uses Roca Ona **Brushed Brass**. Brushed Bronze (Mizu Soothe MK2) is used in Marble Luxe and is the closest copper-like alternative if preferred.
- Reece prices are RRP; trade account pricing will be lower – the difference is extra margin.
- Assumes existing layout, concrete slab or sound subfloor, no asbestos; plumbing and electrical by licensed subcontractors (Form 4 plumbing, Form 16/43 waterproofing certificates).
- Mirror cabinet 9502564 and screen widths taken from product names where spec tables omit them.

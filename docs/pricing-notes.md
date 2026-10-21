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
| Waterproofing AS 3740 | $35–$60/m² (Oneflare); $60–$140/m², $1.2k–$4.5k per bathroom | $65/m² × (floor+5.5 m²), min $1,300 | https://www.oneflare.com.au/waterproofing/qld/brisbane-city ; https://brisbane-waterproofing.com/cost/bathroom-waterproofing-cost |
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
| Package | Base fee | Per m² | 5 m² | 6 m² | 7 m² | 8 m² | Fixtures RRP |
|---|---|---|---|---|---|---|---|
| Grey Modern | $23,100 | $590 | $26,050 | $26,640 | $27,230 | $27,820 | $3,280 |
| Beige Copper | $23,600 | $560 | $26,400 | $26,960 | $27,520 | $28,080 | $3,554 |
| Marble Luxe (suggested premium) | $29,150 | $970 | $34,000 | $34,970 | $35,940 | $36,910 | $6,777 |

6 m² cost breakdowns (pre-margin):

- Grey Modern: tiles $1,484, tile_labour $2,207, waterproofing $1,300, screed $270, fixed_trades $10,900, fixtures $3,280, total $19,441
- Beige Copper: tiles $1,289, tile_labour $2,327, waterproofing $1,300, screed $270, fixed_trades $10,900, fixtures $3,554, total $19,639
- Marble Luxe (suggested premium): tiles $3,597, tile_labour $2,652, waterproofing $1,300, screed $270, fixed_trades $10,900, fixtures $6,777, total $25,496

All land in the Brisbane standard range ($22k–$35k); Marble Luxe sits at the premium entry point (~$35k).

## Extras (sell price, inc GST)
| Extra | Price | Unit | Basis | Sources |
|---|---|---|---|---|
| Bath install (labour, plumbing, extra waterproofing/tiling); add package bath RRP | $1,450 | job | Plumber ~4h + crew 1 day + materials, /(1-27%) | https://www.homeimprovementaustralia.com.au/how-much-does-a-bathroom-renovation-cost-in-australia-2026-guide/ |
| Bath supply+install - Grey Modern (Posh Bristol Freestanding Bath 1560 x 750 x 560mm White) | $2,930.0 | job | Install + Reece RRP + 15% handling | https://www.reece.com.au/product/posh-bristol-freestanding-bath-1560-x-750-x-9504428 |
| Bath supply+install - Beige Copper (Posh Domaine Back to Wall Freestanding Bath 1500 x 720mm White) | $3,300.0 | job | Install + Reece RRP + 15% handling | https://www.reece.com.au/product/posh-domaine-back-to-wall-freestanding-bath-1500-9508056 |
| Bath supply+install - Marble Luxe (suggested premium) (Kado Lux Freestanding Bath 1500mm x 700mm x 580mm with Overflow Gloss White) | $3,520.0 | job | Install + Reece RRP + 15% handling | https://www.reece.com.au/product/kado-lux-freestanding-bath-1500mm-x-700mm-x-26954 |
| Recessed tiled shower niche (approx 600x300) | $550 | each | Market $300-$800 each | https://www.homeimprovementaustralia.com.au/how-much-does-a-bathroom-renovation-cost-in-australia-2026-guide/ |
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

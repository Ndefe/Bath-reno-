#!/usr/bin/env python3
"""Write the static suburb pages, sitemap and robots.txt. No network calls."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "suburbs"
SITE = "https://ndefe.github.io/Bath-reno-"

PRICES = [
    ("Budget Compact", "from $19,260 incl. GST at 3 m², subject to a site measure. At 4 m² it is from $19,880 incl. GST, subject to a site measure."),
    ("Grey Modern", "from $26,050 incl. GST at 5 m², subject to a site measure."),
    ("Beige Copper", "from $26,400 incl. GST at 5 m², subject to a site measure."),
    ("Marble Luxe", "from $34,000 incl. GST at 5 m², subject to a site measure."),
    ("Accessible Care", "from $30,600 incl. GST at 5 m², subject to a site measure."),
]

# Real places and the sort of houses there. No population figures, rankings or reviews.
SUBURBS = [
    {
        "slug": "indooroopilly",
        "name": "Indooroopilly",
        "blurb": "Inner-west houses and units around the shopping centre and the station.",
        "paras": [
            "Indooroopilly sits on the inner west side of Brisbane, between the river and the Moggill Road ridge. The Walter Taylor Bridge crosses to Chelmer and Graceville. Around the station and Indooroopilly Shopping Centre there are apartment blocks. Further out along Station Road, Witton Road and the streets toward Kenmore there are pre-war houses, post-war brick homes and later family houses.",
            "Older houses here often still have a small bathroom and a separate toilet. A renovation can stay on that footprint, or the wall between them can come out if the site allows it. Units near the centre usually need a body corporate to agree the work, and the materials may have to come up in a lift or the stairs. Hilly streets mean a longer carry from the truck. A free site measure checks access, the floor and whether the wastes can stay where they are.",
        ],
    },
    {
        "slug": "toowong",
        "name": "Toowong",
        "blurb": "Houses and apartments between Coronation Drive and the foot of Mt Coot-tha.",
        "paras": [
            "Toowong runs from Coronation Drive and the Regatta up toward the foot of Mt Coot-tha. Toowong Village and the High Street are the centre. Near the station there are apartment buildings. The streets behind Sherwood Road and High Street are mostly houses, including Queenslanders and post-war homes.",
            "An apartment bathroom is a different job from a house. The waterproofing has to suit a unit above another home, the hours of noisy work may be limited, and the skip has to have a place to stand. In a house on a sloping block the bathroom is sometimes at the back, with a timber floor on stumps rather than a slab. The quote does not guess which one you have. The measure looks at it.",
        ],
    },
    {
        "slug": "taringa",
        "name": "Taringa",
        "blurb": "A small inner-west suburb between Toowong and Indooroopilly.",
        "paras": [
            "Taringa is the pocket between Toowong and Indooroopilly, with the station and a short shopping strip on Moggill Road. The blocks are often smaller than the family lots further west. The housing is a mix of older timber houses, brick post-war homes and some units close to the station.",
            "Small blocks mean the skip and the trades have less room. A bathroom in a worker's cottage or a modest post-war house is often narrow, so the package fixtures have to fit the wall that is actually there. The planner can try a layout before the measure, and the measure confirms it. Moving the toilet or the shower waste is an extra, priced on its own, because it depends on the slab or the timber floor.",
        ],
    },
    {
        "slug": "st-lucia",
        "name": "St Lucia",
        "blurb": "Houses and units beside the University of Queensland and the river.",
        "paras": [
            "St Lucia bends around the University of Queensland, with the river on two sides. The streets near the campus have houses, flats and townhouses. Further toward Ironside and the river reaches there are family homes, many of them older, on leafy blocks.",
            "Student flats and family houses need different access plans. A flat may have no parking for a skip and a narrow stair. A house on a large block may have a long path from the street to the bathroom door. Neither changes the package price by itself. The from-price is the package plus the floor area. Access that needs extra labour is talked through at the measure, before anything is booked.",
        ],
    },
    {
        "slug": "chapel-hill",
        "name": "Chapel Hill",
        "blurb": "Family houses west of Indooroopilly, along Moggill Road.",
        "paras": [
            "Chapel Hill is west of Indooroopilly, along Moggill Road toward Kenmore. It is mostly detached houses on suburban blocks, built from the post-war years onward, with some later two-storey homes. The shops sit on Moggill Road rather than in a dense high street.",
            "These bathrooms are often the original main bathroom or a small ensuite added later. An ensuite can be too tight for a large shower screen, which is one reason the Accessible Care package uses a curtain and a step-free option instead of glass. For a standard package, the measure checks the door width and the falls. Slab set-down for a truly step-free shower is not in the from-price. It is quoted after the measure.",
        ],
    },
    {
        "slug": "kenmore",
        "name": "Kenmore",
        "blurb": "Western-suburb family homes around Kenmore Village.",
        "paras": [
            "Kenmore sits further west, around Kenmore Village on Moggill Road, before the road continues toward Pullenvale and Brookfield. The area is mostly family houses, many on larger lots than the inner west, built through the later post-war decades and after.",
            "A larger house does not automatically mean a larger bathroom. A lot of these homes still have one main bathroom of ordinary size, plus a separate toilet. The quote is priced on the bathroom floor area, not the size of the yard. Tell the assistant the bathroom size, or book the free measure and we will measure it. The drive from inner Brisbane is longer, and the measure is still free.",
        ],
    },
    {
        "slug": "sherwood",
        "name": "Sherwood",
        "blurb": "Character houses and interwar homes near Sherwood Road.",
        "paras": [
            "Sherwood is on the south side of the river, inland from the Chelmer reach. Sherwood Road is the spine, with the station and local shops. The streets have Queenslanders, interwar houses and some later homes. Many of the older houses are still on stumps.",
            "A bathroom in a house on stumps is often on a timber floor. Waterproofing and the shower fall have to suit that floor, not a concrete slab. That is checked at the measure, not assumed from the suburb. If the toilet has to move, the extra is priced after we can see the floor. The package from-price covers an existing layout.",
        ],
    },
    {
        "slug": "graceville",
        "name": "Graceville",
        "blurb": "Queenslanders and interwar houses around Honour Avenue.",
        "paras": [
            "Graceville sits between Sherwood and the river, with Honour Avenue as its shopping street and the station close by. The houses are often Queenslanders and interwar homes, with verandahs and smaller original bathrooms. Some have been extended. Some have not.",
            "A character house can have a bathroom that was added under the house or tacked on at the back. Head height, the stair, and how we get tiles and a bath in are part of the measure. The quote builder can start from a length and width you type. It is still an estimate until the measure. The lead stays on this device until you copy or send it. Chat text and render prompts go to Pollinations.",
        ],
    },
    {
        "slug": "corinda",
        "name": "Corinda",
        "blurb": "Houses west of Sherwood, around the station and the shops.",
        "paras": [
            "Corinda is west of Sherwood, around its own station and a small group of shops. The streets are mostly detached houses, from pre-war timber through to post-war brick and later renovations. It is a quieter residential area than the inner suburbs.",
            "The work is the same scope we quote elsewhere: strip-out, skip, waterproofing, tiling, and the fixtures in the package you pick. What changes on a job like this is usually the floor, the access for the skip, and whether you want the layout left as it is. Those are measure questions. The from-price on this page is the catalogue price for the floor area shown, and it is subject to a site measure.",
        ],
    },
    {
        "slug": "paddington",
        "name": "Paddington",
        "blurb": "Cottages and Queenslanders along the Given Terrace ridge.",
        "paras": [
            "Paddington runs along the ridge of Given Terrace and Latrobe Terrace. The blocks are small. The houses are cottages and Queenslanders, close to the footpath, often with a steep drop to the back yard. Many bathrooms are original and small. Parking for a skip is often the hard part, not the tiling.",
            "We do not claim to have finished a Paddington job on this site. The gallery is empty until real before-and-after photos from our own work are added. What we can say is how a quote works. You tell us the size, the look and the suburb. The figure is the package from-price. A free measure checks the stair, the floor and where a skip can stand before the price is final.",
        ],
    },
    {
        "slug": "bardon",
        "name": "Bardon",
        "blurb": "Older houses on the hill above Paddington.",
        "paras": [
            "Bardon is uphill from Paddington, around Macgregor Terrace and the streets toward Ashgrove. The blocks are steep. Houses sit above garages or on tall stumps. Bathrooms are sometimes on the upper floor, which means every tile and the old suite come up a stair.",
            "Steep access does not change the catalogue from-price. If the carry is long enough to need extra labour, that is said at the measure and added only if you agree. Until then the price you see is from the package and the floor area, incl. GST, and subject to a site measure.",
        ],
    },
    {
        "slug": "ashgrove",
        "name": "Ashgrove",
        "blurb": "A mix of Queenslanders and post-war houses along Waterworks Road.",
        "paras": [
            "Ashgrove follows Waterworks Road from the inner north-west out toward The Gap. Around the village there are Queenslanders and pre-war houses. Further along there are brick post-war homes and later houses. The streets off Stewart Road and Glory Street are residential, with a few small sets of units.",
            "A post-war brick bathroom on a slab is the straightforward layout our packages assume: keep the wastes where they are, waterproof, tile, and fit the package fixtures. A Queenslander on stumps needs the floor looked at before anyone promises a hobless shower. Book the measure either way. It is free, and the quote is not final until Nico confirms it.",
        ],
    },
    {
        "slug": "the-gap",
        "name": "The Gap",
        "blurb": "Family houses at the end of Waterworks Road, toward the foothills.",
        "paras": [
            "The Gap is at the western end of Waterworks Road, past Ashgrove, where the streets meet the foothills. It is almost all houses, many of them family homes from the later decades of last century, with a bathroom and often a second ensuite.",
            "An ensuite and a main bathroom are two quotes if both are being renovated. This site prices one room at a time, from the package and that room's floor area. Tell us which room, and the rough size. If you are not sure of the size, say so. The measure is how we get the real number. The from-price is not a fixed contract.",
        ],
    },
    {
        "slug": "auchenflower",
        "name": "Auchenflower",
        "blurb": "Cottages and units between Milton and Toowong.",
        "paras": [
            "Auchenflower sits between Milton and Toowong, beside Coronation Drive and the river. Near the station there are apartment buildings. The streets behind are cottages and Queenslanders on small blocks, some already updated and some not.",
            "If the bathroom is in a unit, say so in the notes. We will ask about lift access and body corporate rules at the measure. If it is a cottage, we will look at the floor and the width of the side path. The online figure does not include those unknowns. It is the package from-price, subject to a site measure.",
        ],
    },
    {
        "slug": "milton",
        "name": "Milton",
        "blurb": "Cottages and apartments near Park Road and the stadium.",
        "paras": [
            "Milton is inner-city, around Park Road and the streets beside Suncorp Stadium. There are workers' cottages, Queenslanders and a growing number of apartments. Match days make street access harder, so a skip and a delivery need a day that is not a match day if the street closes.",
            "We do not add a match-day loading to the from-price. If access has to be planned around the stadium, the measure is where that is written down. The renovation itself is the same scope as our other Brisbane quotes: strip-out, waterproofing to the housing provisions, tiles, and the fixtures in the package.",
        ],
    },
    {
        "slug": "red-hill",
        "name": "Red Hill",
        "blurb": "Steep streets and character houses off Enoggera Terrace.",
        "paras": [
            "Red Hill is a steep inner suburb off Enoggera Terrace and Waterworks Road. Houses are close together. Driveways are short or missing. Bathrooms in the older homes are small, and some are reached by an internal stair.",
            "The useful thing to tell us is the floor area and whether the bathroom is upstairs. The planner can place the package fixtures in a room of that size. The measure checks whether the door, the stair and the floor match the plan. Until that visit, treat every figure as from the catalogue, incl. GST, subject to a site measure.",
        ],
    },
    {
        "slug": "kelvin-grove",
        "name": "Kelvin Grove",
        "blurb": "Older houses and newer townhouses near the QUT campus.",
        "paras": [
            "Kelvin Grove is on Kelvin Grove Road, beside the QUT Kelvin Grove campus. The older streets have timber houses and small brick homes. Closer to the campus there are townhouses and apartments from later redevelopment.",
            "A townhouse bathroom is often already a modern size but dated. A cottage bathroom may need the layout left alone because the walls are structural or the floor will not take a moved waste cheaply. Moving a waste is a catalogue extra, not part of the from-price. We only add it if you select it, and the site measure confirms it is possible.",
        ],
    },
    {
        "slug": "west-end",
        "name": "West End",
        "blurb": "Cottages, flats and converted warehouses around Boundary Street.",
        "paras": [
            "West End runs from the river at Orleigh Park across to Boundary Street and Vulture Street. The housing is cottages, old flats, and warehouses and industrial buildings converted to apartments. Streets are busy and parking is tight.",
            "Converted buildings can hide the plumbing in a concrete slab that is not the original house slab. That is a measure item. Do not assume the from-price includes cutting a slab. Relocating a toilet or a shower waste is listed as an extra for that reason. A straight replacement of the existing layout is what the package from-price covers.",
        ],
    },
    {
        "slug": "highgate-hill",
        "name": "Highgate Hill",
        "blurb": "Character houses on the hill above West End.",
        "paras": [
            "Highgate Hill is the hill above West End, along Dornoch Terrace. The streets are steep. The houses are mostly character homes, Queenslanders and later renovations, with city and river views from the ridge. Bathrooms are often original, small, and on the upper living level.",
            "Carrying a bath or a load of tiles up a Highgate Hill stair is ordinary here, and it is why we look at access before the price is final. The online quote does not pretend the stair is flat. Start with the room size. We will see the path on the measure, for free, before Nico confirms the figure.",
        ],
    },
    {
        "slug": "woolloongabba",
        "name": "Woolloongabba",
        "blurb": "Cottages and newer apartments around Stanley Street and the Gabba.",
        "paras": [
            "Woolloongabba sits around Stanley Street and the Brisbane Cricket Ground. The older streets have workers' cottages and timber houses. Closer to the stadium and Ipswich Road there are newer apartment buildings. Logan Road is the other busy edge.",
            "Cricket and football days affect parking the same way Milton's match days do. We plan deliveries around that at the measure if your street is affected. It is not a line on the from-price. The from-price is the bathroom package. Tell us the suburb is Woolloongabba so the measure is booked in the right place.",
        ],
    },
    {
        "slug": "coorparoo",
        "name": "Coorparoo",
        "blurb": "Interwar and post-war houses around Cavendish Road.",
        "paras": [
            "Coorparoo is on the south side, around Cavendish Road and Old Cleveland Road. The houses are largely interwar and post-war, timber and brick, on suburban blocks, with some units on the main roads. Many bathrooms are still the original cream suite and wall tiles.",
            "A full strip-out of that kind of bathroom is the standard scope in our packages, including waterproofing and tiles up to about 2.1 m. Floor-to-ceiling tiling is an extra. The feature area in a package is about 2.5 m². If you want a different tile, that is a conversation at the measure, not a different from-price on this page.",
        ],
    },
    {
        "slug": "bulimba",
        "name": "Bulimba",
        "blurb": "Queenslanders and river houses around Oxford Street.",
        "paras": [
            "Bulimba is a peninsula suburb on the river, with Oxford Street as the shopping strip. The streets behind it are Queenslanders and cottages, many on stumps, plus some newer houses near the river. Blocks close to Oxford Street are small. Blocks toward the river can be larger, but the bathroom is often still the original room.",
            "Houses on stumps need the bathroom floor understood before a hobless shower is promised. Accessible Care includes a hobless shower in the package scope, and a curtain rather than a glass screen. A structural slab set-down, if the floor needs one to be truly step-free, is price to confirm after the measure. It is not in the from-price.",
        ],
    },
    {
        "slug": "hawthorne",
        "name": "Hawthorne",
        "blurb": "River houses and cottages between Bulimba and Norman Park.",
        "paras": [
            "Hawthorne sits between Bulimba and Norman Park, with a small shopping strip and streets of cottages and Queenslanders running toward the river. Many of the older homes have one bathroom that has not been moved since the house was built.",
            "If you want the new bathroom in the same place, the package from-price is the right starting figure. If you want the shower on a different wall, add the relocate extra only after the measure shows the floor can take it. The lead stays on this device until you copy or send it. Chat text and render prompts go to Pollinations.",
        ],
    },
    {
        "slug": "new-farm",
        "name": "New Farm",
        "blurb": "Queenslanders and apartment blocks around Brunswick Street.",
        "paras": [
            "New Farm is the inner suburb on the river around Brunswick Street and Merthyr Road. Queenslanders and cottages sit next to walk-up flats and larger apartment buildings. A bathroom in a Queenslander and a bathroom in a tower are different access jobs, even when the floor area is the same.",
            "For a unit, the from-price is still the package price. Body corporate approval, protection of common areas, and lift bookings are organised around the measure, not hidden inside the catalogue rate. For a house, we look at the floor structure. Say which one you have when you start the quote, and pick New Farm as the suburb.",
        ],
    },
]


def esc(s):
    return html.escape(s, quote=True)


def ld(suburb):
    data = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Gert's Reno",
        "url": SITE + "/",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Brisbane",
            "addressRegion": "QLD",
            "addressCountry": "AU",
        },
        "areaServed": {
            "@type": "Place",
            "name": suburb["name"],
            "containedInPlace": {"@type": "City", "name": "Brisbane"},
        },
        "description": f"Bathroom renovations in {suburb['name']}, Brisbane. From $19,260 incl. GST, subject to a site measure.",
        "makesOffer": {
            "@type": "Offer",
            "url": SITE + "/",
            "priceCurrency": "AUD",
            "description": "Budget Compact bathroom renovation. From $19,260 incl. GST at 3 m², subject to a site measure. Other packages are priced separately. This is not a fixed quote.",
            "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "AUD",
                "minPrice": "19260",
                "description": "From $19,260 incl. GST at 3 m², subject to a site measure.",
            },
        },
    }
    return json.dumps(data, ensure_ascii=False, indent=2)


CSS = """
:root{--bg:#f4f6f8;--card:#fff;--ink:#1d2733;--mute:#66758a;--acc:#0a5f68;--line:#dde3ea}
*{box-sizing:border-box}
body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:var(--bg);color:var(--ink);font-size:16px;line-height:1.5}
a{color:var(--acc)}
header,footer{background:var(--ink);color:#fff}
header{padding:14px 16px;display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}
header a{color:#fff;font-weight:700;text-decoration:none}
header nav a{font-weight:500;font-size:14px;text-decoration:underline}
main{max-width:760px;margin:0 auto;padding:18px 16px 32px}
h1{font-size:1.6rem;line-height:1.25;margin:0 0 12px}
h2{font-size:1.15rem;margin:22px 0 8px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:12px 0}
.price{font-weight:700}
ul{margin:8px 0;padding-left:18px}
li{margin:6px 0}
.suburb-list{list-style:none;padding:0}
.suburb-list li{border-bottom:1px solid var(--line);padding:8px 0}
.hint{color:var(--mute);font-size:.92rem}
footer{padding:16px;font-size:.85rem}
footer a{color:#fff}
"""


def page(suburb, others):
    name = suburb["name"]
    title = f"Bathroom renovations in {name} | Gert's Reno"
    desc = f"Bathroom renovations in {name}, Brisbane. From $19,260 incl. GST, subject to a site measure. Free measure before any price is final."
    canon = f"{SITE}/suburbs/{suburb['slug']}.html"
    paras = "\n".join(f"<p>{esc(p)}</p>" for p in suburb["paras"])
    prices = "\n".join(f"<li><span class=\"price\">{esc(n)}</span>: {esc(t)}</li>" for n, t in PRICES)
    links = "\n".join(
        f'<li><a href="{esc(o["slug"])}.html">Bathroom renovations in {esc(o["name"])}</a></li>'
        for o in others
    )
    return f"""<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="../favicon.ico" sizes="any">
<link rel="icon" href="../assets/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="../assets/icon-192.png">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{esc(canon)}">
<script type="application/ld+json">
{ld(suburb)}
</script>
<style>{CSS}</style>
</head>
<body>
<header>
  <a href="../index.html">Gert's Reno</a>
  <nav><a href="index.html">All suburbs</a></nav>
</header>
<main>
  <h1>Bathroom renovations in {esc(name)}</h1>
  {paras}
  <div class="card">
    <h2>From prices</h2>
    <p>These are catalogue prices for one bathroom, incl. GST. A bath and any extras are on top. Slab set-down and door widening are quoted after a measure, not priced here. Every figure is subject to a free site measure, and it is not final until Nico confirms it.</p>
    <ul>
      {prices}
    </ul>
  </div>
  <h2>How a quote works</h2>
  <p>Start on the quote page. The assistant asks for the room size, a look, a budget, timing and this suburb, then your name and contact. The figure is the package base fee plus its rate per square metre. It is shown as a from-price, incl. GST, subject to a site measure. The lead stays on this device until you copy or send it. Chat text and render prompts go to Pollinations.</p>
  <p>Waterproofing on these quotes follows NCC 2022 Part H4 / Housing Provisions 10.2 (AS 3740:2021). A curtain shower is waterproofed across the whole floor.</p>
  <p>Accessible Care suits self-managed and plan-managed NDIS participants and private clients. Gert's Reno is not an NDIS-registered provider. NDIS-funded work needs an OT assessment, and the OT's spec overrides the package. AS 1428.1 is used as a design reference.</p>
  <p><a href="../cost-guide.html">How much does a bathroom renovation cost in Brisbane?</a></p>
  <p><a href="../index.html">Start a quote</a></p>
  <h2>Other suburbs</h2>
  <ul>
    {links}
    <li><a href="index.html">All Brisbane suburbs we have a page for</a></li>
  </ul>
</main>
<footer>
  <p>Gert's Reno, Brisbane. This page does not list an ABN, a QBCC licence, a phone number or an email address, because those details have not been added yet. No reviews are shown.</p>
  <p><a href="../index.html">Back to the quote builder</a></p>
</footer>
</body>
</html>
"""


def index_page():
    items = "\n".join(
        f'<li><a href="{esc(s["slug"])}.html">Bathroom renovations in {esc(s["name"])}</a><div class="hint">{esc(s["blurb"])}</div></li>'
        for s in SUBURBS
    )
    data = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Gert's Reno",
        "url": SITE + "/",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Brisbane",
            "addressRegion": "QLD",
            "addressCountry": "AU",
        },
        "areaServed": [{"@type": "Place", "name": s["name"]} for s in SUBURBS],
        "description": "Bathroom renovations in selected Brisbane suburbs. From $19,260 incl. GST, subject to a site measure.",
    }
    desc = "Bathroom renovations in Brisbane suburbs by Gert's Reno. From $19,260 incl. GST, subject to a site measure."
    return f"""<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="../favicon.ico" sizes="any">
<link rel="icon" href="../assets/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="../assets/icon-192.png">
<title>Bathroom renovations in Brisbane suburbs | Gert's Reno</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{SITE}/suburbs/index.html">
<script type="application/ld+json">
{json.dumps(data, ensure_ascii=False, indent=2)}
</script>
<style>{CSS}</style>
</head>
<body>
<header>
  <a href="../index.html">Gert's Reno</a>
  <nav><a href="../index.html">Start a quote</a></nav>
</header>
<main>
  <h1>Bathroom renovations in Brisbane</h1>
  <p>Gert's Reno quotes bathroom renovations in the Brisbane suburbs below. If your suburb is not listed, you can still start a quote and name it. A free site measure confirms we can take the job. These pages do not report jobs completed, star ratings or review counts. The gallery on the quote builder is empty until real photos from our own work are added.</p>
  <p>The lowest catalogue figure is Budget Compact, from $19,260 incl. GST at 3 m², subject to a site measure. Other packages cost more. Nothing is final until Nico confirms it after the measure.</p>
  <ul class="suburb-list card">
    {items}
  </ul>
  <p><a href="../cost-guide.html">How much does a bathroom renovation cost in Brisbane?</a></p>
  <p><a href="../index.html">Start a quote</a></p>
</main>
<footer>
  <p>Gert's Reno, Brisbane. ABN, QBCC licence, phone and email are not listed because they have not been added yet.</p>
</footer>
</body>
</html>
"""


def main():
    OUT.mkdir(exist_ok=True)
    urls = [SITE + "/", SITE + "/about.html", SITE + "/cost-guide.html", SITE + "/suburbs/index.html"]
    for i, suburb in enumerate(SUBURBS):
        others = [SUBURBS[(i + n) % len(SUBURBS)] for n in (1, 2, 3)]
        (OUT / f"{suburb['slug']}.html").write_text(page(suburb, others), encoding="utf-8")
        urls.append(f"{SITE}/suburbs/{suburb['slug']}.html")
    (OUT / "index.html").write_text(index_page(), encoding="utf-8")
    body = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url in urls:
        body.append("  <url>")
        body.append(f"    <loc>{esc(url)}</loc>")
        body.append("    <lastmod>2026-10-23</lastmod>")
        body.append("  </url>")
    body.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(body) + "\n", encoding="utf-8")
    (ROOT / "robots.txt").write_text(
        "User-agent: *\nAllow: /\n\nSitemap: " + SITE + "/sitemap.xml\n",
        encoding="utf-8",
    )
    print(f"wrote {len(SUBURBS)} suburb pages")


if __name__ == "__main__":
    main()

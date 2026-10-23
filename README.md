# Bath-reno-

Gert's Reno bathroom quote builder and 3D planner. The price is a GST-inclusive base fee plus a rate per square metre of floor, using the National Tiles and Reece products in `catalogue.json`.

https://ndefe.github.io/Bath-reno-/

See `ROADMAP.md` for what's done and what's next. How the prices were worked out is in `docs/pricing-notes.md`.

## Gallery

The Gallery page reads `gallery.json`. There are no finished jobs yet, so the page says the first jobs are coming soon. Do not add stock photos or AI pictures and present them as completed work.

To add a job:

1. Put two photos in the `gallery/` folder. Use a simple file name, such as `gallery/paddington-before.jpg` and `gallery/paddington-after.jpg`. Jpeg, png and webp are fine.
2. Add one entry to the `jobs` list in `gallery.json`:

```json
{
  "suburb": "Paddington",
  "package": "Budget Compact",
  "note": "Retile and a new vanity.",
  "before": "gallery/paddington-before.jpg",
  "after": "gallery/paddington-after.jpg"
}
```

The page shows a before/after slider, the suburb, the package used, and the short note. Commit the photos and `gallery.json`. The live site updates when that commit is on main.

## Google review link

Settings has a Google review link. It stays blank until you paste the link from your Google Business profile. When you move a lead to Won, the pipeline drafts an SMS and an email asking for a review. Tick the approval box before you copy it or open the email draft. Nothing is sent automatically. If the link is still blank, the draft marks that spot instead of inventing a web address. The site does not show star ratings or testimonials.

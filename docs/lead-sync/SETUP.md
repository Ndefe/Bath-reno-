# Lead sync setup

This folder is not published. GitHub Pages does not upload `docs/`. Nothing here is deployed, and this guide does not create an account.

The quote page keeps saving leads on the phone. It does not post anywhere until you save an `https://` Worker URL on Owner, then Setup.

## What you do, when you want sync

1. Leave the Worker URL and the Worker token blank until you are ready. The site stays as it is.
2. Create a Cloudflare account yourself, on the free Workers plan if you want. This repo does not sign you up.
3. Create a Worker and paste `worker.js` into it. You can use the Cloudflare dashboard editor. You do not need Wrangler.
4. Add a secret named `LEAD_TOKEN`. Pick the token yourself. The worker refuses every lead until that secret exists.
5. Optional: create a KV namespace and bind it as `LEADS`. Until you do, the worker answers that it accepted the post and did not keep it. The phone still has the lead.
6. Deploy the worker yourself. Copy its `https://` address.
7. On the phone, open Owner, then Setup. Paste that address into Worker URL. Paste the same token into Worker token. Tap Save on this phone.

After that, saving a project still keeps the lead on the phone, and also posts the text fields to your worker. Photo files are not stored by the worker. The worker does not email or text anyone, and it does not add an ABN or a QBCC number.

If the post fails, the lead remains on the phone. Copy request and Download request work either way.

To turn sync off, clear the Worker URL and save. The next save stays on the phone only.

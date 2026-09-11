# MetrologyAI Backend

## Setup
```bash
pip install -r requirements.txt
```

## Run
```bash
uvicorn main:app --reload
```
Then open **http://127.0.0.1:8000/docs** — auto-generated Swagger UI, use this to
test every endpoint (upload an image, see the response) without needing the
frontend built yet. Also share this link with your frontend teammate — it's
the exact API contract they need to call.

## What's here
| File | Purpose |
|---|---|
| `main.py` | FastAPI app — all API endpoints |
| `database.py` | SQLite tables (SQLAlchemy) |
| `schemas.py` | Request/response data shapes |
| `rule_engine.py` | The actual compliance logic — expiry, USP math, font height, FSSAI format |
| `perception.py` | **STUB** — fake CV/OCR output for now, so you can build without waiting on the CV team |
| `notice_generator.py` | Builds the Section 25 violation PDF |

## Endpoints
- `POST /api/scan` — upload 1-3 photos → get compliance verdict (JSON)
- `POST /api/scan-url` — pass `{"url": "https://..."}` for an e-commerce product page → same verdict
- `GET /api/scans` — list all past scans (for dashboard)
- `GET /api/scans/{id}` — get one scan
- `GET /api/scans/search?product_name=...` — search past scans by product name
- `GET /api/stats` — dashboard summary stats (total scans, compliant/non-compliant counts, risk breakdown, etc.)
- `GET /api/products` — every distinct product scanned so far, with a stable id + latest verdict
- `GET /api/products/{id}` — full scan history for one product
- `GET /api/notice/{id}` — download the violation notice PDF

## Compliance Score, Risk Priority & Correction Suggestions
Every scan response now includes:
- **`compliance_score`** (0-100, or `null` if insufficient data): % of *applicable* checks
  that passed. NOT_APPLICABLE checks (e.g. FSSAI on a medicine) and UNKNOWN checks
  (data unreadable from photo) are excluded from the denominator — scoring against
  checks we couldn't evaluate would be misleading.
- **`risk_priority`** (`"CRITICAL"` / `"HIGH"` / `"MEDIUM"` / `"LOW"` / `null`): the highest
  severity among the product's failed checks. Severity mapping (edit in `rule_engine.py`
  → `CHECK_SEVERITY` if your team wants different weights):
  - Expiry violation → **CRITICAL** (consumer safety risk)
  - FSSAI missing/invalid → **HIGH**
  - Pricing math mismatch → **MEDIUM**
  - Font height violation → **LOW**
  `null` means the product is compliant or there wasn't enough data to flag any risk.
- **`checks[].correction`**: set only when that check's `status` is `"FAIL"` — a specific,
  actionable fix (e.g. "Increase printed font height to at least 2.0mm...", with the exact
  correct unit price calculated when a pricing violation is detected). `null` for
  PASS/UNKNOWN/NOT_APPLICABLE checks.

## Net quantity extraction — a note if it's ever missed
`perception.py`'s prompt was tuned to look specifically for "Net Wt./Net Qty/Contents"
labels and bare number+unit patterns (e.g. "69g") near the product name. If a photo genuinely
doesn't show it clearly (blurry, cropped, or covered by another label), Gemini correctly
returns `null` rather than guessing — that's by design, not a bug. Add a close-up photo of
that panel via `file2`/`file3` if a specific product keeps missing it.
Gemini classifies the product into a category in the SAME vision call that
reads the text (no extra API cost/latency). This matters because:
- **FSSAI license check** only applies to `food` — for medicine/cosmetic/general
  it's marked `NOT_APPLICABLE` instead of being treated as a violation (those
  categories fall under CDSCO/BIS/other regulators, not FSSAI).
- **Expiry, pricing math, and font-height checks** apply to ALL categories —
  the Legal Metrology Act covers all packaged commodities, not just food.
- Every check in the API response now includes a `rule_citation` field with
  the specific Act/Rule it's checking against — use this on the dashboard to
  show "which rule applies" next to each PASS/FAIL, as in the architecture diagram.

## E-commerce URL scan — scope note
`/api/scan-url` fetches the page and pulls the product image from the
`og:image` meta tag (works on most e-commerce sites — Amazon, Flipkart, Meesho
all set this for link previews). This is a lightweight fetch, NOT a full
scraper — no JS rendering, no anti-bot bypass. If a site blocks it or has no
og:image tag, the endpoint returns a 422 with a message to fall back to
uploading a screenshot via `/api/scan`. Good enough for a hackathon demo;
mention this limitation upfront if judges ask about scale/robustness.

## Integrating with the CV/OCR team
Right now `perception.py` returns **fake random data** so the backend and
frontend can be built and tested independently. When the CV/OCR module is
ready:
1. Open `perception.py`
2. Replace the body of `extract_package_data()` with the real pipeline call
3. Keep the same return dict keys (see `schemas.ExtractedData`)
4. Nothing else needs to change — `main.py`, `rule_engine.py`, `database.py` stay untouched

## Country of Origin — Domestic vs. Imported
Every scan now also extracts `country_of_origin` (raw text off the label, e.g. "India",
"China") and returns a top-level `is_imported` flag (`true`/`false`/`null`) plus a
"Country of Origin Declaration" entry in `checks[]`, citing Rule 6(8) of the LMPC Rules,
2011 (mandatory country-of-origin declaration for imported goods).
**Honest limitation, by design:** from a photo alone we can't distinguish "domestic
product correctly has no such text" from "imported product illegally missing the
declaration" — both look identical (nothing printed). So this check can only ever
return `PASS` (origin stated) / `NOT_APPLICABLE` (India stated — no declaration
required) / `UNKNOWN` (nothing legible) — never `FAIL`, and it's excluded from
`compliance_score` for that reason (see `rule_engine.py` → `check_country_of_origin`
docstring). Treat it as a transparency feature ("here's what's declared"), not an
enforcement guarantee.

## Product-level history (stable IDs)
Every scan is now grouped under a **Product** identity (matched by exact product name,
case-insensitive) instead of just existing as a standalone scan row:
- **`GET /api/products`** — every distinct product scanned so far, with a permanent
  `id`, `scan_count`, and the latest verdict/score/risk at a glance.
- **`GET /api/products/{id}`** — full scan history for one product, newest first.
- Every `/api/scan` and `/api/scan-url` response now also includes `product_id`
  (which Product this scan was grouped under — `null` if the product name couldn't be
  read) and `previous_scans` (this product's earlier scans, inline, right on the fresh
  response).

Re-scanning the same item — even weeks apart — never creates a disconnected new
identity; it always adds to that same product's `id` and history. This uses a new
`products` table (`database.py`) plus a `product_id` column added to `scans` — a
lightweight startup migration (`_migrate_existing_db()` in `database.py`) adds the new
columns to your existing `metrologyai.db` automatically the first time you run the
updated backend, so no manual DB reset is needed.

## Things to verify before the final demo (marked in code comments too)
- **Font height thresholds** in `rule_engine.py` (`FONT_HEIGHT_BRACKETS`) are commonly-cited
  LMPC Rule 7 brackets — double check exact cm²/mm figures against the official gazette text.
- **FSSAI check** currently validates format only (14 digits) — not a real checksum, since
  FSSAI numbers don't have a public checksum algorithm like GSTIN does. Be upfront about this
  if judges ask — call it a "format + structure validation," true validity needs an FSSAI
  database lookup (out of scope for a 3-day prototype, fine to mention as future work).

## Tested
All endpoints tested end-to-end (scan → DB save → list → PDF download) — confirmed working
with FastAPI's TestClient before handing off.

"""
Pull the list of Connecticut clinicians enrolled in Medicare from the
CMS "Doctors and Clinicians" National Downloadable File API and save
their NPIs as JSON.

Any provider that appears in this dataset is enrolled in Medicare.
The app uses this to show a "Medicare" badge on provider cards.

The API is free, public, and needs no API key.
Dataset: https://data.cms.gov/provider-data/dataset/mj5m-pzi6

HOW TO RUN
----------
    python Pull_ct_medicare.py

Output: ../public/ct_medicare_npis.json
        e.g. {"1154673796": "Y", ...}   (NPI -> accepts-assignment code)
"""

import json
import os
import time
import urllib.parse
import urllib.request

API_URL = "https://data.cms.gov/provider-data/api/1/datastore/query/mj5m-pzi6/0"
STATE = "CT"
PAGE_SIZE = 500   # the API rejects anything larger

# Write next to the provider CSV so the React app can fetch both.
OUTPUT_FILE = os.path.join(os.path.dirname(
    __file__), "..", "public", "ct_medicare_npis.json")


def fetch_page(offset):
    """Ask the API for one page of CT rows — just the NPI and the
    accepts-Medicare-assignment code, to keep responses small."""

    params = urllib.parse.urlencode({
        "limit": PAGE_SIZE,
        "offset": offset,
        "conditions[0][property]": "state",
        "conditions[0][value]": STATE,
        "conditions[0][operator]": "=",
        "properties[]": ["npi", "ind_assgn"],
    }, doseq=True)

    request = urllib.request.Request(
        API_URL + "?" + params, headers={"User-Agent": "ct-provider-finder"})

    with urllib.request.urlopen(request, timeout=60) as response:
        data = json.loads(response.read().decode("utf-8"))

    return data.get("results", [])


def main():
    # NPI -> "Y" (accepts Medicare assignment) or "M" (case-by-case).
    # A provider can appear on many rows (one per practice location),
    # so keep the strongest answer: "Y" wins over "M".
    medicare_npis = {}

    offset = 0
    while True:
        results = fetch_page(offset)
        if not results:
            break

        for row in results:
            npi = row["npi"]
            assign = row.get("ind_assgn", "")
            if medicare_npis.get(npi) != "Y":
                medicare_npis[npi] = assign or "Y"

        offset += PAGE_SIZE
        print(f"Fetched {offset} rows (unique NPIs so far: {len(medicare_npis)})")

        if len(results) < PAGE_SIZE:   # short page = we reached the end
            break

        # be polite to a free government API
        time.sleep(0.3)

    if not medicare_npis:
        print("No providers found. Something went wrong.")
        return

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(medicare_npis, f)

    print(f"\nDone. Wrote {len(medicare_npis)} Medicare NPIs to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()

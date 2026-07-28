"""
Pull Connecticut mental health providers from the NPPES NPI Registry API
and save them to a CSV file.

The NPPES API is free, public, and needs no API key.
Endpoint: https://npiregistry.cms.hhs.gov/api/

HOW TO RUN
----------
    python pull_ct_providers.py

Output: ct_mental_health_providers.csv in the same folder.
"""

import csv
import json
import os
import time
import urllib.parse
import urllib.request

# ---------------------------------------------------------------
# 1. SETTINGS -- the knobs you might want to change
# ---------------------------------------------------------------

API_URL = "https://npiregistry.cms.hhs.gov/api/"
STATE = "CT"

# The API returns at most 200 results per request, and won't let you page
# past 1,200 for any single query. Connecticut has more mental health
# providers than that, so we split the state into chunks by ZIP prefix
# (CT ZIPs all start with 06) and run a separate query for each chunk.
ZIP_PREFIXES = [f"06{d}*" for d in range(10)]  # 060*, 061*, ... 069*

# Taxonomy = the provider's specialty. The API accepts a trailing *
# as a wildcard, so "psych*" catches psychiatrists, psychologists, and
# psychiatric nurse practitioners in one query.
TAXONOMIES = [
    "psych*",              # Psychiatry, Psychologist, Psychiatric NP
    "Counselor*",          # LPCs, mental health counselors
    "Social Worker*",      # LCSWs
    "Marriage*",           # Marriage & family therapists
]

# Write into public/ so the React app fetches the fresh data directly
OUTPUT_FILE = os.path.join(os.path.dirname(
    __file__), "..", "public", "ct_mental_health_providers.csv")


# ---------------------------------------------------------------
# 2. TALKING TO THE API
# ---------------------------------------------------------------

def fetch_page(taxonomy, zip_prefix, skip):
    """Ask the API for one page (up to 200 providers) and return the results."""

    params = {
        "version": "2.1",
        "state": STATE,
        "postal_code": zip_prefix,
        "taxonomy_description": taxonomy,
        "enumeration_type": "NPI-1",   # NPI-1 = individual people, NPI-2 = organizations
        "limit": 200,                  # max the API allows
        # how many results to jump past (this is paging)
        "skip": skip,
    }

    # Build the full URL, e.g. https://.../api/?version=2.1&state=CT&...
    url = API_URL + "?" + urllib.parse.urlencode(params)

    request = urllib.request.Request(
        url, headers={"User-Agent": "ct-provider-finder"})

    with urllib.request.urlopen(request, timeout=30) as response:
        data = json.loads(response.read().decode("utf-8"))

    # The API puts an "Errors" key in the response when something is wrong
    if "Errors" in data:
        print(f"   API error: {data['Errors']}")
        return []

    return data.get("results", [])


# ---------------------------------------------------------------
# 3. UNPACKING ONE PROVIDER
# ---------------------------------------------------------------

def parse_provider(provider):
    """Turn one messy nested API result into one flat dictionary (one CSV row)."""

    basic = provider.get("basic", {})

    # A provider can have several addresses. We want their practice location,
    # not their mailing address.
    practice_address = {}
    for address in provider.get("addresses", []):
        if address.get("address_purpose") == "LOCATION":
            practice_address = address
            break

    # A provider can list several specialties. We want the one flagged primary.
    specialty = ""
    for taxonomy in provider.get("taxonomies", []):
        if taxonomy.get("primary"):
            specialty = taxonomy.get("desc", "")
            break

    return {
        "NPI": provider.get("number", ""),
        "First Name": basic.get("first_name", ""),
        "Last Name": basic.get("last_name", ""),
        "Credential": basic.get("credential", ""),
        # NPPES renamed this field from "gender" to "sex" in a 2024 API
        # update; check both so the script works either way
        "Gender": basic.get("sex", basic.get("gender", "")),
        "Specialty": specialty,
        "Address": practice_address.get("address_1", ""),
        "City": practice_address.get("city", ""),
        "State": practice_address.get("state", ""),
        "ZIP": practice_address.get("postal_code", "")[:5],
        "Phone": practice_address.get("telephone_number", ""),
        # Blank on purpose -- NPPES has no insurance data. You fill these
        # in later from payer directories.
        "Insurance Accepted": "",
        "Accepting New Patients": "",
    }


# ---------------------------------------------------------------
# 4. THE MAIN LOOP
# ---------------------------------------------------------------

def main():
    providers_by_npi = {}   # a dict keyed by NPI, so duplicates overwrite instead of pile up

    for taxonomy in TAXONOMIES:
        for zip_prefix in ZIP_PREFIXES:
            print(f"Searching {taxonomy} in {zip_prefix} ...")

            skip = 0
            while skip <= 1000:                  # 1000 + 200 = the API's 1,200 ceiling
                results = fetch_page(taxonomy, zip_prefix, skip)

                if not results:                  # no more results -- move on
                    break

                for provider in results:
                    row = parse_provider(provider)
                    providers_by_npi[row["NPI"]] = row

                print(
                    f"   got {len(results)} (running total: {len(providers_by_npi)})")

                if len(results) < 200:           # a short page means we hit the end
                    break

                skip += 200
                # be polite to a free government API
                time.sleep(0.5)

    # -----------------------------------------------------------
    # 5. WRITE THE CSV
    # -----------------------------------------------------------

    if not providers_by_npi:
        print("No providers found. Something went wrong.")
        return

    rows = sorted(providers_by_npi.values(), key=lambda r: (
        r["Last Name"], r["First Name"]))
    columns = list(rows[0].keys())

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nDone. Wrote {len(rows)} providers to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()

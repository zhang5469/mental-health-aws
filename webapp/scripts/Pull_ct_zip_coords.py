"""
Pull latitude/longitude for every Connecticut ZIP code from the
US Census Bureau's free ZCTA Gazetteer file and save them as JSON.

The app uses these coordinates to let users search providers within
X miles of their ZIP code (straight-line / haversine distance).

HOW TO RUN
----------
    python Pull_ct_zip_coords.py

Output: ../public/ct_zip_coords.json  (e.g. {"06511": [41.31, -72.93], ...})
"""

import io
import json
import os
import urllib.request
import zipfile

# The Census "Gazetteer" file — a national list of every ZCTA (ZIP Code
# Tabulation Area) with its center-point latitude and longitude.
GAZETTEER_URL = (
    "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/"
    "2025_Gazetteer/2025_Gaz_zcta_national.zip"
)

# Write next to the provider CSV so the React app can fetch both.
OUTPUT_FILE = os.path.join(os.path.dirname(
    __file__), "..", "public", "ct_zip_coords.json")


def main():
    print("Downloading Census ZCTA gazetteer ...")
    request = urllib.request.Request(
        GAZETTEER_URL, headers={"User-Agent": "ct-provider-finder"})

    with urllib.request.urlopen(request, timeout=60) as response:
        raw = response.read()

    # The download is a .zip holding one tab-separated .txt file.
    archive = zipfile.ZipFile(io.BytesIO(raw))
    txt_name = archive.namelist()[0]

    coords = {}
    with archive.open(txt_name) as f:
        # utf-8-sig strips the byte-order mark some Census files start with;
        # the 2025 gazetteer is pipe-delimited ("|")
        text = io.TextIOWrapper(f, encoding="utf-8-sig")
        header = text.readline().split("|")
        # Column positions: GEOID = the 5-digit ZIP, INTPTLAT/LONG = center point
        col = {name.strip(): i for i, name in enumerate(header)}

        for line in text:
            parts = line.split("|")
            zip_code = parts[col["GEOID"]].strip()

            # Connecticut ZIPs all start with "06"
            if zip_code.startswith("06"):
                lat = float(parts[col["INTPTLAT"]])
                lng = float(parts[col["INTPTLONG"]])
                # Round to 4 decimals (~10 m) to keep the file small
                coords[zip_code] = [round(lat, 4), round(lng, 4)]

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(coords, f)

    print(f"Done. Wrote {len(coords)} CT ZIP coordinates to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()

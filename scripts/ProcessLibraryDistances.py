import csv
import os
import json

DISTANCE_DIR = '../data/oadistances/'
OUTPUT_FILE = '../data/oa_distances_precise.csv'

def run():
    oas = []
    for root, dirs, files in os.walk(DISTANCE_DIR, topdown=False):
        for name in files:
            oa_data = []
            path = os.path.join(root, name)
            oa_name = name.replace('.json','')

            with open(path, 'r') as distance_file:
                data = json.load(distance_file)
                for library in data:
                    # The distance is in metres, the duration is in seconds (I think)
                    # We probably only need nearest mile and total minutes
                    oa_data.append(
                        {
                            'oa_code': oa_name,
                            'library': library['library'],
                            'distance': round(float(library['distance']) / 1609, 1),
                            'duration': round(float(library['duration']) / 60)
                        })

            oas.append(oa_data)

    with open(OUTPUT_FILE, 'w', encoding='utf8', newline='') as out_csv:
        writer = csv.writer(out_csv, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(['OA_Code', 'Library', 'Distance', 'Duration'])
        for out_area in oas:
            print(out_area)
            for lib in out_area:
                print(lib)
                writer.writerow([lib['oa_code'], lib['library'], lib['distance'], lib['duration']])

run()

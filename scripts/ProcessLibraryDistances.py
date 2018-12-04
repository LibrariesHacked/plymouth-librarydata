import csv
import os
import json

DISTANCE_DIR = '../data/oa_distances/'
OUTPUT_FILE = '../data/oa_distances_precise.csv'

def run():
    oas = []
    for root, dirs, files in os.walk(DISTANCE_DIR, topdown=False):
        for name in files:
            if name.startswith('E') or name.startswith('W'):
                oa_code_travel = name.replace('.json','')
                oa_code = oa_code_travel.split('_')[0]
                travel = oa_code_travel.split('_')[1]
                oa_data = []
                path = os.path.join(root, name)

                with open(path, 'r') as distance_file:
                    data = json.load(distance_file)
                    for library in data:
                        # The distance is in metres, the duration is in seconds (I think)
                        # We probably only need nearest mile and total minutes
                        if library['distance'] and library['distance'] is not None:
                            oa_data.append(
                                {
                                    'oa_code': oa_code,
                                    'travel': travel,
                                    'library': library['library'],
                                    'distance': round(float(library['distance']) / 1609, 1),
                                    'duration': round(float(library['duration']) / 60)
                                })

                oas.append(oa_data)

    with open(OUTPUT_FILE, 'w', encoding='utf8', newline='') as out_csv:
        writer = csv.writer(out_csv, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(['OA_Code', 'Travel', 'Library', 'Distance', 'Duration'])
        for out_area in oas:
            for lib in out_area:
                writer.writerow([lib['oa_code'], lib['travel'], lib['library'], lib['distance'], lib['duration']])

run()

import requests
import csv
import os.path
import json
import time

DATA_SOURCE_LIBS = '../data/libraries.csv'
OUTPUT_DIR = '../data/'
API_KEY = '58d904a497c67e00015b45fc42337203b9d0468561ab2f37e26ecb76'

def run():

    libraries = []
    with open(DATA_SOURCE_LIBS, 'r') as file:

        reader = csv.reader(file, delimiter=',', quotechar='"')
        next(reader, None)

        for row in reader:
            #Library,Lat,Long
            library = row[0]
            lat = row[5]
            lng = row[6]
            libraries.append({ 'library': library, 'lat': lat, 'lng': lng })

    for library in libraries:
        
        # Check if we already have a file
        if os.path.isfile(OUTPUT_DIR + '/' + library['library'] + '_isochrone_walking.json') == False:
            # Example: https://api.openrouteservice.org/isochrones?locations=-3.18801%2C51.0611&profile=driving-car&range_type=time&range=3600&interval=600&location_type=start&intersections=false&api_key=58d904a497c67e00015b45fc42337203b9d0468561ab2f37e26ecb76
            url = (
                'https://api.openrouteservice.org/isochrones?locations=' + library['lng'] + '%2C' + library['lat'] +
                '&profile=foot-walking&range_type=time&range=1800&interval=300&location_type=destination&intersections=false&api_key=' + API_KEY
            )
            print(url)
            data = requests.get(url)
            data = json.loads(data.text)
            with open(OUTPUT_DIR + '/' + library['library'] + '_isochrone_walking.json', 'w') as outfile:
                json.dump(data, outfile)
            time.sleep(10)
run()

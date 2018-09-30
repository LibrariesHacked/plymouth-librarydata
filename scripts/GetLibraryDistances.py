import requests
import csv
import os.path
import json
import time

DATA_SOURCE_OAS = '../data/ons/oa_centroids.csv'  # OA List datasource
DATA_SOURCE_LIBS = '../data/libraries/libraries.csv'  # Library List datasource
OUTPUT_DIR = '../data/oa_distances/'  # Where to save the files
# Key for open route service
ORS_KEY = '58d904a497c67e00015b45fc42337203b9d0468561ab2f37e26ecb76'

def chunks(l, n):
	for i in range(0, len(l), n):
		yield l[i:i + n]

def run():
    oas = []  # Array of OAs
    with open(DATA_SOURCE_OAS, 'r') as oa_file:
        oareader = csv.reader(oa_file, delimiter=',', quotechar='"')
        next(oareader, None)  # skip the headers

        for row in oareader:  # X,Y,oa11cd,lad11cd
            oas.append({'lng': row[0], 'lat': row[1],
                        'oa': row[2], 'district': row[3]})

    libraries = []  # Array of Libraries
    with open(DATA_SOURCE_LIBS, 'r') as libs:
        libreader = csv.reader(libs, delimiter=',', quotechar='"')
        next(libreader, None)  # Skip the headers
        # Library, Lat, Lng
        for row in libreader:
            libraries.append({'lng': row[6], 'lat': row[5], 'library': row[0]})

	# Run through chunks of 50 OAs
    for (oas_idx, oa_chunk) in enumerate(chunks(oas, 50)):

        # ORS Matrix: "https://api.openrouteservice.org/matrix?profile=driving-car&locations=-3.18801%2C51.0611|-3.00104%2C51.1284|-2.53941925610321%2C51.220653952736|-2.52000773343246%2C51.2349068904321&sources=0&destinations=1,2,3&metrics=distance|duration|weight&api_key=58d904a497c67e00015b45fc42337203b9d0468561ab2f37e26ecb76'

        starts = []
        count = 0
        locations = ''
        for (idx, oa) in enumerate(oa_chunk):
            if idx > 0:
                locations = locations + '|'
            locations = locations + oa['lng'] + '%2C' + oa['lat']
            starts.append(str(idx))
            count = idx + 1
        destinations = []
        for (idx, library) in enumerate(libraries):
            locations = locations + '|' + \
                library['lng'] + '%2C' + library['lat']
            destinations.append(str(count + idx))

        transport = ['driving-car', 'cycling-regular', 'foot-walking']

        for tran in transport:
            if not os.path.isfile(OUTPUT_DIR + 'chunk_' + str(oas_idx + 1) + '_' + tran + '.json'):
                url = (
                    'https://api.openrouteservice.org/matrix?profile=' + tran + '&locations=' +
                    locations + '&sources=' + (','.join(starts)) +
                    '&destinations=' + (','.join(destinations)) +
                    '&metrics=distance|duration|weight&api_key=' + ORS_KEY)

                print('Querying...')

                data = requests.get(url)
                data = json.loads(data.text)

                with open(OUTPUT_DIR + 'chunk_' + str(oas_idx + 1) + '_' + tran + '.json', 'w') as outfile:
                    json.dump(data, outfile)
            else:
                # Load in the data from the saved file
                data = json.loads(OUTPUT_DIR + 'chunk_' +
                                  str(oas_idx + 1) + '_' + tran + '.json')

            if not 'error' in data:
                # Each item returned is an OA.
                for (chunk_idx, oa) in enumerate(oa_chunk):
                    oa_data = []

                    if not os.path.isfile(OUTPUT_DIR + oa['oa'] + '_' + tran + '.json'):
                        for (lib_idx, library) in enumerate(libraries):
                            oa_data.append(
                                {'library': library['library'], 'distance': data['distances'][chunk_idx][lib_idx],
                                    'duration': data['durations'][0][lib_idx], 'weight': data['weights'][chunk_idx][lib_idx]}
                            )

                        with open(OUTPUT_DIR + oa['oa'] + '_' + tran + '.json', 'w') as outfile:
                            json.dump(oa_data, outfile)

            print('Waiting...')
            time.sleep(3)

run()

import time
import re
import json
from bs4 import BeautifulSoup
import requests
from selenium import webdriver
import csv

OUTPUT_FILE = '../data/library_services.csv'

def run():

    libraries = []
    url = 'https://www.plymouth.gov.uk/libraries/findlibraryandopeninghours'
    driver = webdriver.Firefox()
    driver.get(url)
    html = driver.page_source
    soup = BeautifulSoup(html, 'lxml')
    for library in soup.find_all('td', {'class':'views-field views-field-title'}):
        library_name = library.find('a').text.strip()
        library_link = 'https://www.plymouth.gov.uk' + library.find('a').get('href')
        if library_link and not 'pop' in library_link:
            lib_url = library_link.strip()
            driver.get(library_link)
            lib_html = driver.page_source
            lib_soup = BeautifulSoup(lib_html, 'lxml')
            headers = lib_soup.find_all('h2')
            for header in headers:
                if (header.text == 'Services and facilities'):
                    service_list = header.findNext('ul').find_all('li')
                    services = {
                        'Library': library_name,
                        'Computers': 'No',
                        'WiFi': 'No',
                        'Printers': 'No',
                        'Photocopiers': 'No',
                        'Scanners': 'No',
                        'MeetingRooms': 'No',
                        'LocalAndFamilyHistory': 'No',
                        'NavalHistory': 'No',
                        'MicrofilmScanners': 'No',
                        'RoofTerrace': 'No',
                        'Books': 'No',
                        'DVDs': 'No',
                        'Audiobooks': 'No',
                        'RequestService': 'No',
                        'Cafe': 'No'
                    }
                    for service in service_list:
                        if ('Computers' in service.text):
                            services['Computers'] = 'Yes'
                        if ('Wi-Fi' in service.text):
                            services['WiFi'] = 'Yes'
                        if ('Printer' in service.text):
                            services['Printers'] = 'Yes'
                        if ('Photocopier' in service.text):
                            services['Photocopiers'] = 'Yes'
                        if ('Scanner' in service.text):
                            services['Scanners'] = 'Yes'
                        if ('Meeting room' in service.text):
                            services['MeetingRooms'] = 'Yes'
                        if ('Local and family history' in service.text):
                            services['LocalAndFamilyHistory'] = 'Yes'
                        if ('Naval history' in service.text):
                            services['NavalHistory'] = 'Yes'
                        if ('Microfilm' in service.text):
                            services['MicrofilmScanners'] = 'Yes'
                        if ('Roof' in service.text):
                            services['RoofTerrace'] = 'Yes'
                        if ('Books' in service.text):
                            services['Books'] = 'Yes'
                        if ('DVDs' in service.text):
                            services['DVDs'] = 'Yes'
                        if ('Audiobooks' in service.text):
                            services['Audiobooks'] = 'Yes'
                        if ('Request' in service.text):
                            services['RequestService'] = 'Yes'
                        if ('Café' in service.text):
                            services['Cafe'] = 'Yes'
                    libraries.append({ 'name': library_name, 'services': services, 'website': library_link })

    with open(OUTPUT_FILE, 'w', encoding='utf8', newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerow(
            ['Library', 'Computers', 'WiFi', 'Printers', 'Photocopiers', 
            'Scanners', 'MeetingRooms', 'LocalAndFamilyHistory', 'NavalHistory', 
            'MicrofilmScanners', 'RoofTerrace', 'Books', 'DVDs', 'Audiobooks', 
            'RequestService', 'Cafe', 'Website' ]
        )
        for library in libraries:
            writer.writerow([library['name'], library['services']['Computers'], 
            library['services']['WiFi'], library['services']['Printers'], 
            library['services']['Photocopiers'], 
            library['services']['Scanners'], library['services']['MeetingRooms'], 
            library['services']['LocalAndFamilyHistory'], library['services']['NavalHistory'], 
            library['services']['MicrofilmScanners'], library['services']['RoofTerrace'], 
            library['services']['Books'], library['services']['DVDs'], library['services']['Audiobooks'], 
            library['services']['RequestService'], library['services']['Cafe'], library['website'] ])

run()

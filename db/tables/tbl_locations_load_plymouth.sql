create table locations_temp (
    location_name text,
    address_1 text,
    address_2 text,
    address_3 text,
    postcode text,
    latitude numeric,
    longitude numeric,
    monday text,
    tuesday text,
    wednesday text,
    thursday text,
    friday text,
    saturday text,
    sunday text,
    computers text,
    wifi text,
    printers text,
    photocopiers text,
    scanners text,
    meetingrooms text,
    localandfamilyhistory text,
    navalhistory text,
    microfilmscanners text,
    roofterrace text,
    books text,
    dvds text,
    audiobooks text,
    requestservice text,
    cafe text,
    website_url text
);

-- upload the data..
\copy locations_temp from 'c:\development\librarieshacked\plymouth-librarydata\data\libraries\libraries.csv' csv header;

-- insert the basic location data.
insert into locations (location_name, address_1, address_2, address_3, postcode, latitude, longitude, website_url, geom)
select location_name, address_1, address_2, address_3, postcode, latitude, longitude, website_url, st_setsrid(st_makepoint(longitude, latitude), 4326) from locations_temp order by location_name;


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

-- add library photos
update locations set photo_url = 'https://farm1.staticflickr.com/952/42163961922_c3ae03b922_c.jpg' where location_name = 'Peverell Library';
update locations set photo_url = 'https://farm1.staticflickr.com/944/41489775994_cd4db936f5_c.jpg' where location_name = 'Plympton Library';
update locations set photo_url = 'https://farm1.staticflickr.com/972/42325217291_9bafff8620_c.jpg' where location_name = 'North Prospect Library';
update locations set photo_url = 'https://farm1.staticflickr.com/954/41423574305_3bee759df2_c.jpg' where location_name = 'Devonport Library';
update locations set photo_url = 'https://farm2.staticflickr.com/1740/27629925847_97050e0e46_c.jpg' where location_name = 'Crownhill Library';
update locations set photo_url = 'https://farm2.staticflickr.com/1731/41598173065_383587ae34_c.jpg' where location_name = 'Efford Library';
update locations set photo_url = 'https://farm2.staticflickr.com/1723/40693120840_c804252bca_c.jpg' where location_name = 'Southway Library';
update locations set photo_url = 'https://farm2.staticflickr.com/1600/26054168843_d2210f6e68_c.jpg' where location_name = 'Central Library';
update locations set photo_url = 'https://farm5.staticflickr.com/4886/45472434885_25e2950ae5_c.jpg' where location_name = 'Estover Library';
update locations set photo_url = 'https://farm5.staticflickr.com/4886/31445708597_2f21cb7b71_c.jpg' where location_name = 'Plymstock Library';

-- drop the temp table
drop table locations_temp;
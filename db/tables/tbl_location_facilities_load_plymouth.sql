insert into location_facilities
select id, (select id from facilities where facility_name = 'Computers') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.computers = 'Yes'
union
select id, (select id from facilities where facility_name = 'WiFi') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.wifi = 'Yes'
union 
select id, (select id from facilities where facility_name = 'Printers') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.printers = 'Yes'
union
select id, (select id from facilities where facility_name = 'Photocopying') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.photocopiers = 'Yes'
union
select id, (select id from facilities where facility_name = 'Scanners') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.scanners = 'Yes'
union
select id, (select id from facilities where facility_name = 'Meeting rooms') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.meetingrooms = 'Yes'
union
select id, (select id from facilities where facility_name = 'Local and family history') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.localandfamilyhistory = 'Yes'
union
select id, (select id from facilities where facility_name = 'Naval History') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.navalhistory = 'Yes'
union
select id, (select id from facilities where facility_name = 'Microfilm scanners') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.microfilmscanners = 'Yes'
union
select id, (select id from facilities where facility_name = 'Roof terrace') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.roofterrace = 'Yes'
union
select id, (select id from facilities where facility_name = 'Books') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.books = 'Yes'
union
select id, (select id from facilities where facility_name = 'DVDs') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.dvds = 'Yes'
union
select id, (select id from facilities where facility_name = 'Audiobooks') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.audiobooks = 'Yes'
union
select id, (select id from facilities where facility_name = 'Request service') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.requestservice = 'Yes'
union
select id, (select id from facilities where facility_name = 'Cafe') from locations l join locations_temp lt on lt.location_name = l.location_name where lt.cafe = 'Yes'
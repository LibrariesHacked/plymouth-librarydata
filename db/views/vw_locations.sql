-- returns all locations with their associated data as a flat structure (some embedded json for arrays)
create view vw_locations as
select
	l.location_name,
	l.address_1,
	l.address_2,
	l.address_3,
	l.postcode,
	l.longitude, 
	l.latitude,
	l.website_url,
	l.photo_url,
	array_to_json(array_agg(distinct f.facility_name order by f.facility_name)) as facilities,
	array_to_json(array_agg(distinct dow.wkday || ' ' || to_char(opening_time, 'HH24:mm') || '-' || to_char(closing_time, 'HH24:mm'))) as opening_hours					
from locations l
join location_facilities lf on lf.location_id = l.id
join facilities f on f.id = lf.facility_id
join location_openinghours lo on l.id = lo.location_id
join openinghours o on o.id = lo.openinghours_id
join dowlookup dow on dow.isodow = o.day
group by 
l.location_name,
	l.address_1,
	l.address_2,
	l.address_3,
	l.postcode,
	l.longitude, 
	l.latitude,
	l.website_url,
	l.photo_url;
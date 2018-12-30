create view vw_oadistances as
select 
	oa_code,
	travel_type, 
	location_name,
	duration, 
	distance
from oa_distances o 
join travel t on t.id = o.travel_id
join locations l on l.id = o.location_id;
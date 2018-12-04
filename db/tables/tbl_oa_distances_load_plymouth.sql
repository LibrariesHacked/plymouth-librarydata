create table oa_distances_temp (
    oa_code character (9) not null,
    travel_type character varying (20),
    location_name text,
    duration numeric,
    distance numeric
);

-- Run \copy in psql to do remote upload.
copy oa_distances_temp from 'c:\development\librarieshacked\plymouth-librarydata\data\oa_distances.csv' csv header;

insert into oa_distances(oa_id, travel_id, location_id, duration, distance)
select o.id, t.id, l.id, d.duration, d.distance from oa_distances_temp d join oas o on o.oa_code = d.oa_code join travel on d.travel_type = t.travel_type join locations l on l.location_name = d.location_name; 

drop oa_distances_temp;
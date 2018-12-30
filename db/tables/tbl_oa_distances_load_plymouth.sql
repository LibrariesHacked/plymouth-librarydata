create table oa_distances_temp (
    oa_code character (9) not null,
    travel_type character varying (20),
    location_name text,
    duration numeric,
    distance numeric
);

-- Run \copy in psql to do remote upload.
\copy oa_distances_temp from 'c:\development\librarieshacked\plymouth-librarydata\data\oa_distances.csv' csv header;

-- pre-requisite table
insert into travel(travel_type)
select distinct travel_type from oa_distances_temp order by travel_type;

-- add travel icons
update travel set icon = 'DirectionsWalk' where travel_type = 'foot-walking';
update travel set icon = 'DirectionsBike' where travel_type = 'cycling-regular';
update travel set icon = 'DirectionsCar' where travel_type = 'driving-car';

-- now load in the distances
insert into oa_distances(oa_code, travel_id, location_id, duration, distance)
select o.oa11cd, t.id, l.id, d.duration, d.distance from oa_distances_temp d join oas o on o.oa11cd = d.oa_code join travel t on d.travel_type = t.travel_type join locations l on l.location_name = d.location_name;

-- and drop the table
drop table oa_distances_temp;
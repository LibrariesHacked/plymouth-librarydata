create table openinghours_temp (
	location_id integer,
    day integer,
    opening_time time,
    closing_time time,
);

select into openinghours_temp (location_id, day, opening_time, closing_time)
(select (select l.id from locations l where l.location_name = lt.location_name), 1, split_part(monday, '-', 1), split_part(monday, '-', 2) from locations_temp lt
union
select (select l.id from locations l where l.location_name = lt.location_name), 2, split_part(tuesday, '-', 1), split_part(monday, '-', 2) from locations_temp lt
union
select (select l.id from locations l where l.location_name = lt.location_name), 3, split_part(wednesday, '-', 1), split_part(monday, '-', 2) from locations_temp lt
union
select (select l.id from locations l where l.location_name = lt.location_name), 4, split_part(thursday, '-', 1), split_part(monday, '-', 2) from locations_temp lt
union
select (select l.id from locations l where l.location_name = lt.location_name), 5, split_part(friday, '-', 1), split_part(monday, '-', 2) from locations_temp lt
union
select (select l.id from locations l where l.location_name = lt.location_name), 6, split_part(saturday, '-', 1), split_part(monday, '-', 2) from locations_temp lt
union
select (select l.id from locations l where l.location_name = lt.location_name), 7, split_part(sunday, '-', 1), split_part(monday, '-', 2) from locations_temp lt);

-- hold all the distinct opening hours in a table.
insert into openinghours (day, opening_time, closing_time, start_date, end_date)
select distinct day, opening_time, closing_time, '1-Dec-2018', null from openinghours_temp;


-- add the library lookup table
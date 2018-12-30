create table openinghours_temp (
	location_id integer,
    day integer,
    opening_time time,
    closing_time time
);

insert into openinghours_temp (location_id, day, opening_time, closing_time)
(select (select l.id from locations l where l.location_name = lt.location_name), 1, split_part(monday, '-', 1)::time, split_part(monday, '-', 2)::time from locations_temp lt where monday != 'closed'
union
select (select l.id from locations l where l.location_name = lt.location_name), 2, split_part(tuesday, '-', 1)::time, split_part(tuesday, '-', 2)::time from locations_temp lt where tuesday != 'closed'
union
select (select l.id from locations l where l.location_name = lt.location_name), 3, split_part(wednesday, '-', 1)::time, split_part(wednesday, '-', 2)::time from locations_temp lt where wednesday != 'closed'
union
select (select l.id from locations l where l.location_name = lt.location_name), 4, split_part(thursday, '-', 1)::time, split_part(thursday, '-', 2)::time from locations_temp lt where thursday != 'closed'
union
select (select l.id from locations l where l.location_name = lt.location_name), 5, split_part(friday, '-', 1)::time, split_part(friday, '-', 2)::time from locations_temp lt where friday != 'closed'
union
select (select l.id from locations l where l.location_name = lt.location_name), 6, split_part(saturday, '-', 1)::time, split_part(saturday, '-', 2)::time from locations_temp lt where saturday != 'closed');

-- hold all the distinct opening hours in a table.
insert into openinghours (day, opening_time, closing_time, start_date, end_date)
select distinct day, opening_time, closing_time, '1-Dec-2018'::timestamp, null::timestamp from openinghours_temp;

-- add the library lookup table
insert into location_openinghours (location_id, openinghours_id)
select t.location_id, o.id
from openinghours_temp t
join openinghours o
on o.opening_time = t.opening_time
and o.closing_time = t.closing_time
and o.day = t.day
order by t.location_id, o.id;

-- drop temp table
drop table openinghours_temp;
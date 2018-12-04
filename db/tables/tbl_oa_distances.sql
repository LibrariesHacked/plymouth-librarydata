create table oa_distances (
    id integer not null,
    oa_id integer not null,
    travel_id integer not null,
    location_id integer not null,
    duration numeric,
    distance numeric
);
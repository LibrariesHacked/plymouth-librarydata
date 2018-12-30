create table oa_distances (
    oa_code character (9) not null,
    travel_id integer not null,
    location_id integer not null,
    duration numeric,
    distance numeric,
    constraint pk_oadistances_oalocationtravel primary key (oa_code, travel_id, location_id)
);
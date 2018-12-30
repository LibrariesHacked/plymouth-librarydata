create table location_openinghours (
    location_id integer,
    openinghours_id integer,
    constraint pk_locationopeninghours_id primary key (location_id, openinghours_id)
);
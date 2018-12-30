create table oas (
    objectid integer not null,
    oa11cd character(9) not null,
    lad11cd character(9) not null,
    st_areasha numeric,
    st_lengths numeric,
    geom geometry,
    constraint pk_oas_id primary key (objectid)
);
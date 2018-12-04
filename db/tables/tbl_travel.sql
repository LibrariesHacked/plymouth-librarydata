-- 
create table travel (
    id serial not null,
    travel_type character varying (20),
    constraint pk_travel_id primary key (id)
);
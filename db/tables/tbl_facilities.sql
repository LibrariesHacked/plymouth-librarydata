create table facilities (
    id serial not null,
    facility_name character varying (50),
    description character varying (100),
    icon character varying (20),
    constraint pk_facilities_id primary key (id)
);
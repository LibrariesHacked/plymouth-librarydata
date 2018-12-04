create table location_facilities (
    location_id integer not null,
    facility_id integer not null,
    constraint pk_locationfacilities_locationidfacilityid primary key (location_id, facility_id)
);
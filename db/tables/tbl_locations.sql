create table locations (
    id serial not null,
    location_name text not null,
    address_1 text,
    address_2 text,
    address_3 text,
    postcode text,
    latitude numeric,
    longitude numeric,
    website_url text,
    photo_url text,
    constraint pk_locations_id primary key (id)
);

select AddGeometryColumn ('public', 'locations', 'geom', 4326, 'POINT', 2);
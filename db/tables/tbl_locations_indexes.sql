------------------------------------------------------
-- table: locations. indexes
------------------------------------------------------

-- index: cuix_locations_id
-- drop index cuix_locations_id;
create unique index cuix_locations_id on locations using btree (id);
alter table locations cluster on cuix_locations_id;

-- index: ix_locations_name
-- drop index ix_locations_name;
create index ix_locations_name on locations using btree (location_name);

-- index: ix_locations_geom.  a spatial index on the geometry.
create index ix_locations_geom on locations using gist (geom);
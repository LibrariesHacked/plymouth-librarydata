------------------------------------------------------
-- table: location_facilities. indexes
------------------------------------------------------

-- index: cuix_locationfacilities_locationidfacilityid
-- drop index cuix_locationfacilities_locationidfacilityid;
create unique index cuix_locationfacilities_locationidfacilityid on location_facilities using btree (location_id, facility_id);
alter table location_facilities cluster on cuix_locationfacilities_locationidfacilityid;

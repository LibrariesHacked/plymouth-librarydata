------------------------------------------------------
-- table: location_openinghours. indexes
------------------------------------------------------

-- index: cuix_locationopeninghours_locationidopeninghoursid
-- drop index cuix_locationopeninghours_locationidopeninghoursid;
create unique index cuix_locationopeninghours_locationidopeninghoursid on location_openinghours using btree (location_id, openinghours_id);
alter table location_openinghours cluster on cuix_locationopeninghours_locationidopeninghoursid;

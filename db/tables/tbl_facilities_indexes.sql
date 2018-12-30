------------------------------------------------------
-- table: facilities. indexes
------------------------------------------------------

-- index: cuix_facilities_id
-- drop index cuix_facilities_id;
create unique index cuix_facilities_id on facilities using btree (id);
alter table facilities cluster on cuix_facilities_id;

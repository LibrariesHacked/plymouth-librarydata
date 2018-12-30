------------------------------------------------------
-- table: openinghours. indexes
------------------------------------------------------

-- index: cuix_openinghours_id
-- drop index cuix_openinghours_id;
create unique index cuix_openinghours_id on openinghours using btree (id);
alter table openinghours cluster on cuix_openinghours_id;


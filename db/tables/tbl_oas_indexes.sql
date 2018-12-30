------------------------------------------------------
-- table: oas. indexes
------------------------------------------------------

-- index: cuix_oas_objectid
-- drop index cuix_oas_objectid;
create unique index cuix_oas_objectid on oas using btree (objectid);
alter table oas cluster on cuix_oas_objectid;

-- index: ix_oas_oa11cd
-- drop index ix_oas_oa11cd;
create index ix_oas_oa11cd on oas using btree (oa11cd);

-- index: ix_oas_geom.  a spatial index on the geometry.
create index ix_oas_geom on oas using gist (geom);
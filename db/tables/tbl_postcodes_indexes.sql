------------------------------------------------------
-- table: postcodes. indexes
------------------------------------------------------

-- index: cuix_oas_postcodetrim
-- drop index cuix_oas_postcodetrim;
create unique index cuix_oas_postcodetrim on postcodes using btree (postcode_trim);
alter table postcodes cluster on cuix_oas_postcodetrim;

-- index: ix_oas_postcode
-- drop index ix_oas_postcode;
create index ix_oas_postcode on postcodes using btree (postcode);

-- index: ix_postcodes_geom. a spatial index on the geometry.
create index ix_postcodes_geom on postcodes using gist (geom);
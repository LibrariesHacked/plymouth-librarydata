------------------------------------------------------
-- table: oa_distances. indexes
------------------------------------------------------

-- index: cuix_oadistances_oalocationtravel
-- drop index cuix_oadistances_oalocationtravel;
create unique index cuix_oadistances_oalocationtravel on oa_distances using btree (oa_code, travel_id, location_id);
alter table oa_distances cluster on cuix_oadistances_oalocationtravel;

-- index: ix_oadistances_oacode
-- drop index ix_oadistances_oacode;
create index ix_oadistances_oacode on oa_distances using btree (oa_code);
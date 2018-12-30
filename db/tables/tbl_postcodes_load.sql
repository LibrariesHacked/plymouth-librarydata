---------------------------------------------------------------
-- table: postcodes.  load data
---------------------------------------------------------------

\copy postcodes from 'C:\Development\LibrariesHacked\plymouth-librarydata\data\postcodes.csv' delimiter ',' csv;

-- add the geometry column for the table
select AddGeometryColumn ('postcodes','geom',27700,'POINT',2);
-- and update the column to store the coordinates
update postcodes set geom = ST_SetSRID(ST_MakePoint(eastings, northings), 27700);
select UpdateGeometrySRID('postcodes', 'geom', 27700);

-- add an output area lookup (takes about 13 mins)
alter table postcodes add column oa_code character varying(9);
update postcodes p
set oa_code = (
    select oa11cd from oas oa
    where (p.admin_district_code = oa.lad11cd OR p.admin_county_code = oa.lad11cd)
    and st_within(p.geom, oa.geom)
);

-- add a non-whitespace version of the postcode
alter table postcodes add column postcode_trim character varying(8);
update postcodes set postcode_trim = replace(postcode, ' ', '');
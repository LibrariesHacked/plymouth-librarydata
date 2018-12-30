
-- import ons data
ogr2ogr -f "PostgreSQL" -a_srs "EPSG:27700" PG:"host= user= dbname=plymouth password=" Output_Area_December_2011_Full_Clipped_Boundaries_in_England_and_Wales.shp -lco GEOMETRY_NAME=geom -lco FID=objectid -lco PRECISION=no -nlt PROMOTE_TO_MULTI -nln oas -overwrite

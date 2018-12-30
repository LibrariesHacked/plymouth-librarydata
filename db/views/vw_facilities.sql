-- returns all facilities
create view vw_facilities as
select facility_name, description, icon from facilities;
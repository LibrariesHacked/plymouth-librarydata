create view dowlookup as
select 
	to_char((date_trunc('week',current_date)::date) + i,'Dy') as wkday,
	to_char((date_trunc('week',current_date)::date) + i,'ID')::integer as isodow
from generate_series(0,6) i
order by isodow;
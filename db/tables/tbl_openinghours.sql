create table openinghours (
    id serial not null,
    day integer,
    opening_time time,
    closing_time time,
    start_date timestamp,
    end_date timestamp,
    constraint pk_openinghours_id primary key (id)
);
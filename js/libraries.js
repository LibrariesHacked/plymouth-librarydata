var Libraries = {
    libraries: [],
    load: function (callback) {
        // load all the data
        var events_yql = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%20IN%20('https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D1'%2C%20'https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D2'%2C%20'https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D3'%2C%20'https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D4'%2C%20'https%3A%2F%2Fwww.plymouth.gov.uk%2Ftaxonomy%2Fterm%2F88%2Fall%2Ffeed%3Fpage%3D5')&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        var requests = [
            // The library locations
            $.ajax('data/libraries.csv'),
            // The services each library offers
            $.ajax('data/library_services.csv'),
            // Event feed page 1
            $.ajax(events_yql)
        ];

        // 
        $.when.apply($, requests).done(function () {
            var library_data = Papa.parse(arguments[0][2].responseText, { header: true, skipEmptyLines: true }).data;
            var library_services = Papa.parse(arguments[1][2].responseText, { header: true, skipEmptyLines: true }).data;
            var events = arguments[2][2].responseJSON;

            $.each(library_data, function (x, library) {
                var opening_hours = {
                    'Sunday': {},
                    'Monday': {},
                    'Tuesday': {},
                    'Wednesday': {},
                    'Thursday': {},
                    'Friday': {},
                    'Saturday': {}
                };

                $.each(Object.keys(opening_hours), function (y, key) {
                    var open = library[key] ? library[key].split('-')[0] : 'Closed';
                    var close = library[key] ? library[key].split('-')[1] : 'Closed';
                    if (open !== 'closed') opening_hours[key] = { open: open, close: close };
                });

                $.each(library_services, function (y, serv) {
                    if (serv['Library'] === library.name) library.services = serv;
                });

                var event_list = [];
                $.each(events.query.results.item, function (x, result) {
                    if (library.name == result.title.split(': ')[1]) event_list.push(result.title.split(': ')[0]);
                });

                library.opening_hours = opening_hours;
                library.events = event_list;
            });
            this.libraries = library_data;
            this.setOpenStatus();
            callback();
        }.bind(this));
    },
    setOpenStatus: function () {
        var day = moment().format('dddd');
        $.each(this.libraries, function (x, lib) {
            // is it currently open?
            var open = false;
            if (lib.opening_hours[day] && lib.opening_hours[day].open && lib.opening_hours[day].close) {
                var open_time = moment(lib.opening_hours[day].open, 'HH:mm');
                var close_time = moment(lib.opening_hours[day].close, 'HH:mm');
                if (moment() >= open_time && moment() <= close_time) open = true;
            }
            lib.open = open;
            if (open) {
                // when is it closing
                var close_time = moment(lib.opening_hours[day].close, 'HH:mm');
                lib.status = 'Open for another ' + moment().to(close_time, true);
            } else {
                // When is it next open - gotta check each next day
                var open_day = '';
                for (i = 1; i < 8; i++) {
                    var test_day = moment().add(i, 'day').format('dddd');
                    if (lib.opening_hours[test_day].open) {
                        open_day = test_day;
                        break;
                    }
                }
                lib.status = 'Opening in ' + moment().to(moment(test_day + ' ' + lib.opening_hours[test_day].open, 'dddd HH:mm'), true);
            }
        });
    }
};
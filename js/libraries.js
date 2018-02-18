var Libraries = {
    libraries: [],
    load: function (callback) {
        // load all the data
        var requests = [
            $.ajax('data/libraries.csv')
        ];

        // 
        $.when.apply($, requests).done(function () {
            var library_data = Papa.parse(arguments[2].responseText, { header: true, skipEmptyLines: true }).data;
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
                library['opening_hours'] = opening_hours;
                
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
                // When is it next open - gotta
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
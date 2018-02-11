var Libraries = {
    libraries: [],
    load: function (callback) {
        // load all the data
        var requests = [
            $.ajax('data/libraries.csv')
        ];

        // 
        $.when.apply($, requests).done(function () {
            this.libraries = Papa.parse(arguments[2].responseText, { header: true, skipEmptyLines: true }).data;
            callback();
        }.bind(this));
    }
};
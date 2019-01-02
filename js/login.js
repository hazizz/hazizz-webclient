function UserLogin(){
    var self = this;
    self.username = ko.observable();
    self.password = ko.observable();
    self.URI = 'https://hazizz.duckdns.org/auth'

    console.log(self.username());

    self.ajax = function(uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            cache: false,
            dataType: 'json',
            data: JSON.stringify(data),
            error: function(jqXHR) {
                console.log("ajax error " + jqXHR.status);
            }
        };
        return $.ajax(request);
    }

    self.ajax(self.URI, 'POST', {"username":self.username, "password":self.password}).done(function (data) {
        $('#here').html(data)
    });
}
ko.applyBindings(new UserLogin(), $('#login')[0])
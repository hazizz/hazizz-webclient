function UserLogin() {
    var self = this;
    self.username = ko.observable("");
    if (Cookies.get('username')) {
        self.username = ko.observable(Cookies.get('username'));
    }
    self.password = ko.observable("");
    self.rememberMe = ko.observable(false);

    self.errorTitle = ko.observable("");
    self.errorBody = ko.observable("");
    self.URI = 'https://hazizz.duckdns.org:9000/auth-server/auth/accesstoken';

    self.ajax = function (uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            cache: false,
            dataType: 'json',
            data: JSON.stringify(data),
            error: function (xhr) {
                console.log(xhr);
                if (xhr.statusText == "timeout") {
                    self.ajax(uri, method, type, data);
                } else {
                    if (xhr.responseJSON) {
                        self.errorTitle(xhr.responseJSON.title);
                        self.errorBody(xhr.responseJSON.message);
                    } else if (xhr.responseText) {
                        self.errorTitle(JSON.parse(xhr.responseText).title);
                        self.errorBody(JSON.parse(xhr.responseText).message);
                    }
                    $('#errorModal').modal('show');
                }
            }
        };
        return $.ajax(request);
    }

    if (Cookies.get('refresh') && Cookies.get('username')) {
        self.ajax(self.URI, 'POST', {"username": Cookies.get('username'), "refreshToken": Cookies.get('refresh')})
            .done(function (data) {
                Cookies.set('token', data.token, {expire: 1});
                Cookies.set('refresh', data.refresh, {expire: 7});

                self.username("");
                self.password("");
                self.rememberMe(false);
                window.location.href = "index.html";
            })
    }

    self.login = function () {
        if (self.username() && self.password()) {
            var data = {"username": self.username(), "password": sha256(self.password())};

            self.ajax(self.URI, 'POST', data)
                .done(function (data) {
                    Cookies.set('token', data.token, {expire: 1});
                    Cookies.set('refresh', data.refresh, {expire: 7});
                    if (self.rememberMe()) {
                        Cookies.set('username', self.username());
                    }

                    self.username("");
                    self.password("");
                    self.rememberMe(false);
                    window.location.href = "index.html";
                })
        }
    }
}

ko.applyBindings(new UserLogin(), $('#login')[0]);
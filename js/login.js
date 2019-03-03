function UserLogin() {
    var self = this;
    self.username = ko.observable("");
    if(Cookies.get('username')){
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
            data: JSON.stringify(data)
        };
        return $.ajax(request);
    }

    if(Cookies.get('refresh') && Cookies.get('username')){
        self.ajax(self.URI, 'POST', {"username": Cookies.get('username'), "refreshToken": Cookies.get('refresh')})
            .done(function (data){
                Cookies.set('token', data.token, {expire: 1});
                Cookies.set('refresh', data.refresh, {expire: 7});

                self.username("");
                self.password("");
                self.rememberMe(false);
                window.location.href = "index.html";
            })
            .fail(function (data) {
                console.log(data.getAllResponseHeaders());
            });
    }

    self.login = function () {
        if (self.username() && self.password()) {
            var data = {"username": self.username(), "password": sha256(self.password())};

            self.ajax(self.URI, 'POST', data)
                .done(function (data) {
                    Cookies.set('token', data.token, {expire: 1});
                    Cookies.set('refresh', data.refresh, {expire: 7});
                    if(self.rememberMe()){
                        Cookies.set('username', self.username());
                    }

                    self.username("");
                    self.password("");
                    self.rememberMe(false);
                    window.location.href = "index.html";
                })
                .fail(function (data) {
                    self.errorBody(data.responseJSON.message);
                    self.errorTitle(data.responseJSON.title);
                    $("#errorModal").modal('show');
                });
        }
    }
}

ko.applyBindings(new UserLogin(), $('#login')[0]);
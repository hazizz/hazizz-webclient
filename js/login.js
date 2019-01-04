function UserLogin() {
    var self = this;
    self.username = ko.observable();
    self.password = ko.observable();
    self.rememberMe = ko.observable();
    self.crypt = ko.observable();
    self.URI = 'https://hazizz.duckdns.org:8081/auth/';

    self.ajax = function (uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            cache: false,
            dataType: 'json',
            data: JSON.stringify(data),
            error: function (jqXHR) {
                console.log("Error code: " + jqXHR.status);
                console.log("Error message: " + jqXHR.responseText);
            },
            success: function (jqXHR) {
                console.log("Success!");
            }
        };
        return $.ajax(request);
    }

    if(Cookies.get('refresh')){
        self.ajax(self.URI, 'POST', {"username": Cookies.get('username'), "refreshToken": Cookies.get('refresh')}).done(function (data){
            Cookies.remove('token'); //DEV
            Cookies.remove('refresh'); //DEV
            console.log('######### AUTH WITH REFRESH #########')
            Cookies.set('token', data.token, {expire: 1});
            console.log("Token: " + Cookies.get('token'));
            Cookies.set('refresh', data.refresh, {expire: 7});
            console.log("Refresh: " + Cookies.get('refresh'));
            self.username("");
            self.password("");
            self.rememberMe(false);
            window.location.href = "index.html";
        });
    }

    self.login = function () {
        var data;
        if (self.crypt() == true) {
            data = {"username": self.username(), "password": sha256(self.password())};
        }else{
            data = {"username": self.username(), "password": self.password()};
        }
        console.log("Sima (JSON): " + JSON.stringify({"username": self.username(), "password": self.password()}));
        console.log("Cryped (JSON): " + JSON.stringify({"username": self.username(), "password": sha256(self.password())}));
        console.log("Elküldve (JSON): " + JSON.stringify(data));
        self.ajax(self.URI, 'POST', data).done(function (data) {
            Cookies.remove('token'); //DEV
            Cookies.remove('refresh'); //DEV
            Cookies.remove('username'); //DEV
            Cookies.set('token', data.token, {expire: 1});
            console.log("Token: " + Cookies.get('token'));
            if(self.rememberMe()){
                Cookies.set('username', self.username(), {expire: 7});
                Cookies.set('refresh', data.refresh, {expire: 7});
                console.log("Refresh: " + Cookies.get('refresh'));
            }
            self.username("");
            self.password("");
            self.rememberMe(false);
            window.location.href = "index.html";
        });
    }
}

ko.applyBindings(new UserLogin(), $('#login')[0]);
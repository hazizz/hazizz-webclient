function GetConsole() {
    var self = this;
    self.authURI = 'https://hazizz.duckdns.org:9000/auth-server/auth/accesstoken';
    self.adminTestURI = 'https://hazizz.duckdns.org:9000/hazizz-server/admin';
    self.consoleURI = 'https://hazizz.duckdns.org:9000/logger-server/gateway-server';
    self.token = "";

    self.console = ko.observableArray([]);
    self.ajax = function (uri, method, data) {
        var counter = 0;
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(data),
            timeout: 3000,
            error: function (xhr) {
                console.log(xhr);
                setTimeout(function () {
                    window.location.reload();
                }, 10000);
            }
        }
        if (self.token != '') {
            request.beforeSend = function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.token);
            }
        }
        return $.ajax(request);
    };

    var username = prompt("Please enter username", "");
    var coded = confirm("Jelszó kódolva?");
    var password = prompt("Please enter password:", "");
    if (coded) {
        password = sha256(password);
    }
    self.ajax(self.authURI, 'POST', {"username": username, "password": password}).done(function (data) {
        self.token = data.token;
    }).then(function () {
        self.ajax(self.adminTestURI, 'GET').done(function (admin) {
            if (!admin) {
                window.location.reload();
            }
        });
    })

    setInterval(function () {
        self.ajax(self.consoleURI, 'GET').done(function (data) {
            self.console([]);
            for (var i = 0; i < data.length; i++){
                self.console.push(data[i]);
            }
        })
    }, 7000)
}

ko.applyBindings(new GetConsole(), $('body')[0]);

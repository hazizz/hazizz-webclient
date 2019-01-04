function ListGroups() {
    var self = this;
    self.groupsURI = 'https://hazizz.duckdns.org:8081/me/groups';
    if (Cookies.get('token')){
        self.token = Cookies.get('token');
    } else {
        window.location.href = "login.html";
    }
    self.groups = ko.observableArray();

    self.ajax = function (uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            cache: false,
            dataType: 'json',
            data: JSON.stringify(data),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.token);
            },
            error: function (jqXHR) {
                console.log("Error code: " + jqXHR.status);
                console.log("Error message: " + jqXHR.responseText);
            },
            success: function (jqXHR) {
                console.log("Success!")
            }
        }
        return $.ajax(request);
    }

    self.ajax(self.groupsURI, 'GET').done(function (data) {
        for (var i = 0; i < data.length; i++) {
            switch (data[i].groupType) {
                case "OPEN":
                    data[i].groupType = "Nyitott";
                    break;
                case "INVITE_ONLY":
                    data[i].groupType = "Mhívás alp."
                    break;
                case "PASSWORD":
                    data[i].groupType = "Jelszó v."
                    break;
            }
            self.groups.push({
                name: ko.observable(data[i].name),
                groupType: ko.observable(data[i].groupType),
                userCount: ko.observable(data[i].userCount)
            });
        };
    });
};

ko.applyBindings(new ListGroups(), $('#groups')[0]);

function AddGroups(){
    var self = this;
    self.createURI = 'https://hazizz.duckdns.org:8081/groups';
    if (Cookies.get('token')){
        self.token = Cookies.get('token');
    } else {
        window.location.href = "login.html";
    }
    self.groupName = ko.observable();
    self.groupType = ko.observable();

    self.ajax = function (uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            cache: false,
            dataType: 'json',
            data: JSON.stringify(data),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.token);
            },
            error: function (jqXHR) {
                console.log("Error code: " + jqXHR.status);
                console.log("Error message: " + jqXHR.responseText);
            },
            success: function (jqXHR) {
                console.log("Success!")
            }
        }
        return $.ajax(request);
    }

    self.create = function () {
        console.log(self.groupName());
        self.ajax(self.createURI, 'POST', {"groupName":self.groupName(), "type":self.groupType()}).done(function (data) {
            console.log("New group: " + data);
            $('#newGroupModal').modal('hide')
        })
    }
};
ko.applyBindings(new AddGroups(), $('#newGroup')[0]);

/* DEV */
function logout() {
    Cookies.remove('token');
    Cookies.remove('refresh');
    Cookies.remove('username');
    window.location.href = 'login.html';
}
function ListGroups() {
    var self = this;
    self.groupsURI = 'https://hazizz.duckdns.org:8081/me/groups';
    self.grouptasksURI = 'https://hazizz.duckdns.org:8081/tasks/groups/';
    self.permissionsURI = 'https://hazizz.duckdns.org:8081/me/permissions';
    if (Cookies.get('token')){
        self.token = Cookies.get('token');
    } else {
        window.location.href = "login.html";
    }
    self.groups = ko.observableArray();
    self.alltasks = ko.observableArray();

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
                default:
                    data[i].groupType = "Egyéb"
                    break;
            }
            self.groups.push({
                id: ko.observable(data[i].id),
                name: ko.observable(data[i].name),
                groupType: ko.observable(data[i].groupType),
                userCount: ko.observable(data[i].userCount)
            });
        };
    });

    self.tasks = function (group) {
        console.log("Tasks got from: #" + group.id())
        self.ajax(self.grouptasksURI + group.id(), 'GET').done(function (data) {
            var rdata = [];
            for (var i = 0; i < data.length; i++) {
                switch (data[i].type.name) {
                    case "homework":
                        data[i].type.name = "Házi feladat";
                        break;
                    case "assigment":
                        data[i].type.name = "Beadandó";
                        break;
                    case "test":
                        data[i].type.name = "Teszt";
                        break;
                    case "oral test":
                        data[i].type.name = "Felelet"
                        break;
                    default:
                        data[i].type.name = "Egyéb";
                        break;
                }
                data[i].dueDate = moment(data[i].dueDate, "YYYY-MM-DD").fromNow(true);
                rdata.push({
                    id: data[i].id,
                    type: data[i].type.name,
                    title: data[i].title,
                    description: data[i].description,
                    dueDate: data[i].dueDate,
                    creator: data[i].creator.displayName,
                    subject: data[i].subject
                });
            }
            self.alltasks(rdata);
        });
    };
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
    self.groupPassword = ko.observable();

    self.ajax = function (uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            cache: false,
            dataType: 'text',
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
        console.log("Group created! Group name: " + self.groupName() + ", group type: " + self.groupType());
        var data;
        if (self.groupType() == "PASSWORD"){
            data = {"groupName":self.groupName(), "type":self.groupType(), "password":self.groupPassword()};
        } else{
            data = {"groupName":self.groupName(), "type":self.groupType()};
        }
        self.ajax(self.createURI, 'POST', data).done(function () {
            $('#newGroupModal').modal('hide');
            self.groupName("");
        });
    };
};
ko.applyBindings(new AddGroups(), $('#newGroup')[0]);

/* DEV */
function logout() {
    Cookies.remove('token');
    Cookies.remove('refresh');
    Cookies.remove('username');
    window.location.href = 'login.html';
}
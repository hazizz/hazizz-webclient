function ListGroups() {
    var self = this;
    self.baseURI = 'https://hazizz.duckdns.org:8081/'
    if (Cookies.get('token')){
        self.token = Cookies.get('token');
    } else {
        window.location.href = "login.html";
    }
    self.groups = ko.observableArray();
    self.alltasks = ko.observableArray();
    self.groupName = ko.observable();
    self.groupType = ko.observable();
    self.groupPassword = ko.observable();
    self.joinGroupName = ko.observable();
    self.joinableGroups = ko.observableArray();

    /**
     *
     * @param uri
     *      String, URL where the request will be sent.
     * @param method
     *      String, http method, GET or POST.
     * @param type
     *      String, data type, 'json' is recommended.
     * @param data
     *      Object, the data which is sent in the body.
     * @returns {*}
     *      Error or success.
     */
    self.ajax = function (uri, method, type, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            cache: false,
            dataType: type,
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

    // GET the groups
    self.ajax(self.baseURI + 'me/groups', 'GET', 'json').done(function (data) {
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

    self.ajax(self.baseURI + 'me/tasks', 'GET', 'json').done(function (data) {
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
                subject: data[i].subject.name,
                group: data[i].group.name
            });
        }
        self.alltasks(rdata);
    });

    // GET the task, on click.
    self.tasks = function (group) {
        console.log("Tasks got from: #" + group.id())
        self.ajax(self.baseURI + 'tasks/groups/' + group.id(), 'GET', 'json').done(function (data) {
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
                    subject: data[i].subject.name
                });
            }
            self.alltasks(rdata);
        });
    };

    // CREATE a group.
    self.createGroup = function () {
        console.log("Group created! Group name: " + self.groupName() + ", group type: " + self.groupType());
        var data;
        if (self.groupType() == "PASSWORD"){
            data = {"groupName":self.groupName(), "type":self.groupType(), "password":self.groupPassword()};
        } else{
            data = {"groupName":self.groupName(), "type":self.groupType()};
        }
        self.ajax(self.baseURI + 'groups', 'POST', 'text', data).done(function () {
            $('#newGroupModal').modal('hide');
            self.groupName("");
        });
    };

    //SEARCH a group.
    self.searchGroup = function () {
        self.ajax(self.baseURI + 'groups', 'GET', 'json').done(function (data) {
            for (var i = 0; i < data.length; i++) {
                console.log(i + ": " + self.joinGroupName() + " == " +  data[i].name);
                switch (data[i].groupType) {
                    case "OPEN":
                        data[i].groupType = "Nyitott";
                        break;
                    case "INVITE_ONLY":
                        data[i].groupType = "Meghívás alapú"
                        break;
                    case "PASSWORD":
                        data[i].groupType = "Jelszó védett"
                        break;
                    default:
                        data[i].groupType = "Egyéb"
                        break;
                }
                if (self.joinGroupName() == data[i].name){
                    self.joinableGroups.push({
                        id: data[i].id,
                        name: data[i].name,
                        uniqueName: data[i].uniqueName,
                        groupType: data[i].groupType,
                        userCount: data[i].userCount
                    });
                }
            }
            console.log(self.joinableGroups());
        })
    }

    //JOIN a group.
    self.joinGroup = function (group) {
        self.ajax(self.baseURI + 'me/joingroup/uname/' + group.uniqueName, 'GET', 'text').done(function () {
            $('#joinGroupModal').modal('hide');
        })
    }
};

ko.applyBindings(new ListGroups(), $('#groups')[0]);
ko.applyBindings(new ListGroups(), $('#newGroup')[0]);
ko.applyBindings(new ListGroups(), $('#joinGroup')[0]);

/* DEV */
function logout() {
    Cookies.remove('token');
    Cookies.remove('refresh');
    Cookies.remove('username');
    window.location.href = 'login.html';
}
function Index() {
    var self = this;
    if (Cookies.get('token')){
        self.token = Cookies.get('token');
    }else {
        window.location.href = "login.html";
    }
    self.baseURI = 'https://hazizz.duckdns.org:9000';

    self.myGroups = ko.observableArray("");
    self.myTasks = ko.observableArray("");

    self.commentBody = ko.observable("");
    self.comments = ko.observableArray("");
    self.currentTask;
    self.replyIds = [];
    self.commentIds = [];
    self.headerTask = ko.observable("");

    self.newGroupName = ko.observable("");
    self.newGroupType = ko.observable("");
    self.newGroupPassword = ko.observable("");

    self.joinGroupName = ko.observable("");
    self.joinGroupPassword = ko.observable("");
    self.joinableGroups = ko.observableArray("");
    self.headerGroup = ko.observable("");
    self.fromGroup = ko.observable(false);

    self.errorTitle = ko.observable();
    self.errorBody = ko.observable();

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
            }
        }
        return $.ajax(request);
    };

    // GET the groups
    self.ajax(self.baseURI + '/hazizz-server/me/groups', 'GET', 'json')
        .done(function (data) {
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);
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
                self.myGroups.push({
                    id: data[i].id,
                    name: data[i].name,
                    groupType: data[i].groupType,
                    userCount: data[i].userCount,
                });
            };
        })
        .fail(function (data) {
            self.errorTitle(data.responseJSON.title);
            self.errorBody(data.responseJSON.message);
            $('#errorModal').modal('show');
        });

    var getAllTasks = function (){
        self.ajax(self.baseURI + '/hazizz-server/me/tasks', 'GET', 'json')
            .done(function (data) {
                self.myTasks([]);
                self.fromGroup(false);
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
                            data[i].type.name = "Felelet";
                            break;
                        default:
                            data[i].type.name = "Egyéb";
                            break;
                    };
                    data[i].dueDate = moment(data[i].dueDate, "YYYY-MM-DD").fromNow(true);
                    self.myTasks.push({
                        id: data[i].id,
                        type: data[i].type.name,
                        title: data[i].title,
                        description: data[i].description,
                        dueDate: data[i].dueDate,
                        creator: data[i].creator.displayName,
                        subject: data[i].subject.name,
                        group: data[i].group.name,
                        groupId: data[i].group.id
                    });
                };
            })
            .fail(function (data) {
                self.errorTitle(data.responseJSON.title);
                self.errorBody(data.responseJSON.message);
                $('#errorModal').modal('show');
            });
    };
    getAllTasks()
    self.getAllTasks = getAllTasks;

    var setHeaderGroup = function(group){
        self.ajax(self.baseURI + '/hazizz-server/groups/' + group.id + '/details', 'GET', 'json')
            .done(function (data) {
                self.headerGroup({
                    name: data.name,
                    users: data.users
                })
            })
            .fail(function (data) {
                self.errorTitle(data.responseJSON.title);
                self.errorBody(data.responseJSON.message);
                $('#errorModal').modal('show');
            });
    }

    // GET the tasks, on click.
    self.tasks = function (group) {
        setHeaderGroup(group);
        self.ajax(self.baseURI + '/hazizz-server/me/tasks/groups/' + group.id, 'GET', 'json')
            .done(function (data) {
                self.myTasks([]);
                self.fromGroup(true);
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
                            data[i].type.name = "Felelet";
                            break;
                        default:
                            data[i].type.name = "Egyéb";
                            break;
                    };
                    data[i].dueDate = moment(data[i].dueDate, "YYYY-MM-DD").fromNow(true);
                    self.myTasks.push({
                        id: data[i].id,
                        type: data[i].type.name,
                        title: data[i].title,
                        description: data[i].description,
                        dueDate: data[i].dueDate,
                        creator: data[i].creator.displayName,
                        subject: data[i].subject.name,
                        group: data[i].group.name,
                        groupId: data[i].group.id
                    });
                };
            })
            .fail(function (data) {
                self.errorTitle(data.responseJSON.title);
                self.errorBody(data.responseJSON.message);
                $('#errorModal').modal('show');
            });
    };

    // CREATE a group.
    self.createGroup = function () {
        var data;
        if (self.newGroupType() == "PASSWORD"){
            data = {"groupName":self.newGroupName(), "type":self.newGroupType(), "password":self.newGroupPassword()};
        } else{
            data = {"groupName":self.newGroupName(), "type":self.newGroupType()};
        }
        self.ajax(self.baseURI + '/hazizz-server/groups', 'POST', 'text', data)
            .done(function () {
                $('#newGroupModal').modal('hide');
                self.newGroupName("");
            })
            .fail(function (data) {
                self.errorTitle(data.responseJSON.title);
                self.errorBody(data.responseJSON.message);
                $('#errorModal').modal('show');
            });
    };

    //SEARCH a group.
    self.searchGroup = function () {
        self.ajax(self.baseURI + '/hazizz-server/groups', 'GET', 'json')
            .done(function (data) {
                for (var i = 0; i < data.length; i++) {
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
                    };
                    if (self.joinGroupName() == data[i].name){
                        self.joinableGroups.push({
                            id: data[i].id,
                            name: data[i].name,
                            groupType: data[i].groupType,
                            userCount: data[i].userCount
                        });
                    };
                };
            })
            .fail(function (data) {
                self.errorTitle(data.responseJSON.title);
                self.errorBody(data.responseJSON.message);
                $('#errorModal').modal('show');
        });
    };

    //JOIN a group.
    self.joinGroup = function (group) {
        if (group.type == 'Jelszó védett') {
            self.ajax(self.baseURI + '/hazizz-server/me/joingroup/' + group.id + '/' + self.joinGroupPassword(), 'GET', 'text')
                .done(function () {
                    $('#joinGroupModal').modal('hide');
                })
                .fail(function (data) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                    $('#errorModal').modal('show');
                });
        }else {
            self.ajax(self.baseURI + '/hazizz-server/me/joingroup/' + group.id, 'GET', 'text')
                .done(function () {
                    $('#joinGroupModal').modal('hide');
                })
                .fail(function (data) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                    $('#errorModal').modal('show');
                });
        }
    };

    self.getComments = function (task) {
        self.currentTask = task;
        self.ajax(self.baseURI + '/hazizz-server/tasks/' + task.id + '/comments')
            .done(function (data) {
                self.headerTask(task.title)
                self.comments([])
                for (var i = 0; i < data.length; i++) {
                    if (data[i].children) {
                        for (var j = 0; j < data[i].children.length; j++) {
                            data[i].children[j] = {
                                id: data[i].children[j].id,
                                content: data[i].children[j].content,
                                date: moment(data[i].children[j].creationDate).format("MMM. DD. - HH:mm"),
                                dateValue: new Date(data[i].children[j].creationDate),
                                creatorName: data[i].children[j].creator.displayName,
                            }
                            self.replyIds.push(data[i].children[j].id)
                        }
                    }
                    self.comments.push({
                        id: data[i].id,
                        reply: data[i].children,
                        content: data[i].content,
                        date: moment(data[i].creationDate).format("MMM. DD. - HH:mm"),
                        dateValue: new Date(data[i].creationDate),
                        creatorName: data[i].creator.displayName,
                    });
                    self.commentIds.push(data[i].id)
                }
                self.comments.remove(function (item) {
                    return self.replyIds.includes(item.id);
                })
                self.comments.sort(function (a, b) {
                    return a.dateValue - b.dateValue;
                })
            })
            .fail(function (data) {
                self.errorTitle(data.responseJSON.title);
                self.errorBody(data.responseJSON.message);
                $('#errorModal').modal('show');
            });
    }

    self.sendComment = function () {
        var data = {"content":self.commentBody()};
        self.ajax(self.baseURI + '/hazizz-server/tasks/' + self.currentTask.id + '/comments', 'POST', 'text', data)
            .done(function (data) {
                self.commentBody("");
                self.getComments(self.currentTask);
            })
            .fail(function (data) {
                console.log(data)
                self.errorTitle(data.responseJSON.title);
                self.errorBody(data.responseJSON.message);
                $('#errorModal').modal('show');
            });
    }
};

ko.applyBindings(new Index(), $('#whole')[0]);

/* DEV */
function logout() {
    Cookies.remove('token');
    Cookies.remove('refresh');
    Cookies.remove('username');
    window.location.href = 'login.html';
}
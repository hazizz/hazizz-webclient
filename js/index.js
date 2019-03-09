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
    self.myAnnouncements = ko.observableArray("");

    self.newTaskTitle = ko.observable("");
    self.newTaskDescription = ko.observable("");
    self.newTaskDueDate = ko.observable(moment().add(1, 'd').format("YYYY-MM-DD"));
    self.selectedGroup = ko.observable("");
    self.selectedTaskType = ko.observable("");
    self.taskTypes = ko.observableArray("");
    self.groupSubjects = ko.observableArray("");
    self.selectedSubject = ko.observable("");
    self.newAnnouncementTitle = ko.observable("");
    self.newAnnouncementText = ko.observable("");

    self.newSubjectName = ko.observable("");

    self.taskAnno = ko.observable("task");

    self.commentBody = ko.observable("");
    self.comments = ko.observableArray("");
    self.currentItem = ko.observable("");
    self.replyIds = [];
    self.commentIds = [];
    self.headerItem = ko.observable("");

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
    var getAllGroups = function () {
        self.ajax(self.baseURI + '/hazizz-server/me/groups', 'GET', 'json')
            .done(function (data) {
                self.myGroups([]);
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
                    self.myGroups.push({
                        id: data[i].id,
                        name: data[i].name,
                        groupType: data[i].groupType,
                        userCount: data[i].userCount,
                    });
                };
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });
    };
    getAllGroups();
    self.getAllGroups = getAllGroups;

    var getAllTasks = function (){
        self.ajax(self.baseURI + '/hazizz-server/me/tasks', 'GET', 'json')
            .done(function (data) {
                self.myTasks([]);
                self.myAnnouncements([]);
                self.headerGroup("");
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
                    self.myTasks.push({
                        id: data[i].id,
                        type: data[i].type.name,
                        title: data[i].title,
                        description: data[i].description,
                        dueDate: moment(data[i].dueDate, "YYYY-MM-DD").fromNow(true),
                        dateValue: new Date(data[i].dueDate),
                        creator: data[i].creator.displayName,
                        subject: data[i].subject ? data[i].subject.name : "",
                        group: data[i].group ? data[i].group.name : "",
                        groupId: data[i].group ? data[i].group.id : ""
                    });
                };
                self.myTasks.sort(function (a, b) {
                    return a.dateValue - b.dateValue;
                })
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });
    };
    getAllTasks();
    self.getAllTasks = getAllTasks;

    var setHeaderGroup = function(group){
        self.ajax(self.baseURI + '/hazizz-server/groups/' + group.id + '/details', 'GET', 'json')
            .done(function (data) {
                self.headerGroup({
                    id: data.id,
                    name: data.name,
                    users: data.users
                })
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });
    }

    // GET the tasks, on click.
    self.tasks = function (group) {
        setHeaderGroup(group);
        self.taskAnno("task");
        self.ajax(self.baseURI + '/hazizz-server/me/tasks/groups/' + group.id, 'GET', 'json')
            .done(function (data) {
                self.myAnnouncements([]);
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
                    self.myTasks.push({
                        id: data[i].id,
                        type: data[i].type.name,
                        title: data[i].title,
                        description: data[i].description,
                        dueDate: moment(data[i].dueDate, "YYYY-MM-DD").fromNow(true),
                        dateValue: new Date(data[i].dueDate),
                        creator: data[i].creator.displayName,
                        subject: data[i].subject ? data[i].subject.name : "",
                        group: data[i].group ? data[i].group.name : "",
                        groupId: data[i].group ? data[i].group.id : ""
                    });
                };
                self.myTasks.sort(function (a, b) {
                    return a.dateValue - b.dateValue;
                })
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });;
    };

    self.announcements = function(groupId){
        self.ajax(self.baseURI + '/hazizz-server/announcements/groups/' + groupId, 'GET', 'json')
            .done(function (data) {
                self.myAnnouncements([]);
                self.myTasks([]);
                for (var i = 0; i < data.length; i++) {
                    self.myAnnouncements.push({
                        title: data[i].title,
                        text: data[i].description,
                        creatorName: data[i].creator.displayName,
                        id: data[i].id
                    })
                }
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });
    }

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
                self.getAllGroups();
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
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
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });;
    };

    //JOIN a group.
    self.joinGroup = function (group) {
        if (group.type == 'Jelszó védett') {
            self.ajax(self.baseURI + '/hazizz-server/me/joingroup/' + group.id + '/' + self.joinGroupPassword(), 'GET', 'text')
                .done(function () {
                    $('#joinGroupModal').modal('hide');
                })
                .fail(function (data) {
                    console.log(data);
                    if (data.responseJSON) {
                        self.errorTitle(data.responseJSON.title);
                        self.errorBody(data.responseJSON.message);
                    }else{
                        self.errorTitle(JSON.parse(data.responseText).title);
                        self.errorBody(JSON.parse(data.responseText).message);
                    }
                    $('#errorModal').modal('show');
                });
        }else {
            self.ajax(self.baseURI + '/hazizz-server/me/joingroup/' + group.id, 'GET', 'text')
                .done(function () {
                    $('#joinGroupModal').modal('hide');
                })
                .fail(function (data) {
                    console.log(data);
                    if (data.responseJSON) {
                        self.errorTitle(data.responseJSON.title);
                        self.errorBody(data.responseJSON.message);
                    }else{
                        self.errorTitle(JSON.parse(data.responseText).title);
                        self.errorBody(JSON.parse(data.responseText).message);
                    }
                    $('#errorModal').modal('show');
                });
        }
    };

    self.getComments = function (item) {
        var from;
        if (self.taskAnno() == 'task'){
            from = 'tasks';
        } else{
            from = 'announcements';
        }
        self.currentItem(item);
        self.ajax(self.baseURI + '/hazizz-server/' + from + '/' + item.id + '/comments')
            .done(function (data) {
                self.headerItem(item.title)
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
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });
    };

    self.sendComment = function () {
        var from;
        if (self.taskAnno() == 'task'){
            from = 'tasks';
        } else{
            from = 'announcements';
        }
        var data = {"content":self.commentBody()};
        self.ajax(self.baseURI + '/hazizz-server/' + from + '/' + self.currentItem().id + '/comments', 'POST', 'text', data)
            .done(function (data) {
                self.commentBody("");
                self.getComments(self.currentItem());
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });
    };

    self.prepareNewTask = function () {
        if (self.headerGroup()){
            self.selectedGroup(self.headerGroup().id)
        }
        self.ajax(self.baseURI + '/hazizz-server/tasks/types', 'GET', 'json')
            .done(function (data) {
                self.taskTypes([]);
                for (var i = 0; i < data.length; i++){
                    switch (data[i].name) {
                        case "homework":
                            data[i].name = "Házi feladat";
                            break;
                        case "assigment":
                            data[i].name = "Beadandó";
                            break;
                        case "test":
                            data[i].name = "Teszt";
                            break;
                        case "oral test":
                            data[i].name = "Felelet";
                            break;
                        default:
                            data[i].name = "Egyéb";
                            break;
                    };
                    self.taskTypes.push({
                        name: data[i].name,
                        id: data[i].id
                    })
                }
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });
    }

    self.createTask = function () {
        var data = {
            "taskType":self.selectedTaskType(),
            "taskTitle":self.newTaskTitle(),
            "description":self.newTaskDescription(),
            "dueDate":self.newTaskDueDate()
        }
        if (self.selectedSubject()){
            self.ajax(self.baseURI + "/hazizz-server/tasks/subjects/" + self.selectedSubject(), 'POST', 'text', data)
                .done(function (data) {
                    $('#newTaskModal').modal('hide');
                    location.reload();
                })
                .fail(function (data) {
                    console.log(data);
                    if (data.responseJSON) {
                        self.errorTitle(data.responseJSON.title);
                        self.errorBody(data.responseJSON.message);
                    }else{
                        self.errorTitle(JSON.parse(data.responseText).title);
                        self.errorBody(JSON.parse(data.responseText).message);
                    }
                    $('#errorModal').modal('show');
                });
        }else if(self.selectedGroup()){
            self.ajax(self.baseURI + "/hazizz-server/tasks/groups/" + self.selectedGroup(), 'POST', 'text', data)
                .done(function (data) {
                    $('#newTaskModal').modal('hide');
                    location.reload();
                })
                .fail(function (data) {
                    console.log(data);
                    if (data.responseJSON) {
                        self.errorTitle(data.responseJSON.title);
                        self.errorBody(data.responseJSON.message);
                    }else{
                        self.errorTitle(JSON.parse(data.responseText).title);
                        self.errorBody(JSON.parse(data.responseText).message);
                    }
                    $('#errorModal').modal('show');
                });
        } else{
            self.ajax(self.baseURI + "/hazizz-server/tasks/me", 'POST', 'text', data)
                .done(function (data) {
                    $('#newTaskModal').modal('hide');
                    location.reload();
                })
                .fail(function (data) {
                    console.log(data);
                    if (data.responseJSON) {
                        self.errorTitle(data.responseJSON.title);
                        self.errorBody(data.responseJSON.message);
                    }else{
                        self.errorTitle(JSON.parse(data.responseText).title);
                        self.errorBody(JSON.parse(data.responseText).message);
                    }
                    $('#errorModal').modal('show');
                });
        }
    }

    self.selectedGroup.subscribe(function (data) {
        if (data != undefined) {
            self.groupSubjects([])
            self.ajax(self.baseURI + "/hazizz-server/subjects/group/" + data, 'GET', 'json')
                .done(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        self.groupSubjects.push({
                            id: data[i].id,
                            name: data[i].name
                        })
                    }
                })
                .fail(function (data) {
                    console.log(data);
                    if (data.responseJSON) {
                        self.errorTitle(data.responseJSON.title);
                        self.errorBody(data.responseJSON.message);
                    }else{
                        self.errorTitle(JSON.parse(data.responseText).title);
                        self.errorBody(JSON.parse(data.responseText).message);
                    }
                    $('#errorModal').modal('show');
                });
        }else{
            self.groupSubjects([])
        }
    })

    self.createSubject = function () {
        var data = {"name":self.newSubjectName()};
        self.ajax(self.baseURI + '/hazizz-server/subjects/group/' + self.headerGroup().id, 'POST', 'text', data)
            .done(function () {
                $('#newSubjectModal').modal('hide');
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
                $('#errorModal').modal('show');
            });
    }

    self.taskAnno.subscribe(function (data) {
        self.myTasks([]);
        self.myAnnouncements([]);
        if (data == 'task') {
            self.tasks(self.headerGroup())
        }else if (data == 'announcement'){
            self.announcements(self.headerGroup().id)
        }
    })

    self.createAnnouncement = function () {
        var data = {"announcementTitle":self.newAnnouncementTitle(),"description":self.newAnnouncementText()};
        self.ajax(self.baseURI + '/hazizz-server/announcements/groups/' + self.headerGroup().id, 'POST', 'text', data)
            .done(function () {
                self.announcements(self.headerGroup().id);
                $('#newAnnouncementModal').modal('hide');
            })
            .fail(function (data) {
                console.log(data);
                if (data.responseJSON) {
                    self.errorTitle(data.responseJSON.title);
                    self.errorBody(data.responseJSON.message);
                }else{
                    self.errorTitle(JSON.parse(data.responseText).title);
                    self.errorBody(JSON.parse(data.responseText).message);
                }
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
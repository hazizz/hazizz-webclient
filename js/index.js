function Index() {
    var self = this;
    if (Cookies.get('token')) {
        self.token = Cookies.get('token');
    } else {
        window.location.href = "login.html";
    }

    self.baseURI = 'https://hazizz.duckdns.org:9000/hazizz-server';

    self.user = ko.observable({});

    self.myGroups = ko.observableArray("");
    self.myTasks = ko.observableArray("");
    self.myAnnouncements = ko.observableArray("");

    self.newTaskTitle = ko.observable("");
    self.newTaskDescription = ko.observable("");
    self.newTaskDueDate = ko.observable(moment().add(1, 'd').format("YYYY-MM-DD"));
    self.selectedGroup = ko.observable("");
    self.selectedGroup.subscribe(function (data) {
        if (data != undefined) {
            self.groupSubjects([])
            self.ajax(self.baseURI + "/subjects/group/" + data, 'GET', 'json')
                .done(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        self.groupSubjects.push({
                            id: data[i].id,
                            name: data[i].name
                        })
                    }
                })
        } else {
            self.groupSubjects([])
        }
    })
    self.selectedTaskType = ko.observable("");
    self.taskTypes = ko.observableArray("");
    self.groupSubjects = ko.observableArray("");
    self.selectedSubject = ko.observable("");

    self.newAnnouncementTitle = ko.observable("");
    self.newAnnouncementText = ko.observable("");

    self.newSubjectName = ko.observable("");

    self.taskAnno = ko.observable("task");
    self.taskAnno.subscribe(function (data) {
        self.myTasks([]);
        self.myAnnouncements([]);
        if (data == 'task') {
            self.tasks(self.headerGroup())
        } else if (data == 'announcement') {
            self.announcements(self.headerGroup().id)
        }
    })

    self.commentBody = ko.observable("");
    self.comments = ko.observableArray("");
    self.replyIds = [];
    self.commentIds = [];

    self.currentItem = ko.observable("");
    self.headerItem = ko.observable("");

    self.newGroupName = ko.observable("");
    self.newGroupType = ko.observable("");
    self.newGroupPassword = ko.observable("");

    self.joinGroupName = ko.observable("");
    self.joinGroupPassword = ko.observable("");
    self.joinableGroups = ko.observableArray("");

    self.headerGroup = ko.observable("");
    self.fromGroup = ko.observable(false);

    self.dailyText = ko.observable("");

    self.errorTitle = ko.observable("");
    self.errorBody = ko.observable("");

    self.ajax = function (uri, method, type, data) {
        var counter = 0;
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            dataType: type,
            data: JSON.stringify(data),
            timeout: 3000,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + self.token);
            },
            error: function (xhr) {
                console.log(xhr);
                if (xhr.statusText == "timeout") {
                    counter++;
                    if (counter < 4) {
                        self.ajax(uri, method, type, data);
                    } else {
                        self.errorTitle("Nincs válasz");
                        self.errorBody("A szerver jelenleg nem válaszol. Kérlek póbáld meg később. Amennyiben nem javul meg jelezd nekünk.");
                        $('#errorModal').modal('show');
                        counter = 0;
                    }
                } else if (xhr.statusText == "abort") {
                    switch (xhr.responseJSON ? xhr.responseJSON.errorCode : JSON.parse(xhr.responseText).errorCode) {
                        //Server errors
                        case 1:
                        case 3:
                        case 16:
                        case 20:
                        case 30:
                        case 50:
                        case 59:
                        case 70:
                        case 73:
                        case 90:
                        case 110:
                        case 112:
                        case 120:
                        case 130:
                        case 134:
                        case 150:
                        case 152:
                            self.errorTitle("Nem megszokott hiba!");
                            self.errorBody("Ezt a hibát kérlek jelentsd amint tudod: " + xhr.responseJSON ? xhr.responseJSON.message : JSON.parse(xhr.responseText).message);
                            break;

                        //Client errors
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 135:
                            self.errorTitle("Klienshiba!");
                            self.errorBody("Kérlek jelentsd a hibát!");
                            break;

                        //Auth errors -> login.html
                        case 18:
                        case 21:
                        case 22:
                        case 23:
                            window.location.href = 'login.html';
                            break;

                        //Ratelimit
                        case 19:
                            self.ajax(uri, method, type, data).abort();
                            break;

                        case 2:
                            self.errorTitle("Helytelen adatok.");
                            self.errorBody("Kérlek ellenőrizd, hogy minden adatot megfelelően adtál-e meg. Amennyiben biztos vagy abban, hogy igen, jelentsd a hibát.");
                            break;

                        case 10:
                            self.errorTitle("Bejelentkezési hiba!");
                            self.errorBody("Kérlek próbáld újra. Ha a hiba továbbra is fent áll, jelentsd egy fejlesztőnek!");
                            break;
                        case 11:
                            self.errorTitle("Nincs jogosultságod!");
                            self.errorBody("Nincs jogosultságod ennek a műveletnek a végrehalytásához, hiányzó jogosultság: " +
                            xhr.responseJSON ? xhr.responseJSON.message.split(":")[1] : JSON.parse(xhr.responseText).message.split(":")[1]);
                            break;
                        case 12:
                            self.errorTitle("Nem megfelelő jelszó!");
                            self.errorBody("A megadott felhasználónév és jelszó nem egymáshoz tartozik, kérlek próbáld meg újra!")
                            break;
                        case 13:
                            self.errorTitle("Zárot fiók!");
                            self.errorBody("Sajnáljuk a te fiókod valamiért zárolásra került, nem használhatod. Ha úgy gondolod ez csak valami hiba, akkor kérlek jelezd ezt.");
                            break;
                        case 14:
                            self.errorTitle("Fiókod lejárt");
                            self.errorBody("Sajnáljuk, fiókod lejárt.");
                            break;
                        case 15:
                            self.errorTitle("Fiókod tiltva van.");
                            self.errorBody("Sajnáljuk, fiókodat tiltotanunk kellett. Amennyiben azt érzed, hogy ez csak egy hiba, kérlek jelezd ezt nekünk.");
                            break;
                        case 17:
                            self.errorTitle("Nem megfelelő felhasználónév vagy jelszó.");
                            self.errorBody("Kérlek próbálj meg újra bejelentkezni.");
                            break;

                        case 24:
                            self.errorTitle("Szerver nem elérhető.");
                            self.errorBody("A szerver jelen pillanatban nem elérhető, kérlek próbáld meg később.");
                            break;

                        case 31:
                            self.errorTitle("Nincs ilyen felhasználó");
                            self.errorBody("Nem találtunk ilyen nevű felhasználót a rendszerben.");
                            break;
                        case 32:
                            self.errorTitle("Fogalalt felhasználónév.");
                            self.errorBody("A megadott felhasználónév már fogalalt, kérlek válassz másikat.");
                            break;
                        case 33:
                            self.errorTitle("E-mail cím foglalt.");
                            self.errorBody("A megadott e-mail cím már létezik a rendszerben. Próbálj inkább bejelentkezni.");
                            break;
                        case 34:
                            self.errorTitle("Regisztráció elutasítva.");
                            self.errorBody("A regisztrációs lehetőség ideiglenesen nem elérhető. Kérlek próbáld meg később.");
                            break;
                        case 35:
                            self.errorTitle("Jogi hiba.");
                            self.errorBody("A regisztrációhoz el kell fogadnod az ÁSZF-et és az Adatkezelési nyilatkozatot.");
                            break;
                        case 36:
                            self.errorTitle("A név nem engedélyett");
                            self.errorBody("Nem tudtuk megváltoztatni a nevet, mivel nem elfogadható, kérlek próbálkozz másképp.");
                            break;

                        case 51:
                            self.errorTitle("Nem létező csoport.");
                            self.errorBody("A csoport, amit keresel nem létezik, előtte hozd létre.");
                            break;
                        case 52:
                            self.errorTitle("Fogalat név.");
                            self.errorBody("A csoportot nem tudtuk létrehozni, mivel a megadott név már használatban van, kérlek válasz neki másikat.");
                            break;
                        case 53:
                            self.errorTitle("Belépés megtagadva.");
                            self.errorBody("Ebbe a csoportba történő belépés nem engedélyezett számodra.");
                            break;
                        case 54:
                            self.errorTitle("Meghívás megtagadva.");
                            self.errorBody("Ehhez a csoporthoz nem lehet meghívókat készíteni.");
                            break;
                        case 55:
                            self.errorTitle("Már itt van.");
                            self.errorBody("Nem lehet egy csoporthoz, kétszer, ugyan azt a felhasználót hozzáadni.");
                            break;
                        case 56:
                            self.errorTitle("Nem megfelelő jelszó.");
                            self.errorBody("A csoporthoz megadott jelszó nem megfelelő, kérlek próbálkozz újra.");
                            break;
                        case 57:
                            self.errorTitle("Nem vagy tag");
                            self.errorBody("Nem vagy tagja a csoportnak, így nem nézhetsz bele.");
                            break;
                        case 58:
                            self.errorTitle("Adj meg egy jelszót.");
                            self.errorBody("A jelszó védett csoport létrehozásához a jelszó megadása is hozzá tartozik.");
                            break;

                        case 71:
                            self.errorTitle("Nincs ilyen.");
                            self.errorBody("A keresett bejegyzés nem található a szerveren.");
                            break;
                        case 72:
                            self.errorTitle("Nem megfelelő dátum.");
                            self.errorBody("Kérlek válassz egy másik dátumot, és ha a hiba továbbra is fent áll, jelezd.");
                            break;

                        case 91:
                            self.errorTitle("Nincs komment.");
                            self.errorBody("A kommentelési lehetőség le van tiltva.");
                            break;
                        case 92:
                            self.errorTitle("Nincs ilyen.");
                            self.errorBody("A keresett komment nem található.");
                            break;
                        case 93:
                            self.errorTitle("Csak egyszer!");
                            self.errorBody("Itt minden felhasználónak csak egy kommentje lehet.");
                            break;
                        case 94:
                            self.errorTitle("Nem szabad!");
                            self.errorBody("Csak a saját kommentedet szerkesztheted, másét nem.");
                            break;

                        case 111:
                            self.errorTitle("Nem létezik.");
                            self.errorBody("A keresett téma nem létezik.");
                            break;

                        case 121:
                            self.errorTitle("Nem megfelelő mérte.");
                            self.errorBody("A feltöltött kép mérete nem megfelelő, kérlek olvasd el figyelmesen a kritériumokat.");
                            break;
                        case 122:
                            self.errorTitle("Nem megfelelő formátum.");
                            self.errorBody("A kép formátuma nem megfelelő, kérlek olvasd el figyelmesen a kritériumokt.");
                            break;

                        case 131:
                            self.errorTitle("Nem megfelelő belépés.");
                            self.errorBody("Nem sikerült beléned az eKRÉTA felhasználódba, kérlek próbáld újra.");
                            break;

                        case 132:
                        case 136:
                            self.errorTitle("Lejárt munkamenet.");
                            self.errorBody("Kérlek jelentkezz be újra, munkameneted lejárt.");
                            break;

                        case 133:
                            self.errorTitle("Létező munkamenet.");
                            self.errorBody("Már van egy munkameneted, kérlek abba lépj be.");
                            break;

                        case 151:
                            self.errorTitle("Nem található.");
                            self.errorBody("A keresett bejegyzés nem található.");
                            break;

                        default:
                            if (xhr.responseJSON) {
                                self.errorTitle(xhr.responseJSON.title);
                                self.errorBody(xhr.responseJSON.message);
                            } else if (xhr.responseText) {
                                self.errorTitle(JSON.parse(xhr.responseText).title);
                                self.errorBody(JSON.parse(xhr.responseText).message);
                            }
                            break;
                    }
                    if (self.errorTitle() && self.errorBody()) {
                        $('#errorModal').modal('show');
                    }
                }
            }
        }
        return $.ajax(request);
    };

    //Supporting
    var setHeaderGroup = function (group) {
        self.headerGroup({
            id: group.id,
            name: group.name
        })
        self.ajax(self.baseURI + '/groups/' + group.id + '/details', 'GET', 'json')
            .done(function (data) {
                self.headerGroup({
                    id: data.id,
                    name: data.name,
                    users: data.users
                })
            })
    }

    //Gettings
    self.getAllGroups = function () {
        self.ajax(self.baseURI + '/me/groups', 'GET', 'json').done(function (data) {
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
            }
            ;
        })
    };
    self.getAllTasks = function () {
        self.ajax(self.baseURI + '/me/tasks', 'GET', 'json')
            .done(function (data) {
                self.myTasks([]);
                self.myAnnouncements([]);
                self.headerGroup("");
                self.fromGroup(false);
                ;
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
                    }
                    ;
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
                }
                self.myTasks.sort(function (a, b) {
                    return a.dateValue - b.dateValue;
                })
            })
    };
    self.getComments = function (item) {
        var from;
        if (self.taskAnno() == 'task') {
            from = 'tasks';
        } else {
            from = 'announcements';
        }
        self.currentItem(item);
        self.headerItem(item.title)
        self.comments([])
        self.ajax(self.baseURI + '/' + from + '/' + item.id + '/comments')
            .done(function (data) {
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
    };
    self.tasks = function (group) {
        self.headerGroup().id == group.id ? "" : setHeaderGroup(group);
        self.taskAnno("task");
        self.myAnnouncements([]);
        self.myTasks([]);
        self.ajax(self.baseURI + '/me/tasks/groups/' + group.id, 'GET', 'json')
            .done(function (data) {
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
    };
    self.announcements = function (groupId) {
        self.myAnnouncements([]);
        self.myTasks([]);
        self.ajax(self.baseURI + '/announcements/groups/' + groupId, 'GET', 'json')
            .done(function (data) {
                for (var i = 0; i < data.length; i++) {
                    self.myAnnouncements.push({
                        title: data[i].title,
                        text: data[i].description,
                        creatorName: data[i].creator.displayName,
                        id: data[i].id
                    })
                }
            })
    }
    self.searchGroup = function () {
        self.ajax(self.baseURI + '/groups', 'GET', 'json')
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
                    }
                    if (self.joinGroupName() == data[i].name) {
                        self.joinableGroups.push({
                            id: data[i].id,
                            name: data[i].name,
                            groupType: data[i].groupType,
                            userCount: data[i].userCount
                        });
                    }
                };
            })
    };
    self.prepareNewTask = function () {
        if (self.headerGroup()) {
            self.selectedGroup(self.headerGroup().id)
        }
        self.taskTypes([]);
        self.ajax(self.baseURI + '/tasks/types', 'GET', 'json')
            .done(function (data) {
                for (var i = 0; i < data.length; i++) {
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
                    }
                    ;
                    self.taskTypes.push({
                        name: data[i].name,
                        id: data[i].id
                    })
                }
            })
    }
    self.getAllUserData = function(){
        self.ajax(self.baseURI + "/me/details", 'GET', 'json').done(function (data) {
            self.user({
                id: ko.observable(data.id),
                username: ko.observable(data.username),
                displayName: ko.observable(data.displayName),
                email: ko.observable(data.emailAddress),
                memberTime: ko.observable(moment().diff(moment(data.registrationDate), 'days')),
                profile: ko.observable(),
            })
        })
        self.ajax(self.baseURI + "/me/picture/full", 'GET', 'json').done(function (data) {
            self.user().profile(data.data);
        })
    }

    //Creatings
    self.createGroup = function () {
        var data;
        if (self.newGroupType() == "PASSWORD") {
            data = {"groupName": self.newGroupName(), "type": self.newGroupType(), "password": self.newGroupPassword()};
        } else {
            data = {"groupName": self.newGroupName(), "type": self.newGroupType()};
        }
        $('#newGroupModal').modal('hide');
        self.ajax(self.baseURI + '/groups', 'POST', 'text', data)
            .done(function () {
                self.newGroupName("");
                self.getAllGroups();
            })
    };
    self.createTask = function () {
        var data = {
            "taskType": self.selectedTaskType(),
            "taskTitle": self.newTaskTitle(),
            "description": self.newTaskDescription(),
            "dueDate": self.newTaskDueDate()
        }
        $('#newTaskModal').modal('hide');
        if (self.selectedSubject()) {
            self.ajax(self.baseURI + "/tasks/subjects/" + self.selectedSubject(), 'POST', 'text', data)
                .done(function (data) {
                    self.getAllTasks();
                })
        } else if (self.selectedGroup()) {
            self.ajax(self.baseURI + "/tasks/groups/" + self.selectedGroup(), 'POST', 'text', data)
                .done(function (data) {
                    self.getAllTasks();
                })
        } else {
            self.ajax(self.baseURI + "/tasks/me", 'POST', 'text', data)
                .done(function (data) {
                    self.getAllTasks();
                })
        }
    }
    self.createSubject = function () {
        var data = {"name": self.newSubjectName()};
        $('#newSubjectModal').modal('hide');
        self.ajax(self.baseURI + '/subjects/group/' + self.headerGroup().id, 'POST', 'text', data);
    }
    self.sendComment = function () {
        var from;
        if (self.taskAnno() == 'task') {
            from = 'tasks';
        } else {
            from = 'announcements';
        }
        var data = {"content": self.commentBody()};
        self.ajax(self.baseURI + '/' + from + '/' + self.currentItem().id + '/comments', 'POST', 'text', data)
            .done(function (data) {
                self.getComments(self.currentItem());
                self.commentBody("");
            })
    };
    self.createAnnouncement = function () {
        var data = {"announcementTitle": self.newAnnouncementTitle(), "description": self.newAnnouncementText()};
        $('#newAnnouncementModal').modal('hide');
        self.ajax(self.baseURI + '/announcements/groups/' + self.headerGroup().id, 'POST', 'text', data)
            .done(function () {
                self.announcements(self.headerGroup().id);
            })
    }
    self.joinGroup = function (group) {
        $('#joinGroupModal').modal('hide');
        if (group.type == 'Jelszó védett') {
            self.ajax(self.baseURI + '/me/joingroup/' + group.id + '/' + self.joinGroupPassword(), 'GET', 'text')
                .done(function () {
                    self.getAllGroups();
                })
        } else {
            self.ajax(self.baseURI + '/me/joingroup/' + group.id, 'GET', 'text')
                .done(function () {
                    self.getAllGroups();
                })
        }
    };
    self.changeUserSettings = function () {
        $('#changeUserSettingsModal').modal('show');
    }

    //Daily message
    if (Cookies.get('daily') == undefined) {
        self.ajax(self.baseURI + '/information/motd', 'GET', 'json')
            .done(function (data) {
                self.dailyText(data);
                $('#dailyModal').modal('show');
            })
    }
    self.dailyClose = function () {
        Cookies.set('daily', 'true', {expire: 1});
    }

    self.getAllGroups();
    self.getAllTasks();
    self.getAllUserData();
};

ko.applyBindings(new Index(), $('#whole')[0]);

/* DEV */
function logout() {
    Cookies.remove('token');
    Cookies.remove('refresh');
    Cookies.remove('username');
    window.location.href = 'login.html';
}
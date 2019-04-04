function UserLogin() {
    var self = this;

    if (window.location.search.substring(1)) {
        var URLKeyValue = {};
        var URLSplitQuestion = window.location.search.substring(1).split('?');
        for (var i = 0; i < URLSplitQuestion.length; i++){
            var URLSplitAnd = URLSplitQuestion[i].split('&');
            for (var j = 0; j < URLSplitAnd.length; j++){
                var URLSplitEq = URLSplitAnd[j].split('=');
                URLKeyValue[URLSplitEq[0]] = URLSplitEq[1];
            }
        }
        if(URLKeyValue.registration == "success"){
            $('#regSuc').removeClass("d-none");
        }
    }

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
                if (xhr.statusText == "timeout" || JSON.parse(xhr.responseText).errorCode == 19) {
                    counter++;
                    if (counter < 4) {
                        setTimeout(function () {
                            self.ajax(uri, method, data);
                        }, 3000)
                    } else {
                        self.errorTitle("Nincs válasz");
                        self.errorBody("A szerver jelenleg nem válaszol. Kérlek póbáld meg később. Amennyiben nem javul meg jelezd nekünk.");
                        $('#errorModal').modal('show');
                        counter = 0;
                    }
                } else if (xhr.statusText != "abort") {
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
                        case 17:
                        case 18:
                        case 21:
                        case 22:
                        case 23:
                            window.location.href = 'login.html';
                            break;

                        //Ratelimit
                        case 19:
                            self.ajax(uri, method, type, data);
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

    if (Cookies.get('refresh') && Cookies.get('username')) {
        self.ajax(self.URI, 'POST', {"username": Cookies.get('username'), "refreshToken": Cookies.get('refresh')})
            .done(function (data) {
                Cookies.set('token', data.token, {expires: 1});
                Cookies.set('refresh', data.refresh, {expires: 7});

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
                    Cookies.set('token', data.token, {expires: 1});
                    Cookies.set('refresh', data.refresh, {expires: 7});
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
var $$ = Dom7;
var kontaktJson;

var app = new Framework7({
    root: '#app',
    name : 'my app',
    id: 'com.myapp.test',
    panel: {
     swipe: 'left',
    }
});

var hinweisToast = app.toast.create({
  text: 'Kontakt wurde angelegt.',
  closeButton: true,
});

function locationupdaten() {
    navigator.geolocation.getCurrentPosition(
        function (pos) {
            let card = document.getElementById("locationcard");
            card.innerText = "lat = " + pos.coords.latitude + " / " +
                "long = " + pos.coords.longitude;
        }
        ,
        function (err) {
            alert( err)
            console.log(err);
        }
    );
}

function bodyGeladen() {
    loadJSON();
}

function zeigeTab(name){
    for (let a of document.getElementsByClassName("Tab")){
        if(a.classList.contains(name))
            a.style.display = "block";
        else 
            a.style.display = "none";    
    }
}

window.addEventListener("load", loadevent => {
    let h = window.location.hash
    if (h != "") {
        zeigeTab(h.replace("#", ""))
    } else {
        zeigeTab("displayinitially")
    }
})

  function mySearchFunction() {
    let input, filter, ul, li, div, i, txtValue;
    input = document.getElementById('meinInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("meineUL");
    li = ul.getElementsByTagName('li');
    if (filter.length > 0){
        $$(".list-group-title").hide();
    }else {
        $$(".list-group-title").show();
        //Hinweis dass das Feld leer ist
        navigator.vibrate(1000);
    }
    for (i = 0; i < li.length; i++) {
      div = li[i].getElementsByClassName("kontaktname")[0];
      if (div != null){
        txtValue = div.textContent || div.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    }
  }

//Funktion um den bereich zur Erfassung der Kontaktdaten einzublenden

//Funktion um die Daten abzuspeichern, auch entnommen aus https://developer.mozilla.org/de/docs/Learn/JavaScript/Objects/JSON

function datenSpeichern(){
    //speichern der Inhalte in einer Variablen
    var txtValue = document.getElementById("nameDesKontaktes").value;
    for (var i in kontaktJson){
        if(kontaktJson[i].anfangsbuchstabe == txtValue.charAt(0).toUpperCase()){
            kontaktJson[i].name.push(txtValue);
        }
    }
    localStorage.setItem("kontaktJson", JSON.stringify(kontaktJson));  
    navigator.vibrate(500);
    document.getElementById("nameDesKontaktes").value = "";
    $$("#kontaktErstellen").hide();
    hinweisToast.open();
    kontakteLaden(kontaktJson);
}     


// Code um Inhalte aus der JSON zu laden, Bsp entnommen aus https://developer.mozilla.org/de/docs/Learn/JavaScript/Objects/JSON

function kontakteLaden(jsonObj) {
    var content = "";
    for (var i in jsonObj){
        if (jsonObj[i].name.length > 0){
            content = content + '<div class="list-group">';
            content = content + '<ul>';
            content = content + '<li class="list-group-title">'+jsonObj[i].anfangsbuchstabe+'</li>';
            for (var j in jsonObj[i].name){
                content = content + '<li>  <div class="item-content">';
                content = content + '<div class="item-inner">';
                content = content + '<div class="item-title kontaktname">'+jsonObj[i].name[j]+'</div>';
                content = content + '</div> </div> </li>';
            }
            content = content + '</ul> </div>';
        }
    }
    document.getElementById("meineUL").innerHTML = content;
}
  
  function loadJSON(){
    var initialisierenKontakte =  localStorage.getItem("kontaktJson");
    if(initialisierenKontakte == null){
      var request = new XMLHttpRequest();
      request.overrideMimeType("application/json");
      request.onreadystatechange = () => {
          if(request.readyState == 4 && request.status == 200){
              kontaktJson = JSON.parse(request.responseText);
              kontakteLaden(kontaktJson);
          }else if(request.readyState == 4 && request.status != 200){
              console.log('JSON konnte nicht geladen werden');
          }
      };
      request.open("GET", "./Kontakte.json", true);
      request.send(null);
    }else {
      kontaktJson = JSON.parse(initialisierenKontakte);
      kontakteLaden(kontaktJson);
    }  
}


function neuerKontakt(){
    if ( $$("#kontaktErstellen").css("display")=="none"){
        $$("#kontaktErstellen").show()
    }else {$$("#kontaktErstellen").hide()}
}

// dieses Plugin zur persistenten Datenspeicherung einbauen https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];
var calendarInline = app.calendar.create({
  containerEl: '#demo-calendar-inline-container',
  value: [new Date()],
  weekHeader: false,
  renderToolbar: function () {
    return '<div class="toolbar calendar-custom-toolbar no-shadow">' +
      '<div class="toolbar-inner">' +
        '<div class="left">' +
          '<a href="#" class="link icon-only"><i class="icon icon-back ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
        '</div>' +
        '<div class="center"></div>' +
        '<div class="right">' +
          '<a href="#" class="link icon-only"><i class="icon icon-forward ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
        '</div>' +
      '</div>' +
    '</div>';
  },
  on: {
    init: function (c) {
      $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] +', ' + c.currentYear);
      $$('.calendar-custom-toolbar .left .link').on('click', function () {
        calendarInline.prevMonth();
      });
      $$('.calendar-custom-toolbar .right .link').on('click', function () {
        calendarInline.nextMonth();
      });
    },
    monthYearChangeStart: function (c) {
      $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] +', ' + c.currentYear);
    }
  }
});

function locationupdaten() {
    navigator.geolocation.getCurrentPosition(
        function (pos) {
            let card = document.getElementById("locationcard");
            card.innerText = "lat = " + pos.coords.latitude +
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
    if(window.usingCordova){
        //native App
        console.log("in der nativen App")

    } else {
        //Browser
        console.log("im Browser")
        initApp();
    }
}
function initApp(){
    console.log("Staring framework7..")
    var app = new Framework7({
        root: '#app',
        name : 'my app',
        id: 'com.myapp.test',
        panel: {
         swipe: 'left',
        }
    });

    if(window.usingCordova){
       } else {
    }
}
document.addEventListener('deviceready', initApp, false);

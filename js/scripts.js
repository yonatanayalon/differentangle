var _this = this;
var core = (function () {
    var myModel = _this;
    var form = document.getElementById('lp-form');
    myModel.saveUser = function (params) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("this.responseText: ", this.responseText);
            }
        };
        xhttp.open("POST", "/api/users", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(params));
    };
    /**
     * Adds time to a date. Modelled after MySQL DATE_ADD function.
     * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
     * https://stackoverflow.com/a/1214753/18511
     *
     * @param date  Date to start with
     * @param interval  One of: year, quarter, month, week, day, hour, minute, second
     * @param units  Number of units of the given interval to add.
     */
    myModel.dateAdd = function (date, interval, units) {
        var ret = new Date(date); //don't change original date
        var checkRollover = function () { if (ret.getDate() != date.getDate())
            ret.setDate(0); };
        switch (interval.toLowerCase()) {
            case 'minute':
                ret.setTime(ret.getTime() + units * 60000);
                break;
            case 'second':
                ret.setTime(ret.getTime() + units * 1000);
                break;
            default:
                ret = undefined;
                break;
        }
        return ret;
    };
    myModel.setTimer = function () {
        // Set the date we're counting down to
        var countDownDate = _this.dateAdd(new Date(), 'minute', 0.1);
        // Update the count down every 1 second
        var x = setInterval(function () {
            // Get todays date and time
            var now = new Date().getTime();
            // Find the distance between now an the count down date
            var distance = countDownDate - now;
            // Time calculations for days, hours, minutes and seconds
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            // Display the result in the element with id="demo"
            document.getElementById('timer-minutes').innerHTML = minutes.toString();
            document.getElementById('timer-seconds').innerHTML = seconds.toString();
            function randomIntFromInterval(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }
            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                var percent = randomIntFromInterval(25, 35);
                document.getElementById('result-text').innerHTML += 'it seems that we can boost your page by ' + percent + '%';
                document.getElementById('scanner').classList.add('done');
            }
        }, 1000);
    };
    myModel.submitForm = function (ev) {
        ev.preventDefault();
        var landingPageUrl = document.getElementById('lpUrl').value;
        var email = document.getElementById('email').value;
        var fullName = document.getElementById('fullName').value;
        var phone = document.getElementById('phone').value;
        if (landingPageUrl !== '' && email !== '' && fullName !== '' && phone !== '') {
            myModel.saveUser({ 'landingPageUrl': landingPageUrl, 'email': email, 'fullName': fullName, 'phone': phone });
            var scannerClasses = document.getElementById('scanner').classList;
            document.getElementById('website-url').innerHTML = landingPageUrl;
            if (!scannerClasses.contains('active')) {
                var formClasses = form.classList;
                formClasses.add('disabled');
                scannerClasses.add('active');
                _this.setTimer();
            }
        }
    };
    return myModel;
})();

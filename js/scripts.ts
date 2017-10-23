var core = ( ()=> {
    var myModel = this;
    const form = document.getElementById('lp-form');

    /**
     * Adds time to a date. Modelled after MySQL DATE_ADD function.
     * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
     * https://stackoverflow.com/a/1214753/18511
     *
     * @param date  Date to start with
     * @param interval  One of: year, quarter, month, week, day, hour, minute, second
     * @param units  Number of units of the given interval to add.
     */
    myModel.dateAdd = (date, interval, units)=> {
        var ret = new Date(date); //don't change original date
        var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
        switch(interval.toLowerCase()) {
            case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
            case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
            case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
            case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
            case 'day'    :  ret.setDate(ret.getDate() + units);  break;
            case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
            case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
            case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
            default       :  ret = undefined;  break;
        }
        return ret;
    }

    myModel.setTimer = ()=> {
        // Set the date we're counting down to
        //var countDownDate = new Date("Jan 5, 2018 15:37:25").getTime();
        const countDownDate = this.dateAdd(new Date(), 'minute', 0.1);

        // Update the count down every 1 second
        const x = setInterval(function() {

            // Get todays date and time
            const now = new Date().getTime();

            // Find the distance between now an the count down date
            const distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result in the element with id="demo"
            document.getElementById('timer-minutes').innerHTML = minutes.toString();
            document.getElementById('timer-seconds').innerHTML = seconds.toString();

            function randomIntFromInterval(min,max)
            {
                return Math.floor(Math.random()*(max-min+1)+min);
            }

            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(x);
                let percent = randomIntFromInterval(25,35);
                document.getElementById('result-text').innerHTML += 'it seems that we can boost your page by ' + percent +'%';
                document.getElementById('scanner').classList.add('done');
            }
        }, 1000);
    }

    myModel.submitForm = (ev)=> {
        ev.preventDefault();
        var landingPage = document.getElementById('lpUrl').value;
        var email = document.getElementById('email').value;
        var fullName = document.getElementById('fullName').value;
        var phoneNumber = document.getElementById('phoneNumber').value;



        if (landingPage !== '' && email !== '' && fullName !== '' && phoneNumber !== '') {
            let scannerClasses = document.getElementById('scanner').classList;
            document.getElementById('website-url').innerHTML = landingPage;
            if (!scannerClasses.contains('active')) {
                let formClasses = form.classList;
                formClasses.add('disabled')
                scannerClasses.add('active');
                this.setTimer();

            }
        }
    };
    return myModel;
})();

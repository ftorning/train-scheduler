console.log("main.js loaded");

var trainTable = $("#train-table");
var trainFormSubmit = $("#add-train");
var trainName = $('#train-name');
var destinationName = $('#destination-name');
var startingTime = $('#starting-time');
var frequency = $('#frequency');

// Initialize Firebase
try {
    var config = firebaseConfig;
    firebase.initializeApp(config);
    db = firebase.database();
    console.log('Successfully initialized database');
} catch {
    console.log('Failed to initialize database');
}

// Go nuts
class Train {
    constructor(name, destination, starting_time, frequency) {
        this.name = name;
        this.destination = destination;
        this.starting_time = moment.utc(starting_time, 'HH:mm').format('HH:mm');
        this.frequency = parseInt(frequency);
        
    }
    
    setParseTime(time) {
        if (moment.utc(time, 'HH:mm').isValid()) {
            return moment.utc(time, 'HH:mm').format('HH:mm');
        } else {
            alert('Cannot parse train time');
        }
    }
            

    getNextArrivalTime() {
        var current_time = moment().format("HH:mm");
        var arrival_time = moment.utc(this.starting_time, 'HH:mm').add(this.frequency, 'm');
        while (arrival_time <= moment.utc(current_time, "HH:mm")) {
            arrival_time.add(this.frequency, 'm');
        }

        if (arrival_time.hour() > 24) {
            return this.starting_time;
        } else {
            return arrival_time.format('hh:mm A');
        }
    }

    getMinutesAway() {
        var current_time = moment().format("HH:mm");
        var nextArrival = moment.utc(this.getNextArrivalTime(), "hh:mm A");
        return moment.utc(nextArrival, "hh:mm A").diff(moment.utc(current_time, "HH:mm"), 'm')
    }

    addToTable() {
        var row = $('<tr>');
        var trainName = $('<td>').text(this.name);
        var destination = $('<td>').text(this.destination);
        var frequency = $('<td>').text(this.frequency);
        var nextArrival = $('<td>').text(this.getNextArrivalTime());
        var minutesAway = $('<td>').text(this.getMinutesAway());
        row.append([trainName, destination, frequency, nextArrival, minutesAway])
        trainTable.append(row);
    }

    commit() {
        db.ref('/train').push(this);
    }

}

db.ref('train').on("child_added", function(snapshot) {
    var record = snapshot.val()
    var train = new Train(record.name, record.destination, 
                        record.starting_time, record.frequency);
    train.addToTable();
});

setInterval(() => {
    trainTable.empty();
    db.ref('train').on('value', function(snapshot) {
        snapshot.forEach(function(data) {
            var record = data.val();
            var train = new Train(record.name, record.destination, 
                                  record.starting_time, record.frequency);
            train.addToTable();
        }) 
    });
  }, 10000);

trainFormSubmit.on("click", function(event){
    event.preventDefault();
    var counter = 0;
    $('input').each(function() {
        if ($(this).hasClass("invalid")) {
            counter++;
        }
    });
    if (counter === 0) {
        var name = $('#train-name').val();
        var destination = $('#destination-name').val();
        var starting_time = $('#starting-time').val();
        var frequency = $('#frequency').val();
        newTrain = new Train(name, destination, starting_time, frequency);
        trainTable.empty();
        newTrain.commit()
        $('input').each(function() {
            $(this).removeClass("valid");
            $(this).val('');
        });
    } else {
        alert(counter + ' fields were not formatted correctly');
    }
});

$('input').on('input', function() {
    console.log(this.id)
    switch(this.id) {
        case 'train-name':
            if (trainName.val().length > 1) {
                trainName.removeClass('invalid');
                trainName.addClass('valid');
            } else {
                trainName.removeClass('valid');
                trainName.addClass('invalid');
            }
            break;
        case 'destination-name':
            if (destinationName.val().length > 1) {
                destinationName.removeClass('invalid');
                destinationName.addClass('valid');
            } else {
                destinationName.removeClass('valid');
                destinationName.addClass('invalid');
            }
            break;
        case 'starting-time':
            if(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(startingTime.val())) {
                startingTime.removeClass('invalid');
                startingTime.addClass('valid');
            } else {
                startingTime.removeClass('valid');
                startingTime.addClass('invalid');
            }
            break;
        case 'frequency':
            if (!isNaN(parseInt(frequency.val()))) {
                frequency.removeClass('invalid');
                frequency.addClass('valid');
            } else {
                frequency.removeClass('valid');
                frequency.addClass('invalid');
            }
            break;
    }
    
})
    





console.log("main.js loaded");

var trainTable = $("#train-table");
var trainFormSubmit = $("#add-train");

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
        this.starting_time = this.setParseTime(starting_time);
        this.frequency = parseInt(frequency);
        
    }
    setParseTime(time) {
        try {
            return moment.utc(time, 'HH:mm').format('HH:mm');

        } catch {
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
    var name = $('#train-name').val();
    var destination = $('#destination-name').val();
    var starting_time = $('#starting-time').val();
    var frequency = $('#frequency').val();
    try {
        newTrain = new Train(name, destination, starting_time, frequency);
        newTrain.commit()
    } catch {
        alert('One or more fields were not formatted correctly');
    }
});




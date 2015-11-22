// Import the Modules installed to our server
var express = require('express');
var bodyParser = require('body-parser');

// Start the express web framework
var app = express();

// Configure app
app.use(bodyParser());

// Where the application will run
var port = process.env.PORT || 8080;

// Import Mongoose
var mongoose = require('mongoose');

// Connect to our database
mongoose.connect('mongodb://127.0.0.1/node-api');

// Start the Node Server
app.listen(port);
console.log('Magic happens on port ' + port);



// Defining the Router for our API
var Speaker = require('./server/models/speaker');

// Start the Router
var router = express.Router();

// A simple middleware to use for all Routes and Requests
router.use(function (req, res, next) {
	// Give some message on the console
	console.log('An action was performed by the server.');
	// Is it important to use the next() function, otherwise the Route stops here.
	next();
});

// Default message when access the API folder through the browser
router.get('/', function (req, res) {
	// Give some Hello there message
	res.json({ message: 'Hello SPA, the API is working!' });
});

router.route('/speakers')
	// Create a speaker when the method passed is POST
	.post(function (req, res) {
		// Create a new instance of the Speaker model
		var speaker = new Speaker();

		// Set the speakers properties (comes from the request)
		speaker.name        = req.body.name;
		speaker.compagny    = req.body.compagny;
		speaker.title       = req.body.title;
		speaker.description = req.body.description;
		speaker.picture     = req.body.picture;
		speaker.schedule    = req.body.schedule;

		// Save the data received
		speaker.save(function (err) {
			if (err)
				res.send(err);

			// Give some success message
			res.json({ message: 'speaker successfully created!' });
		});
	})
	// get all the speakers when a method passed is GET
	.get(function (req, res) {
		Speaker.find(function (err, speakers) {
			if (err)
				res.send(err);

			res.json(speakers);
		});
	});

// On accessing speaker Route by ID
router.route('/speakers/:speaker_id')
	// Get the speaker by ID
	.get(function (req, res) {
		Speaker.findById(req.params.speaker_id, function (err, speaker) {
			if (err)
				res.send(err);
				res.json(speaker);
		});
	})
	// Update the speaker by ID
	.put(function (req, res) {
		Speaker.findById(req.params.speaker_id, function(err, speaker) {
			if (err)
				res.send(err);

			// Set the speakers properties (comes from the request)
			speaker.name        = req.body.name;
			speaker.compagny    = req.body.compagny;
			speaker.title       = req.body.title;
			speaker.description = req.body.description;
			speaker.picture     = req.body.picture;
			speaker.schedule    = req.body.schedule;

			// Save the data received
			speaker.save(function (err) {
				if (err)
					res.send(err);

				// Give some success message
				res.json({ message: 'speaker successfully updated!' });
			});
		});
	})
	// Delete the speaker by ID
	.delete(function (req, res) {
		Speaker.remove({
			_id: req.params.speaker_id
		}, function (err, speaker) {
			if (err)
				res.send(err);

			// Give some success message
			res.json({ message: 'speaker successfully deleted!' });
		});
	});

// Register the route
app.use('/api', router);
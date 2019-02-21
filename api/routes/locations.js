const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Location = require('../models/location');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

router.get('/', (req, res, next) => {
	//Ovde specifiramo šta GET-ujemo
	Location.find()
		.select('_id name latitude longitude url')
		.exec()
		.then(docs => {
			//console.log("Database",docs);
			const response = {
				count: docs.length,
				locations: docs.map(doc => {
					return {
						_id: doc._id,
						name: doc.name,
						latitude: doc.latitude,
						longitude: doc.longitude,
						url: doc.url
						/*request: {
							type: 'GET',
							url: 'http://localhost:3000/locations/' + doc._id
						}*/
					}
				})
			}
			//if(docs.length >= 0) {
				res.status(200).json(response);
			/*} 
			else
			{
				res.status(404).json({
					message: 'No entries found'
				});
			}*/
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.post('/', (req, res, next) => {
	const location = new Location({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		url: req.body.url
	});
	location
		.save()
		.then(result => 
		{
			//console.log("Posted to database",result);
			res.status(201).json({
				message: 'Created location successfully',
				createdLocation: {
					_id: result._id,
					name: result.name,
					latitude: result.latitude,
					longitude: result.longitude,
					url: result.url
					/*request: {
						type: 'GET',
						url: "http://localhost:3000/locations/" + result._id
					}*/
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.static(500).json({
				error: err
			});
		});
		
	
});

router.get('/:locationId', (req, res, next) => {
	const id = req.params.locationId;
	Location.findById(id)
		.select('_id name latitude longitude url')
		.exec()
		.then(doc => {
			console.log("Got from database",doc);
			if(doc) 
			{
				res.status(200).json({
					location: doc,
					/*request: {
						type: 'GET',
						url: 'http://localhost:3000/locations/' + doc._id
					}*/
				});
			}
			else
			{
				res.status(404).json({message: 'No valid entry for provided ID'});
			}
			res.status(200).json(doc);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.patch('/:locationId', (req, res, next) => {
	const id = req.params.locationId
	const updateOps = {};
	for(const ops of req.body) {
		updateOps[ops.propName] = ops.value;
	}
	Location.update({_id: id}, { $set: updateOps })
	.exec()
	.then(result => {
		//console.log("Patched in database", result);
		res.status(200).json({
			message: 'Location updated',
			/*request: {
				type: 'GET',
				url: 'http://localhost:3000/locations/' + id
			}*/
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.delete('/:locationId', (req, res, next) => {
	const id = req.params.locationId
	Location.remove({_id: id})
		.exec()
		.then(result => {
			console.log("Deleted from database",doc);
			res.status(200).json({
				message: "Location deleted",
				name: doc.name
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			})
		});
});

module.exports = router;
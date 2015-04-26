var config = require('./config');
var AWS = require('aws-sdk');
var fs = require('fs');
var zlib = require('zlib');

/*
 * The following is taken directly from the AWS-SDK for JavaScript example
 * with a few modifications, namely the path/to/the/file to be uploaded,
 * the use of config parameters for settings, and the AWS S3 key name.
 */

/**
 * Don't hard-code your credentials!
 * Export the following environment variables instead:
 *
 * export AWS_ACCESS_KEY_ID='AKID'
 * export AWS_SECRET_ACCESS_KEY='SECRET'
 */

// Set your region for future requests.
AWS.config.region = config.awsregion;

// Create a bucket using bound parameters and put something in it.
// Make sure to change the bucket name from "myBucket" to something unique.
var s3bucket = new AWS.S3({params: {Bucket: config.awsbucketname}});

this.testBucket = function(args, cb) {
	s3bucket.createBucket(function() {
		var body = fs.createReadStream('./public/moar.jpg').pipe(zlib.createGzip());
		var params = {Key: 'testKey', Body: body};
		s3bucket.upload(params, function(err, data) {
			if (err) {
				console.log("Error uploading data: ", err);
				cb(err);
			} else {
				console.log("Successfully uploaded data to myBucket/myKey");
				cb(null, data);
			}
		});
	});
}

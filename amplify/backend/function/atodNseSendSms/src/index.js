/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_ATODNIKESOCCEREVENT_GRAPHQLAPIIDOUTPUT
	API_ATODNIKESOCCEREVENT_GRAPHQLAPIENDPOINTOUTPUT
	API_ATODNIKESOCCEREVENT_GRAPHQLAPIKEYOUTPUT
	STORAGE_ATODNIKESOCCERIMAGESTORAGE_BUCKETNAME
	API_KEY
	API_SECRET
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const axios = require("axios");
const uniqid = require("uniqid");
const crypto = require("crypto");
const cryptojs = require("crypto-js");
const Blob = require("node-blob");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event) => {
	console.log(event);
	try {
		event.Records.forEach(async (record) => {
			console.log(record);

			if (record.eventName === "INSERT") {
				const id = record.dynamodb.NewImage.id.S;
				const name = record.dynamodb.NewImage.name.S;
				const height = record.dynamodb.NewImage.height.S;

				const params = {
					Bucket: process.env
						.STORAGE_ATODNIKESOCCERIMAGESTORAGE_BUCKETNAME,
					Key: "public/barcode_frame.png",
				};

				// const imageURL = await s3.getSignedUrl("getObject", params);

				const imageObject = await Promise.all([
					s3.getObject(params).promise(),
				]);

				console.log(imageObject);

				// const blob = new Blob([imageObject.Body], {
				// 	type: imageObject.ContentType,
				// });

				// console.log(blob);

				const timestamp = Date.now();
				const salt = uniqid();

				const message = timestamp + salt; //전달할 샘플 메시지
				const key = process.env.API_SECRET; //암호화에 사용할 샘플 키값
				const signature = cryptojs.HmacMD5(message, key).toString();

				console.log("signature:" + signature);

				var file = require("fs").createWriteStream(
					"tmp/barcode_frame.png",
				);
				await s3.getObject(params).createReadStream().pipe(file);

				console.log(file);

				const apiResult = await axios({
					url: process.env.API_URL,
					method: "post",
					headers: {
						"Content-Type": "multipart/form-data",
					},
					data: {
						api_key: process.env.API_KEY,
						api_secret: process.env.API_SECRET,
						timestamp: timestamp,
						salt: salt,
						signature: signature,
						to: "01068505282",
						from: "01068505282",
						subject: "나이키풋볼이벤트테스트",
						text: "나이키풋볼이벤트테스트",
						type: "MMS",
						image: imageObject.Body,
						image_encoding: "base64",
					},
				})
					.then((reponse) => {
						console.log(reponse);
					})
					.catch((error) => {
						console.error(error);
					});
			}
		});
		// return Promise.resolve("Successfully processed DynamoDB record");
		return {
			statusCode: 200,
			body: JSON.stringify("Complete!!"),
		};
	} catch (err) {
		console.log("error Send SMS: ", err);

		return {
			statusCode: 200,
			body: JSON.stringify("Error!!"),
		};
	}
};

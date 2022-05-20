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
const cryptoJs = require("crypto-js");

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

				const imageObject = await Promise.all([
					s3.getObject(params).promise(),
				]);

				console.log(imageObject);

				// console.log("data:image/jpeg;base64," + encode(imageObject.Body))

				// const blob = new Blob([imageObject.Body], {
				// 	type: imageObject.ContentType,
				// });

				// console.log(blob);

				const salt = uniqid();
				const key = "NCS9AE5QNDFTRAVD";
				const datetime = new Date().toISOString();
				const message = datetime + salt;
				const secret = "6SK5S6RCLYSQGNOGAMQ3ERPN0EVT0POC";
				const signature = cryptoJs
					.HmacSHA256(message, secret)
					.toString();

				console.log("signature:" + signature);

				const apiResult = await axios({
					url: "http://api.coolsms.co.kr/messages/v4/send",
					method: "post",
					headers: {
						Authorization: `HMAC-SHA256 apiKey=${key}, date=${datetime}, salt=${salt}, signature=${signature}`,
						"Content-Type": "application/json",
					},
					data: {
						message: {
							to: "01068505282",
							from: "01068505282",
							subject: "나이키풋볼이벤트테스트",
							text: "나이키풋볼이벤트테스트",
							type: "MMS",
							imageId: "ST01FZ220520112152458qmTH1uzvH72",
						},
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

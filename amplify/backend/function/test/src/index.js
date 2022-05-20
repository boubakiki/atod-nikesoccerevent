/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_ATODNIKESOCCERIMAGESTORAGE_BUCKETNAME
Amplify Params - DO NOT EDIT */
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const axios = require("axios");
const uniqid = require("uniqid");
const cryptoJs = require("crypto-js");

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
	console.log(`EVENT: ${JSON.stringify(event)}`);

	// 파일 s3에서 불러오기
	const params = {
		Bucket: process.env.STORAGE_ATODNIKESOCCERIMAGESTORAGE_BUCKETNAME,
		Key: "public/barcode_frame.png",
	};

	const imageObject = await Promise.all([s3.getObject(params).promise()]);

	console.log(imageObject);

	console.log(imageObject[0].Body);
	console.log(imageObject[0].Body.toString("base64"));

	// coolsms에 파일 저장하기

	// const barcode = new File([imageObject.Body], "barcode.png", {
	// 	type: "image/png",
	// });

	// console.log(barcode);

	const salt = uniqid();
	const key = "NCS9AE5QNDFTRAVD";
	const datetime = new Date().toISOString();
	const message = datetime + salt;
	const secret = "6SK5S6RCLYSQGNOGAMQ3ERPN0EVT0POC";
	const signature = cryptoJs.HmacSHA256(message, secret).toString();

	await axios({
		url: "https://api.coolsms.co.kr/storage/v1/files",
		headers: {
			Authorization: `HMAC-SHA256 apiKey=${key}, date=${datetime}, salt=${salt}, signature=${signature}`,
			"Content-Type": "application/json",
		},
		method: "post",
		data: {
			file: imageObject[0].Body.toString("base64"),
			type: "MMS",
		},
	})
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});

	// 위에서 구한 파일id와 함께 MMS 전송하기

	return {
		statusCode: 200,
		//  Uncomment below to enable CORS requests
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "*",
		},
		body: JSON.stringify("Hello from Lambda!"),
	};
};

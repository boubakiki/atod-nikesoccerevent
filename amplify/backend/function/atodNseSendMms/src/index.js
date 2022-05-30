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
exports.handler = (event) => {
	console.log(`EVENT: ${JSON.stringify(event)}`);

	try {
		event.Records.forEach(async (record) => {
			console.log(record);

			if (record.eventName === "ObjectCreated:Put") {
				const storageKey = record.s3.object.key;
				const bucketName = record.s3.bucket.name;
				const phoneNumber = storageKey
					.replace("public/", "")
					.replace(".jpg", "");

				const params = {
					Bucket: bucketName,
					Key: storageKey,
				};

				const imageObject = await Promise.all([
					s3.getObject(params).promise(),
				]);

				console.log(imageObject);

				const salt = uniqid();
				const key = "NCS9AE5QNDFTRAVD";
				const datetime = new Date().toISOString();
				const message = datetime + salt;
				const secret = "6SK5S6RCLYSQGNOGAMQ3ERPN0EVT0POC";
				const signature = cryptoJs
					.HmacSHA256(message, secret)
					.toString();

				let fileId;

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
						fileId = res.data.fileId;
					})
					.catch((err) => {
						console.error(err);
					});

				await axios({
					url: "http://api.coolsms.co.kr/messages/v4/send",
					method: "post",
					headers: {
						Authorization: `HMAC-SHA256 apiKey=${key}, date=${datetime}, salt=${salt}, signature=${signature}`,
						"Content-Type": "application/json",
					},
					data: {
						message: {
							to: phoneNumber,
							from: "025757131",
							// subject: "나이키풋볼이벤트테스트",
							text: "[나이키 풋볼 스튜디오] 선수 등록이 완료되었습니다.",
							type: "MMS",
							imageId: fileId,
						},
					},
				})
					.then((res) => {
						console.log(res);
					})
					.catch((err) => {
						console.error(err);
					});
			}
		});
		return {
			statusCode: 200,
			body: JSON.stringify("Complete!!"),
		};
	} catch (err) {
		console.log("error Send MMS: ", err);

		return {
			statusCode: 200,
			body: JSON.stringify("Error!!"),
		};
	}
};

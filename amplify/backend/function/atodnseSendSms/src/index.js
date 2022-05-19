/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_ATODNIKESOCCEREVENT_GRAPHQLAPIIDOUTPUT
	API_ATODNIKESOCCEREVENT_GRAPHQLAPIENDPOINTOUTPUT
	API_ATODNIKESOCCEREVENT_GRAPHQLAPIKEYOUTPUT
	STORAGE_ATODNIKESOCCERIMAGESTORAGE_BUCKETNAME
	SMS_API_KEY
	END_URL
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const axios = require("axios");
const uniqid = require("uniqid");
const crypto = require("crypto");

exports.handler = async (event) => {
	console.log(event);
	try {
		event.Records.forEach(async (record) => {
			console.log(record);

			if (record.eventName === "INSERT") {
				const id = record.dynamodb.NewImage.id.S;
				const name = record.dynamodb.NewImage.name.S;
				const height = record.dynamodb.NewImage.height.S;

				console.log(id);

				const params = {
					Bucket: process.env
						.STORAGE_ATODNIKESOCCERIMAGESTORAGE_BUCKETNAME,
					Key: "public/barcode_frame.png",
				};

				const imageObject = await s3.getObject(params).promise();
				console.log("imageObject:%j", imageObject);

				const timestamp = Date.now();
				const salt = uniqid();

				const hmac = crypto.createHmac(
					"md5",
					process.env.SMS_API_SECRET,
				);
				const signature = hmac.update(timestamp + salt);

				console.log("signature:%j" + signature);

				const apiResult = await axios({
					url: process.env.END_URL,
					method: "post",
					// headers: {
					// 	"x-api-key": process.env.SMS_API_KEY,
					// },
					data: {
						api_key: process.env.SMS_API_KEY,
						api_secret: process.env.SMS_API_SECRET,
						timestamp: timestamp,
						salt: salt,
						signature: signature,
						to: "01071392171",
						from: "01068505282",
						subject: "나이키풋볼이벤트테스트",
						text: "나이키풋볼이벤트테스트",
						type: "MMS",
						image: "https://atodnikesoccerevent1614108569de4ac6b39e811b2477150448-dev.s3.ap-northeast-2.amazonaws.com/public/barcode_frame.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAY77NDVXX4TFKRRSN%2F20220519%2Fap-northeast-2%2Fs3%2Faws4_request&X-Amz-Date=20220519T145820Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBcaDmFwLW5vcnRoZWFzdC0yIkcwRQIgG%2Bt3HY6%2BH2MrC%2B4ZrBgJnBCWZtTdrqPXqMSmcyMw72cCIQDRkPzLqBmA2G%2Br5Rhzn5xhQMq63dRkqIsG5x7H1wrSpyrrBAjw%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDYxODQzNTY4NTg3MSIMPptlNTGMdHhtyttdKr8Ew4g8CK5Hezu50XnFO3TB9CiRBQQtxydtnkyNW41j9ugtyBscinCMqrU6uS8kj89Gv6iWMWyQi93Q6UwX1%2BTvgOZKyPSg%2BAqHFNTHvnO4ZfQlztefpigdljy1oanhF%2Fj4QS674OOVWUPq8tP9CSiG%2FzMBU%2FMSFCEDFfqjIHtOW3KmOVqQ%2BGRRfb4QXHsAmtUAx6JlDSH6lp8kkUiZeFNNAher9u2OssDRVUrkrqHXSylqraxkRczDDC8Pfyve77GfOB5CqtD63kP0zmFg1JaY9DFWntPxZrEEPqQRpKz3O7QWn0TtVbJ1af%2F5NDDj0q2UbCoE3AWJhiN7zL8SQmzpsUul1IXlQB%2BPHbDaEXR8F7T874jIEhkPbVtuGdWk%2BD2uKdla4rVlMhnvFHqCV%2FK6zYRo8z9B8dM01elRWWwBD1EZsa4Fd7PUkFuvLBvNN%2B5YG1VyiVrQGLSWuiZxAhxFmBxgbpCH0uVCn%2F%2BkciasbsralkJY3R6rA%2BDPZkKjPFUiEE0fSspBA%2FQ0ai5EXxIHX3UwFt8W7GH8bNU3rRO2WLQistOipZwEXqT2mNt2W7ty83cuMJRGuWJBZcwJUvmZ4zn1ErpcCXEF8Jnx4Orwx34xtqvSFUNPLNjMuQAx9EE%2FoizoYTmO5FBy7nceALzvKx0bpa2E8nFyFh9CGNsWgs5L0Dq%2BBPAHPff%2BfkxNQ18RBp%2BsKjTz1fhhuwgJNoiMGZAJa5HbCR1CrjPxtIE3vXsc00ogmOB5fXyedyp28j4wiraZlAY6hQKuPIyu4MaLb4cPrHSDm%2FOYAocH3RcO5pSr4Ko7JY4Nk%2FzfMXrz1Z1s1zcU5e2678RD%2Bw1GYYRC%2FDU%2Fno%2BSSra%2BJ6hfIoQFt%2ByXdFh1WyvL8A4C2vG0S0oyCajSLRWu%2FwCB3MGsuJNcfbSFBpjToheSAtQBOHiRd8jKFdj%2BPzQsMrK0FT7eOYcpXIWLcFvQI1yoS74HLjbU9AteKbyBfSGIoVgq2DMUBuN0WwZb8R5Tbk0ZCz1moCA%2FjbMURXbGRWrhOKXEU6io5LfXEn4y%2FEFpvntfvPsmCbRzF5FzR6preBzRNwrRMb5t9GzbkimJGxnQdVFwCtjKIHt34yfTq%2BpXw6oi1YU%3D&X-Amz-Signature=8959f4e378e104b5ff64d9f139aee1ce2172f1ee1705b933da0b73d68f617d0a&X-Amz-SignedHeaders=host",
					},
				});

				console.log(apiResult);
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

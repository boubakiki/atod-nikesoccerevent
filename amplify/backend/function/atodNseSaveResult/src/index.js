/* Amplify Params - DO NOT EDIT
	API_ATODNIKESOCCEREVENT_GRAPHQLAPIENDPOINTOUTPUT
	API_ATODNIKESOCCEREVENT_GRAPHQLAPIIDOUTPUT
	API_ATODNIKESOCCEREVENT_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const axios = require("axios");
const gql = require("graphql-tag");
const graphql = require("graphql");
const { print } = graphql;

const updateData = gql`
	mutation UpdateData(
		$input: UpdateDataInput!
		$condition: ModelDataConditionInput
	) {
		updateData(input: $input, condition: $condition) {
			id
			name
			height
			phoneNumber
			position
			hp
			pScore
			rScore
			sScore
			grade
			updatedAt
		}
	}
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
	console.log(`EVENT: ${JSON.stringify(event)}`);

	const inputData = JSON.parse(event.body);
	console.log(inputData);

	try {
		const updateResult = await axios({
			url: process.env.API_ATODNIKESOCCEREVENT_GRAPHQLAPIENDPOINTOUTPUT,
			method: "post",
			headers: {
				"x-api-key":
					process.env.API_ATODNIKESOCCEREVENT_GRAPHQLAPIKEYOUTPUT,
			},
			data: {
				query: print(updateData),
				variables: {
					input: inputData,
				},
			},
		});

		console.log(updateResult.data.data.updateData);

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify({
				updatedData: updateResult.data.data.updateData,
				message: "Success!",
			}),
		};
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify({ inputedData: inputData, message: "Fail!!" }),
		};
	}
};

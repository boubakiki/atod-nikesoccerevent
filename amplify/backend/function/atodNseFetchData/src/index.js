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

const getData = gql`
	query GetData($id: ID!) {
		getData(id: $id) {
			id
			order
			name
			firstName
			lastName
			phoneNumber
			position
		}
	}
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
	console.log(`EVENT: ${JSON.stringify(event)}`);

	const inputData = JSON.parse(decodeURIComponent(event.body));
	const id = inputData.id;

	try {
		const getResult = await axios({
			url: process.env.API_ATODNIKESOCCEREVENT_GRAPHQLAPIENDPOINTOUTPUT,
			method: "post",
			headers: {
				"x-api-key":
					process.env.API_ATODNIKESOCCEREVENT_GRAPHQLAPIKEYOUTPUT,
			},
			data: {
				query: print(getData),
				variables: {
					id: id,
				},
			},
		});

		// console.log(`Query Result: ${JSON.stringify(getResult.data)}`);

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "*",
			},
			body: JSON.stringify({
				getData: getResult.data.data.getData,
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
			body: JSON.stringify({
				inputedId: inputData.id,
				message: "Fail!!",
			}),
		};
	}
};

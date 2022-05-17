import React, { useEffect, useState } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createData } from "./graphql/mutations";
import { listDatas } from "./graphql/queries";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: "", barcode: "", score1: "" };

const App = () => {
	const [formState, setFormState] = useState(initialState);
	const [datas, setDatas] = useState([]);

	useEffect(() => {
		fetchDatas();
	}, []);

	function setInput(key, value) {
		setFormState({ ...formState, [key]: value });
	}

	async function fetchDatas() {
		try {
			const data = await API.graphql(graphqlOperation(listDatas));
			const datas = data.data.listDatas.items;
			setDatas(datas);
		} catch (err) {
			console.log("error fetching datas");
		}
	}

	async function addData() {
		try {
			if (!formState.name || !formState.score1) return;
			const data = { ...formState };
			setDatas([...datas, data]);
			setFormState(initialState);
			await API.graphql(graphqlOperation(createData, { input: data }));
		} catch (err) {
			console.log("error creating data:", err);
		}
	}

	return (
		<Authenticator>
			{({ signOut, user }) => (
				<div style={styles.container}>
					<h2>Amplify Datas</h2>
					<input
						onChange={(event) =>
							setInput("name", event.target.value)
						}
						style={styles.input}
						value={formState.name}
						placeholder="Name"
					/>
					<input
						onChange={(event) =>
							setInput("score1", event.target.value)
						}
						style={styles.input}
						value={formState.score1}
						placeholder="score1"
					/>
					<button style={styles.button} onClick={addData}>
						Create Data
					</button>
					{datas.map((data, index) => (
						<div
							key={data.id ? data.id : index}
							style={styles.data}
						>
							<p style={styles.dataName}>{data.name}</p>
							<p style={styles.dataScore1}>{data.score1}</p>
						</div>
					))}
				</div>
			)}
		</Authenticator>
	);
};

const styles = {
	container: {
		width: 400,
		margin: "0 auto",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		padding: 20,
	},
	data: { marginBottom: 15 },
	input: {
		border: "none",
		backgroundColor: "#ddd",
		marginBottom: 10,
		padding: 8,
		fontSize: 18,
	},
	dataName: { fontSize: 20, fontWeight: "bold" },
	dataScore1: { marginBottom: 0 },
	button: {
		backgroundColor: "black",
		color: "white",
		outline: "none",
		fontSize: 18,
		padding: "12px 0px",
	},
};

export default App;

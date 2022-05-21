import React, { useEffect, useState, useRef } from "react";
import Amplify, { Storage, API, graphqlOperation } from "aws-amplify";
import { createData } from "./graphql/mutations";
import { listDatas } from "./graphql/queries";

import ReactDOM from "react-dom";
import QRCode from "react-qr-code";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

import domtoimage from "dom-to-image";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = {
	name: "",
	height: "",
	phoneNumber: "",
	position: "",
	hp: "",
	pScore: "",
	rScore: "",
	sScore: "",
	grade: "",
};

const App = () => {
	const qrRef = useRef();

	const [formState, setFormState] = useState(initialState);
	const [datas, setDatas] = useState([]);

	const [id, setId] = useState("init");

	useEffect(() => {
		fetchDatas();
	}, []);

	useEffect(() => {
		if (id !== "init") {
			console.log(formState);
			const storageKey = formState.phoneNumber + ".jpg";

			const qr = qrRef.current;

			domtoimage.toJpeg(qr).then(async function (dataUrl) {
				var arr = dataUrl.split(","),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);

				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}

				const result = await Storage.put(
					storageKey,
					new File([u8arr], storageKey, { type: mime }),
					{
						contentType: "image/jpeg",
					},
				);

				console.log(result);
			});
		}
	}, [id]);

	function setInput(key, value) {
		setFormState({ ...formState, [key]: value });

		console.log({ ...formState, [key]: value });
	}

	async function fetchDatas() {
		// try {
		// 	const data = await API.graphql(graphqlOperation(listDatas));
		// 	const datas = data.data.listDatas.items;
		// 	setDatas(datas);
		// } catch (err) {
		// 	console.log("error fetching datas:", err);
		// }
	}

	async function addData() {
		try {
			if (!formState.name || !formState.height || !formState.phoneNumber)
				return;
			const data = { ...formState };

			setDatas([...datas, data]);

			const saveResult = await API.graphql(
				graphqlOperation(createData, { input: data }),
			);

			setId(saveResult.data.createData.id);
		} catch (err) {
			console.log("error creating data:", err);
		}
	}

	return (
		<>
			<div
				ref={qrRef}
				style={{
					position: "fixed",
					// top: "1000px",
					width: "546px",
					height: "962px",
					backgroundImage: "url(img/frame.jpg)",
					zIndex: -15,
				}}
			>
				<QRCode
					value={id}
					size={340}
					style={{
						position: "absolute",
						left: "100px",
						top: "275px",
					}}
				/>
			</div>
			{/* <Authenticator>
				{({ signOut, user }) => ( */}
			<div style={styles.container}>
				<h2>Amplify Datas</h2>
				<input
					onChange={(event) => setInput("name", event.target.value)}
					style={styles.input}
					value={formState.name}
					placeholder="Name"
				/>
				<input
					onChange={(event) => setInput("height", event.target.value)}
					style={styles.input}
					value={formState.height}
					placeholder="height"
				/>
				<input
					onChange={(event) =>
						setInput("phoneNumber", event.target.value)
					}
					style={styles.input}
					value={formState.phoneNumber}
					placeholder="phoneNumber"
				/>
				<button style={styles.button} onClick={addData}>
					Create Data
				</button>
				{datas.map((data, index) => (
					<div key={data.id ? data.id : index} style={styles.data}>
						<p style={styles.dataName}>{data.name}</p>
						<p style={styles.dataHeight}>{data.height}</p>
					</div>
				))}
			</div>
			{/* )}
			</Authenticator> */}
		</>
	);
};

const styles = {
	container: {
		width: 400,
		margin: "0 auto",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		// padding: 20,
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

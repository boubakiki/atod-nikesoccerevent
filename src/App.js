import React, { useEffect, useState } from "react";
import Amplify, { Storage, API, graphqlOperation } from "aws-amplify";
import { createData } from "./graphql/mutations";
import { listDatas } from "./graphql/queries";

import axios from "axios";
import uniqid from "uniqid";
import cryptoJs from "crypto-js";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: "", height: "" };

const App = () => {
	const [formState, setFormState] = useState(initialState);
	const [datas, setDatas] = useState([]);
	const [file, setFile] = useState([]);

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
			console.log("error fetching datas:", err);
		}
	}

	async function addData() {
		try {
			if (!formState.name || !formState.height) return;
			const data = { ...formState };
			setDatas([...datas, data]);
			setFormState(initialState);
			await API.graphql(graphqlOperation(createData, { input: data }));
		} catch (err) {
			console.log("error creating data:", err);
		}
	}

	const handleUpload = (e) => {
		e.preventDefault();
		const file = e.target.files[0];
		console.log(file);
		console.log(typeof file);
		setFile(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();

		const frame = await Storage.get("barcode_frame.png", {
			download: true,
		});

		const barcode = new File([frame.Body], "barcode.png", {
			type: "image/png",
		});

		const timestamp = Date.now();
		const salt = uniqid();
		const key = "NCS9AE5QNDFTRAVD";
		const datetime = new Date().toISOString();
		const message = datetime + salt; //전달할 샘플 메시지
		const secret = "6SK5S6RCLYSQGNOGAMQ3ERPN0EVT0POC"; //암호화에 사용할 샘플 키값
		console.log(secret);
		const signature = cryptoJs.HmacSHA256(message, secret).toString();

		formData.set("image", barcode);
		formData.set("api_key", key);
		formData.set("api_secret", secret);
		formData.set("timestamp", timestamp);
		formData.set("salt", salt);
		formData.set("signature", signature);
		formData.set("to", "01068505282");
		formData.set("from", "01068505282");
		formData.set("subject", "나이키풋볼이벤트테스트");
		formData.set("text", "나이키풋볼이벤트테스트");
		formData.set("type", "MMS");
		formData.set("image", barcode);

		await axios
			.post(
				"https://api.coolsms.co.kr/storage/v1/files",
				{ file: frame.Body },
				{
					headers: {
						Authorization: `HMAC-SHA256 apiKey=${key}, date=${datetime}, salt=${salt}, signature=${signature}`,
						"Content-Type": "application/json",
					},
				},
			)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});

		// 저장
	};

	return (
		<>
			<form
				name="photo"
				encType="multipart/form-data"
				// onSubmit={handleSubmit}
				// id="loginForm"
			>
				<input
					type="file"
					name="photo"
					accept="image/*,"
					onChange={handleUpload}
				/>
			</form>
			<button type="submit" onClick={handleSubmit}>
				제출하기
			</button>
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
								setInput("height", event.target.value)
							}
							style={styles.input}
							value={formState.height}
							placeholder="height"
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
								<p style={styles.dataHeight}>{data.height}</p>
							</div>
						))}
					</div>
				)}
			</Authenticator>
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

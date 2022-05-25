import React, { useEffect, useState, useRef } from "react";
import Amplify, { Storage, API, graphqlOperation } from "aws-amplify";
import { createData } from "./graphql/mutations";
// import { listDatas } from "./graphql/queries";

import bwipjs from "bwip-js";
import { v4 as uuid } from "uuid";

import "./css/default.css";

import domtoimage from "dom-to-image";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = {
	id: "",
	name: "",
	firstName: "",
	lastName: "",
	phoneNumber: "",
	position: "",
	pScore: "",
	rScore: "",
	sScore: "",
	tScore: "",
};

const App = () => {
	const qrRef = useRef();

	const [formState, setFormState] = useState(initialState);
	const [datas, setDatas] = useState([]);

	useEffect(() => {
		fetchDatas();
	}, []);

	function setInput(key, value) {
		setFormState({ ...formState, [key]: value });
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

	async function submit() {
		try {
			if (
				!formState.name ||
				!formState.firstName ||
				!formState.lastName ||
				!formState.phoneNumber
			)
				return;

			const uniqueID = uuid();
			const shortID = uniqueID.slice(0, 4) + "-" + uniqueID.slice(4, 13);

			let canvas = bwipjs.toCanvas("barcode", {
				bcid: "code128", // Barcode type
				text: shortID,
				scale: 1, // 3x scaling factor
				height: 15, // Bar height, in millimeters
				includetext: true, // Show human-readable text
				textxalign: "center", // Always good to set this
				textsize: 15,
				paddingheight: 10,
				// rotate: "R",
			});

			const data = { ...formState, id: shortID };

			console.log(formState);

			setDatas([...datas, data]);

			const saveResult = await API.graphql(
				graphqlOperation(createData, { input: data }),
			);

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
					width: "250px",
					height: "339px",
					backgroundImage: "url(img/barcode_frame.jpg)",
					backgroundSize: "cover",
					zIndex: -15,
				}}
			>
				<div
					style={{
						position: "absolute",
						left: "30px",
						top: "255px",
					}}
				>
					<canvas
						id="barcode"
						style={{
							position: "absolute",
							// width: "200px",
						}}
					></canvas>
				</div>
			</div>
			<div>
				<h2>Datas</h2>
				<input
					onChange={(event) => setInput("name", event.target.value)}
					value={formState.name}
					placeholder="name"
				/>
				<input
					onChange={(event) =>
						setInput("firstName", event.target.value)
					}
					value={formState.firstName}
					placeholder="firstName"
				/>
				<input
					onChange={(event) =>
						setInput("lastName", event.target.value)
					}
					value={formState.lastName}
					placeholder="lastName"
				/>
				<input
					onChange={(event) =>
						setInput("phoneNumber", event.target.value)
					}
					value={formState.phoneNumber}
					placeholder="phoneNumber"
				/>
				<button onClick={submit}>제출</button>
				{datas.map((data, index) => (
					<div key={data.id ? data.id : index}>
						<p>{data.name}</p>
						<p>{data.height}</p>
					</div>
				))}
			</div>
		</>
	);
};;

// const styles = {
// 	container: {
// 		width: 400,
// 		margin: "0 auto",
// 		display: "flex",
// 		flexDirection: "column",
// 		justifyContent: "center",
// 		// padding: 20,
// 	},
// 	data: { marginBottom: 15 },
// 	input: {
// 		border: "none",
// 		backgroundColor: "#ddd",
// 		marginBottom: 10,
// 		padding: 8,
// 		fontSize: 18,
// 	},
// 	dataName: { fontSize: 20, fontWeight: "bold" },
// 	dataScore1: { marginBottom: 0 },
// 	button: {
// 		backgroundColor: "black",
// 		color: "white",
// 		outline: "none",
// 		fontSize: 18,
// 		padding: "12px 0px",
// 	},
// };

export default App;

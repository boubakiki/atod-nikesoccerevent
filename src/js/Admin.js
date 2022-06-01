import { CSVLink } from "react-csv";

import { API, graphqlOperation } from "aws-amplify";

import React, { useEffect, useState, useRef } from "react";

import toast, { Toaster } from "react-hot-toast";

import { updateData } from "../graphql/mutations";
import { datasByDate } from "../graphql/queries";
import { onCreateData, onUpdateData } from "../graphql/subscriptions";

import {
	AmplifyAuthenticator,
	AmplifySignIn,
	AmplifySignOut,
	AmplifyContainer,
} from "@aws-amplify/ui-react";

const initialStates = [
	{
		id: "",
		order: 0,
		name: "",
		firstName: "",
		lastName: "",
		position: "",
		pScore: "",
		rScore: "",
		sScore: "",
		tScore: "",
		createdAt: "",
		updatedAt: "",
		pickUp: "N",
	},
];

const headers = [
	{ label: "바코드", key: "id" },
	{ label: "순서", key: "order" },
	{ label: "포지션", key: "position" },
	{ label: "이름", key: "name" },
	{ label: "전화번호", key: "phoneNumber" },
	{ label: "영어 성", key: "lastName" },
	{ label: "영어 이름", key: "firstName" },
	{ label: "SPEED", key: "rScore" },
	{ label: "PASS", key: "pScore" },
	{ label: "SHOOT", key: "sScore" },
	{ label: "TOTAL", key: "tScore" },
	{ label: "등록시간", key: "createdAt" },
	{ label: "최근변경시간", key: "updatedAt" },
	{ label: "카드수령", key: "pickUp" },
];

const Admin = (props) => {
	const nameInputRefs = useRef({});
	const lastNameInputRefs = useRef({});
	const firstNameInputRefs = useRef({});
	const rScoreInputRefs = useRef({});
	const pScoreInputRefs = useRef({});
	const sScoreInputRefs = useRef({});
	const tScoreInputRefs = useRef({});
	const pickUpInputRefs = useRef({});

	const nameBtnRefs = useRef({});
	const lastNameBtnRefs = useRef({});
	const firstNameBtnRefs = useRef({});
	const rScoreBtnRefs = useRef({});
	const pScoreBtnRefs = useRef({});
	const sScoreBtnRefs = useRef({});
	const tScoreBtnRefs = useRef({});
	const pickUpBtnRefs = useRef({});

	const csvLink = useRef();

	const [datas, setDatas] = useState(initialStates);
	const [csvDatas, setCsvDatas] = useState([]);

	const [formState, setFormState] = useState({});

	useEffect(() => {
		fetchDatas();

		API.graphql(graphqlOperation(onCreateData)).subscribe({
			next: (evt) => {
				const data = evt.value.data.onCreateData;
				fetchDatas();
			},
		});

		API.graphql(graphqlOperation(onUpdateData)).subscribe({
			next: (evt) => {
				// const data = evt.value.data.OnUpdateData;
				fetchDatas();
			},
		});
	}, []);

	async function fetchDatas() {
		const fechedDatas = await API.graphql({
			query: datasByDate,
			variables: {
				limit: 100,
				type: "Data",
				sortDirection: "DESC",
			},
		});

		setDatas(fechedDatas.data.datasByDate.items);
	}

	async function fetchDownloadList() {
		let fechedDatas = await API.graphql({
			query: datasByDate,
			variables: {
				type: "Data",
				sortDirection: "DESC",
			},
		});

		let resultList = [...fechedDatas.data.datasByDate.items];

		setCsvDatas(
			resultList.map((data) => ({
				...data,
				createdAt: new Date(data.createdAt),
				updatedAt: new Date(data.updatedAt),
			})),
		);

		let nextToken = fechedDatas.data.datasByDate.nextToken;
		while (nextToken) {
			fechedDatas = await API.graphql({
				query: datasByDate,
				variables: {
					type: "Data",
					sortDirection: "DESC",
					nextToken: nextToken,
				},
			});

			resultList = [...resultList, ...fechedDatas.data.datasByDate.items];
			setCsvDatas(
				resultList.map((data) => ({
					...data,
					createdAt: new Date(data.createdAt),
					updatedAt: new Date(data.updatedAt),
				})),
			);

			nextToken = fechedDatas.data.datasByDate.nextToken;
		}

		csvLink.current.link.click();
	}

	function changeFormState(id, key, value) {
		if (
			formState.id &&
			(formState.id !== id || formState.valueType !== key)
		) {
			if (formState.valueType === "name") {
				nameBtnRefs.current[formState.id].style.display = "none";

				nameInputRefs.current[formState.id].value =
					nameInputRefs.current[formState.id].name;
			} else if (formState.valueType === "lastName") {
				lastNameBtnRefs.current[formState.id].style.display = "none";

				lastNameInputRefs.current[formState.id].value =
					lastNameInputRefs.current[formState.id].name;
			} else if (formState.valueType === "firstName") {
				firstNameBtnRefs.current[formState.id].style.display = "none";

				firstNameInputRefs.current[formState.id].value =
					firstNameInputRefs.current[formState.id].name;
			} else if (formState.valueType === "pScore") {
				pScoreBtnRefs.current[formState.id].style.display = "none";

				pScoreInputRefs.current[formState.id].value =
					pScoreInputRefs.current[formState.id].name;
			} else if (formState.valueType === "rScore") {
				rScoreBtnRefs.current[formState.id].style.display = "none";

				rScoreInputRefs.current[formState.id].value =
					rScoreInputRefs.current[formState.id].name;
			} else if (formState.valueType === "sScore") {
				sScoreBtnRefs.current[formState.id].style.display = "none";

				sScoreInputRefs.current[formState.id].value =
					sScoreInputRefs.current[formState.id].name;
			} else if (formState.valueType === "tScore") {
				tScoreBtnRefs.current[formState.id].style.display = "none";

				tScoreInputRefs.current[formState.id].value =
					tScoreInputRefs.current[formState.id].name;
			} else if (formState.valueType === "pickUp") {
				pickUpBtnRefs.current[formState.id].style.display = "none";

				pickUpInputRefs.current[formState.id].value =
					pickUpInputRefs.current[formState.id].name;
			}
		}

		setFormState({ id: id, [key]: value, valueType: key });

		if (key === "name") {
			nameBtnRefs.current[id].style.display = "inline-block";
		} else if (key === "lastName") {
			lastNameBtnRefs.current[id].style.display = "inline-block";
		} else if (key === "firstName") {
			firstNameBtnRefs.current[id].style.display = "inline-block";
		} else if (key === "pScore") {
			pScoreBtnRefs.current[id].style.display = "inline-block";
		} else if (key === "rScore") {
			rScoreBtnRefs.current[id].style.display = "inline-block";
		} else if (key === "sScore") {
			sScoreBtnRefs.current[id].style.display = "inline-block";
		} else if (key === "tScore") {
			tScoreBtnRefs.current[id].style.display = "inline-block";
		} else if (key === "pickUp") {
			pickUpBtnRefs.current[id].style.display = "inline-block";
		} else {
			alert(
				"수정 중 오류가 발생했습니다. 동일한 문제가 발생할 경우 관리자에게 문의바랍니다.",
			);
		}
	}

	async function update(id, key) {
		try {
			delete formState.valueType;

			await API.graphql({
				query: updateData,
				variables: {
					input: formState,
				},
			});

			if (key === "name") {
				nameBtnRefs.current[id].style.display = "none";
			} else if (key === "lastName") {
				lastNameBtnRefs.current[id].style.display = "none";
			} else if (key === "firstName") {
				firstNameBtnRefs.current[id].style.display = "none";
			} else if (key === "pScore") {
				pScoreBtnRefs.current[id].style.display = "none";
			} else if (key === "rScore") {
				rScoreBtnRefs.current[id].style.display = "none";
			} else if (key === "sScore") {
				sScoreBtnRefs.current[id].style.display = "none";
			} else if (key === "tScore") {
				tScoreBtnRefs.current[id].style.display = "none";
			} else if (key === "pickUp") {
				pickUpBtnRefs.current[id].style.display = "none";
			}

			notify();
		} catch (error) {
			alert(
				"문제가 발생하였습니다. 올바른 값을 입력했는지 확인해주세요.",
			);

			console.error(error);

			if (key === "name") {
				nameBtnRefs.current[id].style.display = "none";
			} else if (key === "lastName") {
				lastNameBtnRefs.current[id].style.display = "none";
			} else if (key === "firstName") {
				firstNameBtnRefs.current[id].style.display = "none";
			} else if (key === "pScore") {
				pScoreBtnRefs.current[id].style.display = "none";
			} else if (key === "rScore") {
				rScoreBtnRefs.current[id].style.display = "none";
			} else if (key === "sScore") {
				sScoreBtnRefs.current[id].style.display = "none";
			} else if (key === "tScore") {
				tScoreBtnRefs.current[id].style.display = "none";
			} else if (key === "pickUp") {
				pickUpBtnRefs.current[id].style.display = "none";
			}
		}
	}

	const notify = () => toast("값이 수정되었습니다.");

	return (
		<AmplifyContainer>
			<AmplifyAuthenticator>
				<AmplifySignIn slot="sign-in" hideSignUp></AmplifySignIn>
				<div>
					<h1>NIKE FOOTBALL STUDIO ADMIN</h1>
					<div className="csv_link">
						<button onClick={fetchDownloadList}>
							전체 방문자 목록 다운로드
						</button>
						<CSVLink
							ref={csvLink}
							data={csvDatas}
							headers={headers}
							filename={`전체 방문자 목록_${new Date().getFullYear()}_${
								new Date().getMonth() + 1
							}_${new Date().getDate()}`}
						></CSVLink>
					</div>
					<table>
						<thead>
							<tr>
								{headers
									.filter((col) => col.key !== "phoneNumber")
									.map((col) => (
										<th key={col.key}>{col.label}</th>
									))}
							</tr>
						</thead>
						<tbody>
							{datas.map((row) => (
								<tr key={row.id}>
									<td style={{ textAlign: "center" }}>
										{row.id}
									</td>
									<td style={{ textAlign: "center" }}>
										{row.order}
									</td>
									<td style={{ textAlign: "center" }}>
										{row.position}
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											defaultValue={row.name}
											name={row.name}
											ref={(ref) =>
												(nameInputRefs.current[row.id] =
													ref)
											}
											onChange={(event) =>
												changeFormState(
													row.id,
													"name",
													event.target.value,
												)
											}
										></input>
										<button
											className="btn_update"
											ref={(ref) =>
												(nameBtnRefs.current[row.id] =
													ref)
											}
											onClick={(event) =>
												update(row.id, "name")
											}
											style={{ display: "none" }}
										>
											수정
										</button>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											defaultValue={row.lastName}
											name={row.lastName}
											ref={(ref) =>
												(lastNameInputRefs.current[
													row.id
												] = ref)
											}
											onChange={(event) =>
												changeFormState(
													row.id,
													"lastName",
													event.target.value,
												)
											}
										></input>
										<button
											className="btn_update"
											ref={(ref) =>
												(lastNameBtnRefs.current[
													row.id
												] = ref)
											}
											onClick={(event) =>
												update(row.id, "lastName")
											}
											style={{ display: "none" }}
										>
											수정
										</button>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											defaultValue={row.firstName}
											name={row.firstName}
											ref={(ref) =>
												(firstNameInputRefs.current[
													row.id
												] = ref)
											}
											onChange={(event) =>
												changeFormState(
													row.id,
													"firstName",
													event.target.value,
												)
											}
										></input>
										<button
											className="btn_update"
											ref={(ref) =>
												(firstNameBtnRefs.current[
													row.id
												] = ref)
											}
											onClick={(event) =>
												update(row.id, "firstName")
											}
											style={{ display: "none" }}
										>
											수정
										</button>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											defaultValue={row.rScore}
											name={row.rScore}
											ref={(ref) =>
												(rScoreInputRefs.current[
													row.id
												] = ref)
											}
											onChange={(event) =>
												changeFormState(
													row.id,
													"rScore",
													event.target.value,
												)
											}
										></input>
										<button
											className="btn_update"
											ref={(ref) =>
												(rScoreBtnRefs.current[row.id] =
													ref)
											}
											onClick={(event) =>
												update(row.id, "rScore")
											}
											style={{ display: "none" }}
										>
											수정
										</button>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											defaultValue={row.pScore}
											name={row.pScore}
											ref={(ref) =>
												(pScoreInputRefs.current[
													row.id
												] = ref)
											}
											onChange={(event) =>
												changeFormState(
													row.id,
													"pScore",
													event.target.value,
												)
											}
										></input>
										<button
											className="btn_update"
											ref={(ref) =>
												(pScoreBtnRefs.current[row.id] =
													ref)
											}
											onClick={(event) =>
												update(row.id, "pScore")
											}
											style={{ display: "none" }}
										>
											수정
										</button>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											defaultValue={row.sScore}
											name={row.sScore}
											ref={(ref) =>
												(sScoreInputRefs.current[
													row.id
												] = ref)
											}
											onChange={(event) =>
												changeFormState(
													row.id,
													"sScore",
													event.target.value,
												)
											}
										></input>
										<button
											className="btn_update"
											ref={(ref) =>
												(sScoreBtnRefs.current[row.id] =
													ref)
											}
											onClick={(event) =>
												update(row.id, "sScore")
											}
											style={{ display: "none" }}
										>
											수정
										</button>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											defaultValue={row.tScore}
											name={row.tScore}
											ref={(ref) =>
												(tScoreInputRefs.current[
													row.id
												] = ref)
											}
											onChange={(event) =>
												changeFormState(
													row.id,
													"tScore",
													event.target.value,
												)
											}
										></input>
										<button
											className="btn_update"
											ref={(ref) =>
												(tScoreBtnRefs.current[row.id] =
													ref)
											}
											onClick={(event) =>
												update(row.id, "tScore")
											}
											style={{ display: "none" }}
										>
											수정
										</button>
									</td>
									<td
										style={{
											textAlign: "center",
											paddingTop: 0,
										}}
									>
										{`${new Date(
											row.createdAt,
										).getFullYear()}/${
											new Date(row.createdAt).getMonth() +
											1
										}/${new Date(row.createdAt).getDate()}`}
										<br></br>
										{`${new Date(
											row.createdAt,
										).getHours()}:${new Date(
											row.createdAt,
										).getMinutes()}:${new Date(
											row.createdAt,
										).getSeconds()}`}
									</td>
									<td
										style={{
											textAlign: "center",
											paddingTop: 0,
										}}
									>
										{`${new Date(
											row.updatedAt,
										).getFullYear()}/${
											new Date(row.updatedAt).getMonth() +
											1
										}/${new Date(row.updatedAt).getDate()}`}
										<br></br>
										{`${new Date(
											row.updatedAt,
										).getHours()}:${new Date(
											row.updatedAt,
										).getMinutes()}:${new Date(
											row.updatedAt,
										).getSeconds()}`}
									</td>
									<td
										style={{
											textAlign: "center",
											paddingTop: 0,
										}}
									>
										<select
											defaultValue={row.pickUp}
											name={row.pickUp}
											ref={(ref) =>
												(pickUpInputRefs.current[
													row.id
												] = ref)
											}
											onChange={(event) =>
												changeFormState(
													row.id,
													"pickUp",
													event.target.value,
												)
											}
										>
											<option value="Y">Y</option>
											<option value="N">N</option>
										</select>
										<button
											className="btn_update"
											ref={(ref) =>
												(pickUpBtnRefs.current[row.id] =
													ref)
											}
											onClick={(event) =>
												update(row.id, "pickUp")
											}
											style={{ display: "none" }}
										>
											수정
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<Toaster
					toastOptions={{
						duration: 1000,
						position: "top-center",
						style: {
							border: "1px solid #168",
							// padding: "1px",
							color: "#168",
							fontSize: "15px",
						},
					}}
				/>
			</AmplifyAuthenticator>
		</AmplifyContainer>
	);
};

export default Admin;

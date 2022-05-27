import { CSVLink } from "react-csv";

import { API, graphqlOperation } from "aws-amplify";

import React, { useEffect, useState } from "react";

import { datasByDate } from "../graphql/queries";
import { onCreateData } from "../graphql/subscriptions";

import {
	AmplifyAuthenticator,
	AmplifySignIn,
	AmplifySignOut,
	AmplifyContainer,
} from "@aws-amplify/ui-react";

const initialState = [
	{
		id: "",
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
	},
];

const headers = [
	{ label: "바코드", key: "id" },
	{ label: "이름", key: "name" },
	{ label: "영어 성", key: "lastName" },
	{ label: "영어 이름", key: "firstName" },
	{ label: "SPEED", key: "rScore" },
	{ label: "PASS", key: "pScore" },
	{ label: "SHOOT", key: "sScore" },
	{ label: "TOTAL", key: "tScore" },
	{ label: "생성 시간", key: "createdAt" },
	{ label: "최근 변경 시간", key: "updatedAt" },
];

const Admin = (props) => {
	const [datas, setDatas] = useState(initialState);
	const [csvDatas, setCsvDatas] = useState([]);

	// TODO: 구해야 함
	const [todayN, setTodayN] = useState(0);
	const [totalN, setTotalN] = useState(0);
	const [isDownloadLoading, setIsDownloadLoading] = useState(true);

	useEffect(() => {
		fetchDatas();

		API.graphql(graphqlOperation(onCreateData)).subscribe({
			next: (evt) => {
				const data = evt.value.data.onCreateData;
				// TODO datas에 추가 및 삭제, csvDatas에 추가
			},
		});

		fetchDownloadList();
	}, []);

	async function fetchDatas() {
		const fechedDatas = await API.graphql({
			query: datasByDate,
			variables: {
				limit: 20,
				type: "Data",
				sortDirection: "DESC",
			},
		});

		console.log(fechedDatas.data.datasByDate.items);

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
		setCsvDatas(resultList);

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
			setCsvDatas(resultList);

			nextToken = fechedDatas.data.datasByDate.nextToken;
		}

		setIsDownloadLoading(false);
	}

	async function updateData(data) {
		const todoDetails = {
			id: "some_id",
			description: "My updated description!",
		};
		const updatedTodo = await API.graphql({
			query: updateData,
			variables: { input: todoDetails },
		});
	}

	return (
		<AmplifyContainer>
			<AmplifyAuthenticator>
				<AmplifySignIn slot="sign-in" hideSignUp></AmplifySignIn>
				<div>
					<h1>Nike Football Studio Admin</h1>

					<h2 className="today_n">오늘 방문자 수: {todayN}</h2>
					<h2 className="total_n">전체 방문자 수: {totalN}</h2>
					<div className="csv_link">
						<CSVLink
							data={csvDatas}
							headers={headers}
							filename={`전체 방문자 목록_${new Date().getFullYear()}_${
								new Date().getMonth() + 1
							}_${new Date().getDate()}`}
						>
							<button disabled={isDownloadLoading}>
								전체 방문자 목록 다운로드
							</button>
						</CSVLink>
					</div>
					<table>
						<thead>
							<tr>
								{headers.map((col) => (
									<th key={col.key}>{col.label}</th>
								))}
								<th></th>
							</tr>
						</thead>
						<tbody>
							{datas.map((row) => (
								<tr key={row.id}>
									<td style={{ textAlign: "center" }}>
										{row.id}
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											value={row.name}
										></input>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											value={row.lastName}
										></input>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											value={row.firstName}
										></input>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											value={row.rScore}
										></input>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											value={row.pScore}
										></input>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											value={row.sScore}
										></input>
									</td>
									<td style={{ textAlign: "center" }}>
										<input
											type="text"
											value={row.tScore}
										></input>
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
										onClick={() => updateData(row)}
										style={{
											textAlign: "center",
											paddingTop: 0,
										}}
									>
										수정
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{/* <AmplifySignOut></AmplifySignOut> */}
			</AmplifyAuthenticator>
		</AmplifyContainer>
	);
};

export default Admin;

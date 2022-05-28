import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Storage, API, graphqlOperation } from "aws-amplify";
import { createData, updateTotal } from "../graphql/mutations";
import { getTotal } from "../graphql/queries";

// import bwipjs from "bwip-js";
import { v4 as uuid } from "uuid";

import "../css/default.css";

import Barcode from "react-barcode";
import domtoimage from "dom-to-image";

const initialState = {
	id: "",
	type: "Data",
	order: 0,
	name: "",
	firstName: "",
	lastName: "",
	phoneNumber: "",
	position: "Forward",
	pScore: "",
	rScore: "",
	sScore: "",
	tScore: "",
	pickUp: "N",
};

const regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

const initialText =
	`제1조 (목적)\n` +
	`본 '[디지털 모두의 운동장 서비스 이용 약관]' (이하 "본 약관"이라 합니다)은 이용자가 (유)나이키코리아에서 제공하는 [디지털 모두의 운동장 사이트] 및 사이트 관련 각종 서비스 (이하 "서비스"라 합니다)를 이용함에 있어 "디지털 모두의 운동장 사이트”와 “이용자”의 권리 의무 및 책임 사항을 규정함을 목적으로 합니다.\n` +
	`제2조 (정의)\n` +
	`본 약관의 주요 용어는 아래와 같이 정의합니다.\n` +
	`• "NIKE"는 (유)나이키코리아를 말하며  디지털 모두의 운동장 사이트는 NIKE가 운영하는 공식 온라인 쇼핑몰을 통하여 제공되는 별도의 이벤트 사이트를 말합니다.\n` +
	`• "서비스"란 디지털 모두의 운동장 사이트 및 사이트 관련 각종 서비스를 말합니다.\n` +
	`• “이용자”란 "사이트"에 접속하여 이 약관에 따라 "디지털 모두의 운동장"이 제공하는 “서비스”를 받는 “회원”회원을 말합니다.\n` +
	`• "회원"은 "나이키 디지털 플레이그라운드"에 개인 정보를 제공하여 회원 등록을 한 자로서, 회원 전용 "서비스"를 이용할 수 있는 자를 말합니다.\n` +
	`2. 이 약관에서 정하지 아니한 내용과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원 회가 정하는 전자상거래 등에서의 소비자보호지침 및 관계법령 또는 상관례에 따릅니다\n` +
	`\n` +
	`제 3조 (약관의 게시와 변경)\n` +
	`1. "디지털 모두의 운동장"은 이 약관의 내용과 상호, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함)전화번호, 모사전송번호, 이메일 주소, 사업자등록번호, 통신판매업신고번호, 개인정보보호책임자 등을 이용자가 쉽게 알 수 있도록 “디지털 모두의 운동장”의 초기 서비스화면(전면)에 게시합니다. 다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.\n` +
	`2. "디지털 모두의 운동장"은 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회, 배송책임, 환불조건 등과 같은 중요한 내용을 이용 자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.\n` +
	`3. "디지털 모두의 운동장"은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.\n` +
	`4. "디지털 모두의 운동장"은 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 홈페이지의 초기화면에 그 적용일 7일 이전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다. 이 경우 "디지털 모두의 운동장"은 개정 전 내용과 개정 후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다.\n` +
	`5. "디지털 모두의 운동장"이 개정약관을 공지 또는 통지하면서 회원에게 30일 기간 내에 의사표시를 하지 않으면 의사표시가 표명된 것으로 본다는 뜻을 명확하게 따로 공지 또는 고지하였음에도 회원이 명시적으로 거부의사를 표시하지 아니한 경우 회원이 개정약관에 동의한 것으로 봅니다. 또한, 회원이 개정약관의 적용에 동의하지 않는 경우 "디지털 모두의 운동장"은 개정약관의 내용을 적용할 수 없으며, 이 경우, 회원은 이용계약을 해지할 수 있습니다. 다만, 기존약관을 적용할 수 없는 특별한 사정이 있는 경우에는 "디지털 모두의 운동장"은 이용계약을 해지할 수 있습니다.\n` +
	`6. 이 약관에서 정하지 아니한 내용과 이 약관의 해석에 관하여 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자보호지침 및 관계법령 또는 상관례에 따릅니다.`;

const totalID = "c47e4865-cc7b-4db0-a5d0-5b02fb21b90c";

const Register = () => {
	const barcodeRef = useRef();
	const navigate = useNavigate();

	const nameInput = useRef(null);
	const firstNameInput = useRef(null);
	const lastNameInput = useRef(null);
	const phoneNumberInput = useRef(null);

	const [formState, setFormState] = useState(initialState);
	const [text, setText] = useState(initialText);
	const [agree, setAgree] = useState(false);
	const [key, setKey] = useState("init");
	const [registText, setRegistText] = useState("선수 등록");
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (key !== "init") {
			uploadBarcode(key);
		}
	}, [key]);

	async function uploadBarcode(key) {
		try {
			const totalNumResult = await API.graphql({
				query: getTotal,
				variables: { id: totalID },
			});

			const nextNum = totalNumResult.data.getTotal.num + 1;

			const data = {
				...formState,
				id: key,
				order: nextNum,
				firstName: formState.firstName.toUpperCase(),
				lastName: formState.lastName.toUpperCase(),
			};

			await API.graphql(graphqlOperation(createData, { input: data }));

			await API.graphql({
				query: updateTotal,
				variables: {
					input: {
						id: totalID,
						num: nextNum,
					},
				},
			});
		} catch (error) {
			alert("오류가 발생하였습니다. 다시 시도해주세요.");
			console.log("error creating data:", error);

			setRegistText("선수 등록");
			setDisabled(false);
			return;
		}

		const storageKey = formState.phoneNumber + ".jpg";
		const barcode = barcodeRef.current;
		domtoimage
			.toJpeg(barcode, { quality: 0.9 })
			.then(async function (dataUrl) {
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
				setRegistText("선수 등록");
				setDisabled(false);
				navigate("/complete?n=" + encodeURIComponent(formState.name));
			});
	}

	function setInput(key, value) {
		setFormState({ ...formState, [key]: value });
	}

	function moveInit() {
		navigate("/");
	}

	async function submit() {
		if (!formState.name) {
			alert("이름을 작성해야 합니다.");
			nameInput.current.focus();
			return;
		}

		if (!formState.lastName) {
			alert("영문 성을 작성해야 합니다.");
			lastNameInput.current.focus();
			return;
		}

		if (!formState.firstName) {
			alert("영문 이름을 작성해야 합니다.");
			firstNameInput.current.focus();
			return;
		}

		if (!formState.phoneNumber) {
			alert("전화번호를 작성해야 합니다.");
			phoneNumberInput.current.focus();
			return;
		}

		if (!regPhone.test(formState.phoneNumber)) {
			alert("올바른 전화번호를 작성해야 합니다.");
			phoneNumberInput.current.focus();
			return;
		}

		if (!agree) {
			alert("이용 약관에 동의해야 합니다.");
			return;
		}

		setRegistText("등록 중...");
		setDisabled(true);

		const uniqueID = uuid();
		const shortID = uniqueID.slice(0, 13).replaceAll("-", "");

		setKey(shortID);

		// let canvas = bwipjs.toCanvas("barcode", {
		// 	bcid: "code128", // Barcode type
		// 	text: shortID,
		// 	scale: 1, // 3x scaling factor
		// 	height: 15, // Bar height, in millimeters
		// 	includetext: true, // Show human-readable text
		// 	textxalign: "center", // Always good to set this
		// 	textsize: 15,
		// 	paddingheight: 10,
		// 	// rotate: "R",
		// });
	}

	return (
		<>
			<div
				className="barcode_area"
				ref={barcodeRef}
				style={{
					position: "absolute",
					width: "380px",
					height: "517px",
					left: "0vw",
					backgroundImage: "url(../img/barcode_frame.png)",
					backgroundSize: "cover",
					display: "flex",
					justifyContent: "center",
					zIndex: -5,
				}}
			>
				<div
					style={{
						position: "absolute",
						top: "379px",
					}}
				>
					<Barcode
						value={key}
						format={`CODE128`}
						width={2}
						height={92}
						font={`SUIT`}
						fontSize={17}
						fontOptions={`bold`}
					/>
				</div>
			</div>
			<div className="container">
				<header>
					<img
						src="img/logo_text.png"
						alt="Nike Football Studio"
						className="header_text"
					></img>
					<img
						src="img/logo.png"
						alt="Nike Logo"
						className="header_logo"
					></img>
				</header>
				<div>
					<div>
						<p className="label_text">이름</p>
						<input
							type="text"
							onChange={(event) =>
								setInput("name", event.target.value)
							}
							value={formState.name}
							placeholder="이름을 입력해주세요."
							className="input_text input_long"
							ref={nameInput}
						/>
					</div>

					<p className="label_text">
						<span className="first">영문 성</span>
						<span className="second">영문 이름</span>
					</p>
					<div>
						<input
							type="text"
							onChange={(event) =>
								setInput("lastName", event.target.value)
							}
							value={formState.lastName}
							placeholder="영문 성을 입력해주세요."
							id="last_name"
							className="input_text input_short"
							ref={lastNameInput}
						/>
						<input
							type="text"
							onChange={(event) =>
								setInput("firstName", event.target.value)
							}
							value={formState.firstName}
							placeholder="영문 이름을 입력해주세요."
							id="first_name"
							className="input_text input_short"
							ref={firstNameInput}
						/>
					</div>
					<div>
						<p className="label_text">전화번호</p>
						<input
							onChange={(event) =>
								setInput("phoneNumber", event.target.value)
							}
							value={formState.phoneNumber}
							placeholder="전화번호를 ‘-’없이 입력해주세요."
							className="input_text input_long"
							type="tel"
							ref={phoneNumberInput}
						/>
					</div>
					<div>
						<p className="label_text">
							좋아하는 포지션을 선택해주세요.
						</p>
						<div className="radio_content">
							<span className="radio_box">
								<input
									type="radio"
									id="forward"
									name="position"
									value="Forward"
									checked={formState.position === "Forward"}
									onChange={(event) =>
										setInput("position", event.target.value)
									}
								/>
								<label htmlFor="forward">
									<span className="round">라디오버튼</span>
									포워드 (Forward)
								</label>
							</span>
							<span className="radio_box">
								<input
									type="radio"
									id="midfielder"
									name="position"
									value="Midfielder"
									checked={
										formState.position === "Midfielder"
									}
									onChange={(event) =>
										setInput("position", event.target.value)
									}
								/>
								<label htmlFor="midfielder">
									<span className="round">라디오버튼</span>
									미드필더 (Midfielder)
								</label>
							</span>
							<span className="radio_box">
								<input
									type="radio"
									id="defender"
									name="position"
									value="Defender"
									checked={formState.position === "Defender"}
									onChange={(event) =>
										setInput("position", event.target.value)
									}
								/>
								<label htmlFor="defender">
									<span className="round">라디오버튼</span>
									수비수 (Defender)
								</label>
							</span>
							<span className="radio_box">
								<input
									type="radio"
									id="goalkeeper"
									name="position"
									value="Goalkeeper"
									checked={
										formState.position === "Goalkeeper"
									}
									onChange={(event) =>
										setInput("position", event.target.value)
									}
								/>
								<label htmlFor="goalkeeper">
									<span className="round">라디오버튼</span>
									골키퍼 (Goalkeeper)
								</label>
							</span>
						</div>
					</div>
					<div>
						<p className="label_text">이용약관</p>
						<textarea defaultValue={text}></textarea>
					</div>
					<div className="checkbox_box">
						<input
							type="checkbox"
							id="agree"
							name="agree"
							onChange={(event) => {
								setAgree(event.target.checked);
							}}
							value={agree}
						></input>
						<label htmlFor="agree">
							<span className="round">체크박스</span>이용 약관에
							동의합니다.
						</label>
					</div>
					<p>
						<button
							className="btn_submit"
							onClick={submit}
							disabled={disabled}
						>
							{registText}
						</button>
					</p>
					<div>
						<img
							src="img/btn_back.png"
							alt="Back Page"
							className="btn_back"
							onClick={moveInit}
						></img>
					</div>
				</div>
			</div>
		</>
	);
};

export default Register;

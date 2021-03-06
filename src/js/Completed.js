import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../css/default.css";

let timer;

const Completed = () => {
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
		timer = setTimeout(() => {
			navigate("/");
		}, 5000);
	}, []);

	function moveInit() {
		clearTimeout(timer);
		navigate("/");
	}

	return (
		<>
			<div className="completed">
				<div className="main_text_area">
					<p className="main_text text-center">
						{decodeURIComponent(location.search.split("=")[1])}님
					</p>
					<p className="main_text text-center">
						선수 등록이 완료되었습니다.
					</p>
				</div>
				<p className="sub_text text-center">
					문자로 전달되는 바코드를 확인해주세요.
				</p>
				<button className="btn_move_init" onClick={moveInit}>
					처음으로 돌아가기
				</button>
			</div>
		</>
	);
};

export default Completed;

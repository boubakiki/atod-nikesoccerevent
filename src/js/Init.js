import React from "react";
import { useNavigate } from "react-router-dom";

import "../css/default.css";

const Init = () => {
	const navigate = useNavigate();

	function moveRegister() {
		navigate("/register");
	}

	return (
		<>
			<div className="init">
				<button className="btn_move_register" onClick={moveRegister}>
					선수 등록
				</button>
			</div>
		</>
	);
};

export default Init;

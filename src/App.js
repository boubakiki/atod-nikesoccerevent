import "./App.css";

import React from "react";
import { Routes, Route } from "react-router-dom";

import Register from "./js/Register";
import Init from "./js/Init";
import Completed from "./js/Completed";
import Admin from "./js/Admin";

import Amplify from "aws-amplify";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Init />}></Route>
				<Route path="/register" element={<Register />}></Route>{" "}
				<Route path="/complete" element={<Completed />}></Route>{" "}
				<Route path="/admin" element={<Admin />}></Route>{" "}
			</Routes>
		</>
	);
};

export default App;

import React from "react";
import ReactDOM from 'react-dom'
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));

import BasicHandler from "./tfw/gesture/basic-handler"

const basicHandler = new BasicHandler(
    document.body,
    evt => {
        console.info("[DOWN]", evt);
    },
    evt => {
        console.info("[UP]", evt);
    },
    evt => {
        console.info("[MOVE]", evt);
    });

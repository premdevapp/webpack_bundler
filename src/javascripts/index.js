import $ from "jQuery"

import logger from "./logging";

import app from "CssFolder/app.scss";
logger("webpack with babel loader");

$("body").append("<div style='background-color: yellow; padding: 10px;'>Hello JQuery</div>")

if(module.hot){
    module.hot.accept(err=>console.log(err))
}
import axios from "axios";
import { DEBUG } from "config/config";
var env = DEBUG || "development";

export const SERVER_NODE = "SERVER_NODE";
export const SERVER_RUST = "SERVER_RUST";

axios.defaults.baseURL = env === true ? `http://85.239.54.112:80/api` : "/api";

export default axios;

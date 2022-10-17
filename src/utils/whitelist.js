import axios from "./axios";

const getWhiteListInfo = async (address) => {
  try {
    let response = await axios.get(`/verify/${address}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log("loginerror: ", error);
    return Promise.reject(error);
  }
};

export default getWhiteListInfo;

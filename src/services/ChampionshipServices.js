import axios from "axios";

const REST_API_BASED_URL = "http://localhost:8080/api/championship";

export const listChampionships = () => {
    return axios(REST_API_BASED_URL);
}

export const deleteChampionship = (championshipId) => {
    return axios.delete(`${REST_API_BASED_URL}/${championshipId}`);
};
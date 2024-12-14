import axios from "axios";

const REST_API_BASED_URL = "http://localhost:8080/api/team";

export const listTeams = () => {
    return axios.get(REST_API_BASED_URL);
}

export const deleteTeam = (teamId) => {
    return axios.delete(`${REST_API_BASED_URL}/${teamId}`);
};

export const allChampsPartic = (teamId) => {
    return axios.get(`${REST_API_BASED_URL}/${teamId}/participation`);
}

export const crudPlus = () => {
    return axios.get(`${REST_API_BASED_URL}/business`);
}
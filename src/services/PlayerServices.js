import axios from "axios";

const REST_API_BASED_URL = "http://localhost:8080/api/player";

export const listPlayers = () => {
    return axios(REST_API_BASED_URL);
}

export const deletePlayer = (playerId) => {
    return axios.delete(`${REST_API_BASED_URL}/${playerId}`);
};

export const removeTeam = (playerId) => {
    return axios.delete(`${REST_API_BASED_URL}/${playerId}/team`)
}

export const standIn = (playerId, standInId) => {
    return axios.put(`${REST_API_BASED_URL}/${playerId}/standIn?p2=${standInId}`)
}

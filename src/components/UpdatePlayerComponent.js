import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import {listTeams} from "../services/TeamServices";

function UpdatePlayerComponent({onCancelUpdate, initialData, onUpdateSuccess}) {
    const {TextArea} = Input;
    const [team, setTeam] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [nickname, setNickname] = useState("");

    useEffect(() => {
        listTeams()
            .then((response) => setTeam(response.data))
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (initialData) {
            const nicknameInput = document.getElementById("nickname");

            if (nicknameInput) {
                setNickname(initialData.Nickname || "");
            }

            const teamSelect = document.getElementById("team");
            teamSelect.value = initialData.Team || ""; // Set the value or an empty string
            setSelectedTeam(initialData.Team || null);
        }
    }, [initialData]);

    const handleUpdate = () => {
        const nickname = document.getElementById("nickname").value;

        const jsonData = {
            id: initialData.ID,
            nickname: nickname !== "" ? nickname : null,
            team: selectedTeam,
        };

        fetch(`http://localhost:8080/api/player/${initialData.ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        onUpdateSuccess();
        onCancelUpdate();
    };

    const handleTeamChange = (value) => {
        const selectedTeam = team.find((t) => t.name === value);
        setSelectedTeam(
            selectedTeam
                ? {
                    id: selectedTeam.id,
                    name: selectedTeam.name,
                    sponsor: selectedTeam.sponsor,
                    worldRanking: selectedTeam.worldRanking,
                }
                : null
        );
    };

    return (
        <div>
            <Form
                labelCol={{span: 4}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                style={{maxWidth: 600}}
            >
                <Form.Item label="Nickname" required={true}>
                    <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)}/>
                </Form.Item>
                <Form.Item label="Team">
                    <Select id="team" onChange={handleTeamChange} value={selectedTeam?.name || ""}>
                        <Select.Option value={null}> No Team</Select.Option>
                        {team.map((team) => (
                            <Select.Option key={team.id} value={team.name}>
                                {team.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Button type="primary" icon={<CheckOutlined/>} onClick={handleUpdate}>
                Update
            </Button>
        </div>
    );
}

export default UpdatePlayerComponent;

import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select} from "antd";
import {listTeams} from "../services/TeamServices";
import {CheckOutlined} from "@ant-design/icons";

function CreatePlayerComponent({onCancelCreate},) {
    const {TextArea} = Input;
    const [team, setTeam] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        listTeams()
            .then((response) => setTeam(response.data))
            .catch((error) => console.error(error));
    }, []);

    const data = team.map((team) => ({
        ID: team.id,
        Name: team.name,
        Ranking: team.worldRanking,
    }));

    const handleCreate = () => {
        const nickname = document.getElementById("nickname").value;
        const jsonData = {
            id: -1,
            nickname: nickname !== "" ? nickname : null,
            team: selectedTeam,
        };
        fetch("http://localhost:8080/api/player", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
        }).then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        onCancelCreate();
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
                    <Input id="nickname"/>
                </Form.Item>
                <Form.Item label="Team">
                    <Select id="team" onChange={handleTeamChange}>
                        {team.map((team) => (
                            <Select.Option key={team.id} value={team.name}>
                                {team.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Button type="primary" icon={<CheckOutlined/>} onClick={handleCreate}>
                Create
            </Button>
        </div>
    );
}

export default CreatePlayerComponent;
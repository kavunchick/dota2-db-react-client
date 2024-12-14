import React, {useEffect, useState} from "react";
import {Button, Form, Input, Select} from "antd";
import {listTeams} from "../services/TeamServices";
import {PlusSquareOutlined} from "@ant-design/icons";

function AddPlayerComponent({onCancelAdd, initialData}) {
    const [teams, setTeams] = useState([]);
    const[selectedTeamO, setSelectedTeam] = useState(null)

    useEffect(() => {
        listTeams()
            .then((response) => setTeams(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleAdd = () => {
        fetch(
            `http://localhost:8080/api/player/${initialData.ID}/team?t=${selectedTeamO.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        onCancelAdd();
    };

    const handleTeamChange = (value) => {
        const selectedTeam = teams.find((t) => t.name === value);
        setSelectedTeam(
            selectedTeam
                ? {
                    id: selectedTeam.id,
                    name: selectedTeam.name,
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
                <Form.Item label="Team" required={false}>
                    <Select id="champ" onChange={handleTeamChange}>
                        {teams.map((teams) => (
                            <Select.Option key={teams.id} value={teams.name}>
                                {teams.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Button
                type="primary"
                icon={<PlusSquareOutlined/>}
                onClick={handleAdd}
            >
                Add
            </Button>
        </div>
    );
}

export default AddPlayerComponent;
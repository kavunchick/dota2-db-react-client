import React, { useEffect, useState } from "react";
import {Button, Form, Input, InputNumber, Select} from "antd";
import {allChampsPartic, listTeams} from "../services/TeamServices";
import {CheckOutlined, DeleteOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {listChampionships} from "../services/ChampionshipServices";

function RemoveTeamComponent({onCancelRemove, initialData}) {
    const [champ, setChamp] = useState([]);
    const [selectedChamp, setSelectedChamp] = useState();
    useEffect(() => {
        allChampsPartic(initialData.ID)
            .then((response) => setChamp(response.data))
            .catch((error) => console.error(error));
    }, [initialData.ID]);

    const handleRemove = () => {
        fetch(`http://localhost:8080/api/team/${initialData.ID}/participation?c=${selectedChamp.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
        ;
        onCancelRemove();
    };

    const handleChampChange = (value) => {
        const selectedChamp = champ.find((t) => t.name === value);
        setSelectedChamp(
            selectedChamp
                ? {
                    id: selectedChamp.id,
                    name: selectedChamp.name,
                }
                : null
        );
    };

    return (
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
            >
                <Form.Item label="Championship" required={false}>
                    <Select id="champ" onChange={handleChampChange}>
                        {champ.map((champ) => (
                            <Select.Option key={champ.id} value={champ.name}>
                                {champ.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Button type="primary" icon={<DeleteOutlined />} onClick={handleRemove}>
                Remove
            </Button>
        </div>
    );
}
export default RemoveTeamComponent;

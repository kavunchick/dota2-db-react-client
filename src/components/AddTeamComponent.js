import React, {useEffect, useState} from "react";
import {Button, Form, Select} from "antd";
import {allChampsPartic} from "../services/TeamServices";
import {PlusSquareOutlined} from "@ant-design/icons";
import {listChampionships} from "../services/ChampionshipServices";

function AddTeamComponent({onCancelAdd, initialData}) {
    const [teams, setTeams] = useState([]);
    const [champ, setChamp] = useState([]);
    const [parcChamp, setParcChamp] = useState([]);

    const [selectedChamp, setSelectedChamp] = useState();
    useEffect(() => {
        listChampionships()
            .then((response) => setChamp(response.data))
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        allChampsPartic(initialData.ID)
            .then((response) => setParcChamp(response.data))
            .catch((error) => console.error(error));
    }, [initialData.ID]);


    const handleAdd = () => {
        fetch(
            `http://localhost:8080/api/team/${initialData.ID}/participation?c=${selectedChamp.id}`,
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
    const differenceArray = champ.filter((c) => !parcChamp.some((p) => p.id === c.id));
    return (
        <div>
            <Form
                labelCol={{span: 4}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                style={{maxWidth: 600}}
            >
                <Form.Item label="Championship" required={false}>
                    <Select id="champ" onChange={handleChampChange}>
                        {differenceArray.map((champ) => (
                            <Select.Option key={champ.id} value={champ.name}>
                                {champ.name}
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

export default AddTeamComponent;
import React, {useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, InputNumber, Select} from "antd";
import {CheckOutlined} from "@ant-design/icons";
import {listTeams} from "../services/TeamServices";

const {RangePicker} = DatePicker;
const {Option} = Select;

function CreateChampComponent({onCancelCreate}) {
    const {TextArea} = Input;
    const [teams, setTeams] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [selectedWinner, setSelectedWinner] = useState(null);
    const [dateRange, setDateRange] = useState([]);

    useEffect(() => {
        listTeams()
            .then((response) => setTeams(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    const handleCreate = () => {
        const name = document.getElementById("name").value;
        const prizePool = document.getElementById("pool").value;
        const startDate = dateRange[0];
        const endDate = dateRange[1];

        const jsonData = {
            id: -1,
            name: name,
            prizePool: prizePool,
            startingDate: startDate,
            endDate: endDate,
            participants: selectedParticipants.map((participant) => ({
                id: participant.id,
                name: participant.name,
                sponsor: participant.sponsor,
                worldRanking: participant.worldRanking,
            })),
            winner: selectedWinner,
        };

        fetch("http://localhost:8080/api/championship", {
            method: "POST",
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
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        delay(200)
            .then(() => {
                onCancelCreate();
            });

    };

    const handleParticipantsChange = (values) => {
        const selectedTeams = teams.filter((team) => values.includes(team.name));
        setSelectedParticipants(selectedTeams);
    };

    const handleWinnerChange = (value) => {
        const selectedTeam = teams.find((t) => t.name === value);
        setSelectedWinner(
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

    const rangeConfig = {
        rules: [
            {
                type: "array",
                required: true,
                message: "Please select time!",
            },
        ],
    };

    return (
        <div>
            <Form
                labelCol={{span: 4}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                style={{maxWidth: 600}}
            >
                <Form.Item label="Name" required={true}>
                    <Input id="name"/>
                </Form.Item>
                <Form.Item label="Prize pool" required={true}>
                    <InputNumber min={1} id={"pool"}/>
                </Form.Item>
                <Form.Item
                    name="range-picker"
                    id={"datePicker"}
                    label="Duration"
                    {...rangeConfig}
                >
                    <RangePicker onChange={handleDateChange}/>
                </Form.Item>
                <Form.Item label="Participants" required={false}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{
                            width: "100%",
                        }}
                        placeholder="Please select participants"
                        onChange={handleParticipantsChange}
                    >
                        {teams.map((team) => (
                            <Option key={team.id} value={team.name}>
                                {team.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Winner" required={false}>
                    <Select id="winner" onChange={handleWinnerChange}>
                        {teams.map((team) => (
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

export default CreateChampComponent;

import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { listTeams } from "../services/TeamServices";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

function UpdateChampComponent({
                                  onCancelUpdate,
                                  initialData,
                                  onUpdateSuccess
                              }) {
    const { TextArea } = Input;
    const [teams, setTeams] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [selectedWinner, setSelectedWinner] = useState(null);
    const [dateRange, setDateRange] = useState([]);
    const [name, setName] = useState("");
    const [prizePool, setPrizePool] = useState(0);

    useEffect(() => {
        listTeams()
            .then((response) => setTeams(response.data))
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (initialData) {
            const nameInput = document.getElementById("name");
            if (nameInput) {
                setName(initialData.Name || "");
            }
            const poolInput = document.getElementById("pool");
            if (poolInput) {
                setPrizePool(initialData.prizePool || 0);
            }

            const datePicker = document.getElementById("range-picker");
            if (datePicker) {
                datePicker.value = initialData.startingDate
                    ? [moment(initialData.startingDate), moment(initialData.endDate)]
                    : [];
            }

            const participantsSelect = document.getElementById("participants");
            if (participantsSelect) {
                participantsSelect.value = initialData.participants
                    ? initialData.participants.map((p) => p.name)
                    : [];
                setSelectedParticipants(initialData.participants || []);
            }

            const winnerSelect = document.getElementById("winner");
            if (winnerSelect) {
                winnerSelect.value = initialData.winner ? initialData.winner.name : "";
                setSelectedWinner(initialData.winner || null);
            }
        }
    }, [initialData]);

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    const handleUpdate = () => {
        const name = document.getElementById("name").value;
        const prizePool = document.getElementById("pool").value;
        const newStartDate = dateRange[0]?.toDate(); // Convert Day.js object to JavaScript Date
        const newEndDate = dateRange[1]?.toDate(); // Convert Day.js object to JavaScript Date

        const jsonData = {
            id: initialData.id,
            name: name,
            prizePool: prizePool,
            startingDate: newStartDate,
            endDate: newEndDate,
            participants: selectedParticipants.map((participant) => ({
                id: participant.id,
                name: participant.name,
                sponsor: participant.sponsor,
                worldRanking: participant.worldRanking,
            })),
            winner: selectedWinner,
        };
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        fetch(`http://localhost:8080/api/championship/${initialData.ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonData)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
        ;
        delay(200)
            .then(() => {
                onUpdateSuccess();
                onCancelUpdate();
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
                    worldRanking: selectedTeam.worldRanking
                }
                : null
        );
    };

    const rangeConfig = {
        rules: [
            {
                type: "array",
                required: true,
                message: "Please select time!"
            }
        ]
    };

    return (
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: 600 }}
            >
                <Form.Item label="Name" required={true}>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Item>
                <Form.Item label="Prize pool" required={true}>
                    <InputNumber min={1} id="pool" value={prizePool} onChange={(value) => setPrizePool(value)} />
                </Form.Item>
                <Form.Item
                    name="range-picker"
                    id="datePicker"
                    label="Duration"
                    {...rangeConfig}
                >
                    <RangePicker onChange={handleDateChange} />
                </Form.Item>
                <Form.Item label="Participants" required={false}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{
                            width: "100%"
                        }}
                        placeholder="Please select participants"
                        onChange={handleParticipantsChange}
                        value={selectedParticipants.map((p) => p.name)}
                    >
                        {teams.map((team) => (
                            <Option key={team.id} value={team.name}>
                                {team.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Winner" required={false}>
                    <Select id="winner" onChange={handleWinnerChange} value={selectedWinner?.name || ""}>
                        {teams.map((team) => (
                            <Select.Option key={team.id} value={team.name}>
                                {team.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Button type="primary" icon={<CheckOutlined />} onClick={handleUpdate}>
                Update
            </Button>
        </div>
    );
}

export default UpdateChampComponent;

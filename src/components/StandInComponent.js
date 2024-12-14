import React, {useEffect, useState} from "react";
import {Button,  Form, message, Select} from "antd";
import {RetweetOutlined} from "@ant-design/icons";
import {listPlayers, standIn} from "../services/PlayerServices";

function StandInComponent() {
    const [player, setPlayers] = useState([])
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedStandIN, setSelectedStandIN] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        listPlayers()
            .then((response) => setPlayers(response.data))
            .catch((error) => console.error(error));
    }, []);

    const handleStandIn = () => {
        standIn(selectedPlayer.id, selectedStandIN.id).then(response => {
            console.log('Success Response:', response);
            messageApi.open({
                type: 'success',
                content: 'Success',
            });
        }).catch(function (error) {
            if (error.response) {
                console.log('Error Status:', error.response.status);
                if (error.response.status === 400) {
                    messageApi.open({
                        type: 'error',
                        content: 'Provided player does not have a team or StandIn player is already participating in the upcoming tournament.',
                    });
                }
                if (error.response.status === 422) {
                    messageApi.open({
                        type: 'error',
                        content: 'There is no upcoming championships.',
                    });
                }
                if (error.response.status === 204) {
                    messageApi.open({
                        type: 'success',
                        content: 'Success',
                    });
                }
            }
        });
    };


    const handlePlayerChange = (value) => {
        const selectedPlayer = player.find((t) => t.nickname === value);
        setSelectedPlayer(
            selectedPlayer
                ? {
                    id: selectedPlayer.id,
                    nickname: selectedPlayer.nickname,
                }
                : null
        );
    };
    const handleStandinChange = (value) => {
        const selectedPlayer = player.find((t) => t.nickname === value);
        setSelectedStandIN(
            selectedPlayer
                ? {
                    id: selectedPlayer.id,
                    nickname: selectedPlayer.nickname,
                }
                : null
        );
    };

    return (
        <div>
            {contextHolder}
            <Form
                labelCol={{span: 4}}
                wrapperCol={{span: 14}}
                layout="horizontal"
                style={{maxWidth: 600}}
            >
                <Form.Item label="Player" required={false}>
                    <Select id="player" onChange={handlePlayerChange}>
                        {player.map((player) => (
                            <Select.Option key={player.id} value={player.nickname}>
                                {player.nickname}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Stand In" required={false}>
                    <Select id="standIn" onChange={handleStandinChange}>
                        {player.map((player) => (
                            <Select.Option key={player.id} value={player.nickname}>
                                {player.nickname}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
            <Button type="primary" icon={<RetweetOutlined />} onClick={handleStandIn}>
                Exchange players
            </Button>

        </div>
    );
}

export default StandInComponent;

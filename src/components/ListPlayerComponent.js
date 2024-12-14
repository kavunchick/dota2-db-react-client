import React, {useEffect, useState} from "react";
import {deletePlayer, listPlayers, removeTeam} from "../services/PlayerServices";
import {Button, Modal, Space, Table} from "antd";
import CreatePlayerComponent from "./CreatePlayerComponent";
import UpdatePlayerComponent from "./UpdatePlayerComponent";
import AddPlayerComponent from "./AddPlayerComponent";

function ListPlayerComponent() {
    const [players, setPlayer] = useState([]);
    const [showCreatePlayer, setShowCreatePlayer] = useState(false);
    const [headerText, setHeaderText] = useState("List of Players");
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [forceRerender, setForceRerender] = useState(false); // Add this line
    const [showUpdatePlayer, setShowUpdatePlayer] = useState(false);
    const [updatePlayerData, setUpdatePlayerData] = useState(null);
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [addPlayerData, setAddPlayerData] = useState(null);

    useEffect(() => {
        listPlayers()
            .then((response) => setPlayer(response.data))
            .catch((error) => console.error(error));
    }, [forceRerender]);
    const handleDelete = (record) => {
        setSelectedPlayer(record);
        setModalVisible(true);
    };
    const columns = [
        {
            title: "ID",
            dataIndex: "ID",
            width: 10
        },
        {
            title: "Nickname",
            dataIndex: "Nickname",
            width: 100
        },
        {
            title: "Team",
            dataIndex: "Team",
            width: 80
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" danger onClick={() => handleDelete(record)}>
                        Delete
                    </Button>
                    <Button type="default" onClick={() => handleUpdate(record)}>
                        Update
                    </Button>
                    <Button type="primary" onClick={() => handleAdd(record)}>Invite to team </Button>
                    <Button type="primary" danger onClick={() => handleRemove(record)}>Remove from team</Button>
                </Space>
            ),
            width: 50
        },
    ];
    let data = players.map((player) => ({
        ID: player.id,
        Nickname: player.nickname,
        Team: player.team?.name || "No Team",
    }));
    const handleUpdate = (record) => {
        setUpdatePlayerData(record);
        setShowUpdatePlayer(true);
    };
    const handleRemove = (record) => {
        console.log(record)
        removeTeam(record.ID);
        setForceRerender(prev => !prev);
    };
    const handleAdd = (record) => {
        setAddPlayerData(record);
        setShowAddPlayer(true);
        setHeaderText("Add players to team");
    };
    const handleUpdateCancel = () => {
        setUpdatePlayerData(null);
        setShowUpdatePlayer(false);
        setForceRerender(prev => !prev);
    };
    const handleCreatePlayerClick = () => {
        setShowCreatePlayer(true);
        setHeaderText("Create New Player");
    };
    const handleAddCancel = async (record) => {
        const response = await listPlayers();
        setPlayer(response.data);
        setForceRerender(prev => !prev);
        setShowAddPlayer(false);
        setHeaderText("List of Players");
    };

    const handleConfirmDelete = async () => {
        try {
            await deletePlayer(selectedPlayer.ID);

            const response = await listPlayers();
            setPlayer(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setSelectedPlayer(null);
            setModalVisible(false);
        }
    };

    const handleCancelDelete = () => {
        setSelectedPlayer(null);
        setModalVisible(false);
    };
    const handleCreatePlayerCancel = async () => {
        const response = await listPlayers();
        setPlayer(response.data);
        setForceRerender(prev => !prev);
        setShowCreatePlayer(false);
        setHeaderText("List of Players");
    };
    const handleUpdateSuccess = async () => {
        try {
            const response = await listPlayers();
            setPlayer(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>{headerText}</h1>
            {showCreatePlayer ? (
                <CreatePlayerComponent
                    onCancelCreate={handleCreatePlayerCancel}
                />
            ) : showAddPlayer ? (
                <AddPlayerComponent
                onCancelAdd={handleAddCancel}
                initialData={addPlayerData}
                ></AddPlayerComponent>
                ): (
                <>
                    <Button type="primary" onClick={handleCreatePlayerClick}>
                        Create new player
                    </Button>
                    <Table dataSource={data} columns={columns}></Table>
                    <Modal
                        title="Confirm Delete"
                        open={modalVisible}
                        onOk={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    >
                        <p>Are you sure you want to delete this player?</p>
                    </Modal>
                    {showUpdatePlayer && (
                        <UpdatePlayerComponent
                            onCancelUpdate={() => {
                                setShowUpdatePlayer(false);
                                handleUpdateCancel();
                            }}
                            onUpdateSuccess={handleUpdateSuccess}
                            initialData={updatePlayerData}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default ListPlayerComponent;
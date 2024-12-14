import React, {useEffect, useState} from "react";
import {deleteChampionship, listChampionships} from "../services/ChampionshipServices";
import {Button, Modal, Space, Table} from "antd";
import CreateChampComponent from "./CreateChampComponent";
import UpdateChampComponent from "./UpdateChampComponent";

function ListChampionshipsComponent() {
    const [championship, setChampionship] = useState([]);
    const [selectedChampionship, setSelectedChampionship] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [showCreateChamp, setShowCreateChamp] = useState(false);
    const [headerText, setHeaderText] = useState("List of Championships");
    const [forceRerender, setForceRerender] = useState(false); // Add this line
    const [showUpdateChamp, setShowUpdateChamp] = useState(false);
    const [updateChampData, setUpdateChampData] = useState(null);

    const data = championship.map((championship) => ({
        ID: championship.id,
        Name: championship.name,
        "Prize pool": championship.prizePool,
        "Starting date": championship.startingDate,
        "End date": championship.endDate,
        Winner: championship.winner?.name || "TBD",
    }));

    useEffect(() => {
        listChampionships()
            .then((response) => {
                setChampionship(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [forceRerender]);

    const handleDelete = (record) => {
        setSelectedChampionship(record);
        setModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteChampionship(selectedChampionship.ID);

            const response = await listChampionships();
            setChampionship(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setSelectedChampionship(null);
            setModalVisible(false);
        }
    };
    const handleCreateChampClick = () => {
        setShowCreateChamp(true);
        setHeaderText("Create new championship")
    }
    const handleCancelDelete = () => {
        setSelectedChampionship(null);
        setModalVisible(false);
    };
    const handleCreateChampCancel = async () => {
        const response = await listChampionships();
        setChampionship(response.data);
        setForceRerender(prev => !prev);
        setShowCreateChamp(false);
        setHeaderText("List of Championships");
    };
    const handleUpdate = (record) => {
        setUpdateChampData(record);
        setShowUpdateChamp(true);
    };
    const handleUpdateCancel = () => {
        setUpdateChampData(null);
        setShowUpdateChamp(false);
        setForceRerender(prev => !prev);
    };
    const handleUpdateSuccess = async () => {
        try {
            // Refresh the list after a successful update
            const response = await listChampionships();
            setChampionship(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const columns = [
        {
            title: "ID",
            dataIndex: "ID",
            width: 15
        },
        {
            title: "Name",
            dataIndex: "Name",
            width: 100
        },
        {
            title: "Prize pool",
            dataIndex: "Prize pool",
            width: 80
        },
        {
            title: "Starting date",
            dataIndex: "Starting date",
            width: 10
        },
        {
            title: "End date",
            dataIndex: "End date",
            width: 80
        },
        {
            title: "Winner",
            dataIndex: "Winner",
            width: 75
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" danger onClick={() => handleDelete(record)}>
                        Delete
                    </Button>
                    <Button type="default" onClick={() => handleUpdate(record)}>Update</Button>
                </Space>
            ),
            width: 50,
        },
    ];

    return (
        <div>
            <h1>{headerText}</h1>
            {showCreateChamp ? (
                <CreateChampComponent onCancelCreate={handleCreateChampCancel}></CreateChampComponent>
            ) : (
                <>
                    <Button type={"primary"} onClick={handleCreateChampClick}>Create new championship</Button>
                    <Table dataSource={data} columns={columns}></Table>
                    <Modal
                        title="Confirm Delete"
                        open={modalVisible}
                        onOk={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    >
                        <p>Are you sure you want to delete this championship?</p>
                    </Modal>
                    {showUpdateChamp && (
                        <UpdateChampComponent
                            onCancelUpdate={() => {
                                setShowUpdateChamp(false);
                                handleUpdateCancel();
                            }}
                            onUpdateSuccess={handleUpdateSuccess}
                            initialData={updateChampData}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default ListChampionshipsComponent;
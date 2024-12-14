import React, {useEffect, useState} from "react";
import {deleteTeam, listTeams} from "../services/TeamServices";
import {Button, Modal, Space, Table} from "antd";
import CreateTeamComponent from "./CreateTeamComponent";
import UpdateTeamComponent from "./UpdateTeamComponent";
import AddTeamComponent from "./AddTeamComponent";
import RemoveTeamComponent from "./RemoveTeamComponent";

function ListTeamComponent() {

    const [team, setTeam] = useState([])
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [headerText, setHeaderText] = useState("List of Teams");
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [forceRerender, setForceRerender] = useState(false);
    const [showUpdateTeam, setShowUpdateTeam] = useState(false);
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [updateTeamData, setUpdateTeamData] = useState(null);
    const [addTeamData, setAddTeamData] = useState(null);
    const [removeTeamData, setRemoveTeamData] = useState(null);
    const [showRemoveTeam, setShowRemoveTeam] = useState(false);


    useEffect(() => {
        listTeams().then((response) => {
            setTeam(response.data)
        }).catch(error => {
            console.error(error)
        })
    }, [forceRerender]);

    const handleAdd = (record) => {
        setAddTeamData(record)
        setShowAddTeam(true);
        setHeaderText("Add team to championship");
    }
    const handleAddCancel = () => {
        setAddTeamData(null);
        setShowAddTeam(false);
        setForceRerender(prev => !prev);
    };
    const handleRemove = (record) => {
        setRemoveTeamData(record)
        setShowRemoveTeam(true);
        setHeaderText("Remove team from championship");
    }
    const handleRemoveCancel = () => {
        setRemoveTeamData(null);
        setShowRemoveTeam(false);
        setForceRerender(prev => !prev);
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "ID",
            width: 10
        },
        {
            title: "Name",
            dataIndex: "Name",
            width: 100
        },
        {
            title: "Team ranking",
            dataIndex: "Ranking",
            width: 80
        },
        {
            title: "Sponsor",
            dataIndex: "Sponsor",
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
                    <Button type="primary" onClick={() => handleAdd(record)}>Invite to championship</Button>
                    <Button type="primary" danger onClick={() => handleRemove(record)}>Remove from championship</Button>
                </Space>
            ),
            width: 50
        },
    ];
    const data = team.map(team => ({
        ID: team.id,
        Name: team.name,
        Ranking: team.worldRanking,
        Sponsor: team.sponsor
    }));
    const handleUpdate = (record) => {
        console.log(record)
        setUpdateTeamData(record);
        setShowUpdateTeam(true);
    };
    const handleUpdateCancel = () => {
        setUpdateTeamData(null);
        setShowUpdateTeam(false);
        setForceRerender(prev => !prev);
    };
    const handleUpdateSuccess = async () => {
        try {
            const response = await listTeams();
            setTeam(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    const handleDelete = (record) => {
        setSelectedTeam(record);
        setModalVisible(true);
    };
    const handleCreateTeamClick = () => {
        setShowCreateTeam(true);
        setHeaderText("Create New Team");
    };
    const handleConfirmDelete = async () => {
        try {
            await deleteTeam(selectedTeam.ID);
            const response = await listTeams();
            setTeam(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setSelectedTeam(null);
            setModalVisible(false);
        }
    };

    const handleCancelDelete = () => {
        setSelectedTeam(null);
        setModalVisible(false);
    };
    const handleCreateTeamCancel = async () => {
        const response = await listTeams();
        setTeam(response.data);
        setForceRerender(prev => !prev);
        setShowCreateTeam(false);
        setHeaderText("List of Teams");
    };
    return (
        <div>
            <h1>{headerText}</h1>
            {showCreateTeam ? (
                <CreateTeamComponent onCancelCreate={handleCreateTeamCancel}></CreateTeamComponent>
            ) : showAddTeam ? (
                <AddTeamComponent
                    initialData={addTeamData}
                    onCancelAdd={handleAddCancel}></AddTeamComponent>
            ) : showRemoveTeam ? (
                <RemoveTeamComponent initialData={removeTeamData}
                                     onCancelRemove={handleRemoveCancel}></RemoveTeamComponent>
            ) : (
                <>
                    <Button type="primary" onClick={handleCreateTeamClick}>
                        Create new team
                    </Button>
                    <Table dataSource={data} columns={columns}></Table>
                    <Modal
                        title="Confirm Delete"
                        open={modalVisible}
                        onOk={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    >
                        <p>Are you sure you want to delete this team?</p>
                    </Modal>
                    {showUpdateTeam && (
                        <UpdateTeamComponent
                            onCancelUpdate={() => {
                                setShowUpdateTeam(false);
                                handleUpdateCancel();
                            }}
                            onUpdateSuccess={handleUpdateSuccess}
                            initialData={updateTeamData}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default ListTeamComponent;
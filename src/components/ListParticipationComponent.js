import React, {useEffect, useState} from "react";
import {listChampionships} from "../services/ChampionshipServices";
import {Button, message, Table} from "antd";
import {crudPlus, listTeams} from "../services/TeamServices";

function ListParticipationComponent() {
    const [championships, setChampionships] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const[crudPlusVar, setCrudPlus] = useState([]);


    useEffect(() => {
        listChampionships()
            .then((response) => {
                setChampionships(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    useEffect(() => {
        crudPlus()
            .then((response) => {
                setCrudPlus(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const columns = [
        {
            title: "Team",
            dataIndex: "team",
            key: "team",
        },
        {
            title: "Championship",
            dataIndex: "championship",
            key: "championship",
        },
    ];

    function messageF() {
        const teamNames = crudPlusVar.map((team) => team.name).join(", ");
        messageApi.open({
            type: "info",
            content: `Teams: ${teamNames}`,
        });
    }



    let data = [];
    championships.forEach((champ) => {
        champ.participants.forEach((participant) => {
            const teamName = participant.name;
            const championshipName = champ.name;
            data.push({
                key: `${teamName}-${championshipName}`,
                team: teamName,
                championship: championshipName,
            });
        });
    });

    return (
        <div>
            {contextHolder}
            <h1>Participation List</h1>
            <Button type="primary" onClick={messageF}>List all teams that took part in all championships</Button>
            <Table dataSource={data} columns={columns}/>
        </div>
    );
}

export default ListParticipationComponent;

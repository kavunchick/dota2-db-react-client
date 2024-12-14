import React, {useEffect, useState} from "react";
import {Button, Form, Input, InputNumber} from "antd";
import {CheckOutlined} from "@ant-design/icons";

function UpdateTeamComponent({onCancelUpdate, initialData, onUpdateSuccess}) {
    const {TextArea} = Input;
    const [team, setTeam] = useState("");
    const [sponsor, setSponsor] = useState("");
    const [ranking, setRanking] = useState(null);


    useEffect(() => {
        if (initialData) {
            const teamInput = document.getElementById("name");

            if (teamInput) {
                setTeam(initialData.Name || "");
            }

            const sponsorInput = document.getElementById("Sponsor");
            if (sponsorInput) {
                setSponsor(initialData.Sponsor)
            }

            const rankingInput = document.getElementById("Ranking");
            if (rankingInput) {
                setRanking(initialData.Ranking)
            }
        }
    }, [initialData]);

    const handleUpdate = () => {
        const name = document.getElementById("name").value; // Change "Name" to "name"
        const sponsor = document.getElementById("sponsor").value; // Change "Sponsor" to "sponsor"
        const rank = document.getElementById("ranking").value; // Change "Ranking" to "ranking"

        const jsonData = {
            id: initialData.ID,
            name: name !== "" ? name : null,
            sponsor: sponsor !== "" ? sponsor : null,
            worldRanking: rank !== "" ? rank : null,
        };

        fetch(`http://localhost:8080/api/team/${initialData.ID}`, {
            method: "PUT",
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
        onUpdateSuccess();
        onCancelUpdate();
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
                    <Input id="name" value={team} onChange={(e) => setTeam(e.target.value)}/>
                </Form.Item>
                <Form.Item label="Sponsor" required={false} value={sponsor}
                           onChange={(e) => setSponsor(e.target.value)}>
                    <Input id="sponsor"/>
                </Form.Item>
                <Form.Item label="World rank" required={false} value={ranking}
                           onChange={(e) => setRanking(e.target.value)}>
                    <InputNumber min={1} id={"ranking"}/>
                </Form.Item>
            </Form>
            <Button type="primary" icon={<CheckOutlined/>} onClick={handleUpdate}>
                Update
            </Button>
        </div>
    );
}

export default UpdateTeamComponent;

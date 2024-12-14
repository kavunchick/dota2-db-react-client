import React from "react";
import {Button, Form, Input, InputNumber} from "antd";
import {CheckOutlined} from "@ant-design/icons";

function CreateTeamComponent({onCancelCreate}) {
    const {TextArea} = Input;

    const handleCreate = () => {
        const teamName = document.getElementById("name").value;
        const sponsor = document.getElementById("sponsor").value;
        const ranking = document.getElementById("ranking").value;

        const jsonData = {
            id: -1,
            name: teamName !== "" ? teamName : null,
            sponsor: sponsor !== "" ? sponsor : null,
            worldRanking: ranking !== "" ? ranking : null,
        };

        fetch("http://localhost:8080/api/team", {
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
        onCancelCreate();
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
                <Form.Item label="Sponsor" required={false}>
                    <Input id="sponsor"/>
                </Form.Item>
                <Form.Item label="World rank" required={false}>
                    <InputNumber min={1} id={"ranking"}/>
                </Form.Item>
            </Form>
            <Button type="primary" icon={<CheckOutlined/>} onClick={handleCreate}>
                Create
            </Button>
        </div>
    );
}

export default CreateTeamComponent;

import React, {useState} from 'react';
import {Layout, Menu, theme} from 'antd';
import {Content, Header} from 'antd/es/layout/layout';
import ListPlayerComponent from './components/ListPlayerComponent';
import ListTeamComponent from './components/ListTeamComponent';
import ListChampionshipsComponent from './components/ListChampionshipComponent';
import StandInComponent from "./components/StandInComponent";
import ListParticipationComponent from "./components/ListParticipationComponent";
import CatComponent from './components/CatComponent'; // Import your CatComponent

function App() {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    const items = [
        {
            key: 0,
            label: 'Team',
            component: ListTeamComponent,
        },
        {
            key: 1,
            label: 'Player',
            component: ListPlayerComponent,
        },
        {
            key: 2,
            label: 'Championship',
            component: ListChampionshipsComponent,
        },
        {
            key: 3,
            label: 'Participation',
            component: ListParticipationComponent,
        },
        {
            key: 4,
            label: 'Stand In',
            component: StandInComponent,
        },
    ];

    const [selectedKey, setSelectedKey] = useState(null);
    const [isCatVisible, setIsCatVisible] = useState(true); // New state for CatComponent visibility

    const handleMenuClick = (key) => {
        setSelectedKey(key);
        setIsCatVisible(false); // Hide CatComponent when a button is clicked
    };

    const SelectedComponent = items.find((item) => item.key === selectedKey)?.component;

    return (
        <Layout>
            <Header style={{display: 'flex', alignItems: 'center'}}>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[]}
                    selectedKeys={selectedKey !== null ? [selectedKey.toString()] : []}
                    onClick={({key}) => handleMenuClick(Number(key))}
                    items={items}
                    style={{flex: 1, minWidth: 0}}
                />
            </Header>
            <Content style={{flexGrow: 1, padding: '48px 48px'}}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 'calc(100vh - 96px)',
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {isCatVisible && <CatComponent/>} {/* Conditionally render CatComponent */}
                    {SelectedComponent && <SelectedComponent/>}
                </div>
            </Content>
        </Layout>
    );
}

export default App;

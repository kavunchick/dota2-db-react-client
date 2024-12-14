import {Image} from "antd";

function CatComponent() {
    const src =
        "https://cdn.discordapp.com/attachments/1030881448498041012/1192463692768493679/a06cbd01-b97b-4d5a-9f39-e554912e94db.png?ex=65a92b5b&is=6596b65b&hm=f095879c948d27a89097b860dbfeaa9c6f90ed6b54458d037fd9dc90a7fdde96&";

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1>My main assistant SW engineer</h1>
            <Image src={src} width={1000}/>
        </div>
    );
}

export default CatComponent;

import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addServer, removeServer } from "../features/IPserver/IpServer";

export default function IpInputPage() {
    const dispatch = useDispatch();
    const servers = useSelector(state => state.ipServerReducer.servers);
    const [ipAddress, setIpAddress] = useState('');

    const handleAddServer = () => {
        if (ipAddress) {
            // Basic validation for ws:// prefix
            const fullAddress = ipAddress.startsWith('ws://') ? ipAddress : `ws://${ipAddress}`;
            // The port is usually 9090 for rosbridge
            const finalAddress = fullAddress.includes(':') ? fullAddress : `${fullAddress}:9090`;

            dispatch(addServer(finalAddress));
            setIpAddress(''); // Clear input after adding
        }
    };

    const handleRemoveServer = (serverId) => {
        dispatch(removeServer(serverId));
    };

    return (
        <div className="ip-input-page">
            <h1>Manage ROS Connections</h1>
            <div className="parent-container" style={{ marginBottom: '20px' }}>
                <input
                    type="url"
                    id="ip1"
                    style={{ width: "40rem" }}
                    onChange={e => setIpAddress(e.target.value)}
                    value={ipAddress}
                    placeholder="e.g., 192.168.1.100 or ws://192.168.1.100:9090"
                />
            </div>
            <div className="button-container" style={{ marginBottom: '40px' }}>
                <button type="submit" onClick={handleAddServer}>Add Server</button>
            </div>

            <h2>Server List</h2>
            <div>
                {servers.length === 0 ? (
                    <p>No servers added.</p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {servers.map(server => (
                            <li key={server.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{server.id}</strong>
                                    <br />
                                    <span style={{ color: server.isConnected ? 'green' : 'red' }}>
                                        {server.isConnected ? 'Connected' : 'Disconnected'}
                                    </span>
                                </div>
                                <button onClick={() => handleRemoveServer(server.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
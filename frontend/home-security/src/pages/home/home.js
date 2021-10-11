import React from 'react';
import DataGrid from 'devextreme-react/data-grid';

const columns = ['device', 'ip', 'details' ];

const devices = [
    {
        device:'Celular',
        ip: '192.168.4.5',
        details: 'Test',
    },
    {
        device:'Laptop',
        ip: '192.168.4.10',
        details: 'Test1',
    },
    {
        device:'Tv',
        ip: '192.168.4.15',
        details: 'Test2',
    },
];

export default () => {
    return (
        <div style={{ overflowY: 'scroll', height: 'calc(100vh - 127px)' }}>
        <React.Fragment>
            <h2>Resumen</h2>
            <div className={'content-block dx-card responsive-paddings'}>
            <h2>
                Dispositivos
            </h2>
            <DataGrid
                dataSource={devices}
                keyExpr="ip"
                defaultColumns={columns}
                showBorders={true}
            />
            </div>
        </React.Fragment>
        </div>
    );
};
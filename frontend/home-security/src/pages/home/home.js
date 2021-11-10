import React from 'react';
import 'devextreme/dist/css/dx.light.css';

import DataGrid from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';
 
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
 
const customDataSource = new CustomStore({
    load: () => {
        return fetch(`http://localhost:8080/devices`)
            .then(handleErrors)
            .then(response => response.json())
            .then(response => {
                return {
                    data: response.data,
                };
            })
            .catch(() => { throw 'Network error' });
    },
});
 
export default () => {
    return (
        <div style={{ overflowY: 'scroll', height: 'calc(100vh - 127px)' }}>
        <React.Fragment style={{align: 'right'}}>
            <h2>Resumen</h2>
            <div className={'content-block dx-card responsive-paddings'}>
                <h2>Dispositivos</h2>
                <DataGrid
                    dataSource={customDataSource}
                    // defaultColumns={columns}
                    showBorders={true}
                />
            </div>
        </React.Fragment>
        </div>
    );
};
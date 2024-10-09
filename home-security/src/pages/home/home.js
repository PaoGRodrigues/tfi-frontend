import React, { useEffect, useState } from 'react';
import 'devextreme/dist/css/dx.light.css';
import DataGrid, { ColumnChooser, ColumnFixing, Paging } from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { country_codes } from './country_codes.js';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';

import {
    RequiredRule,
} from 'devextreme-react/validator';
import {
    Chart,
    Series,
    ArgumentAxis,
    Grid,
    Crosshair,
    Export,
    Legend,
    Label,
    Font,
    Tooltip,
} from 'devextreme-react/chart';
import VectorMap, {
    Layer,
    Border,
} from 'devextreme-react/vector-map';


function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

const flattenObj = (ob) => {
    let result = {};

    for (const i in ob) {
        if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
            const temp = flattenObj(ob[i]);
            for (const j in temp) {
                result[i + '.' + j] = temp[j];
            }
        }
        else {
            result[i] = ob[i];
        }
    }
    console.log(result);
    return result;
};

const newCustomDataSource = (path, flatten) => {
    return new CustomStore({
        load: () => {
            const hostname = window.location.hostname;
            const backendport = '8080';
            const url = `http://${hostname}:${backendport}/${path}`

            return fetch(url)
                .then(handleErrors)
                .then(response => response.json())
                .then(response => {
                    return {
                        data: flatten ? response.data.map(flattenObj) : response.data,
                    }
                })
                .catch(() => { throw 'Network error' });
        },
    });
};

export default () => {
    const [ip, setIp] = useState(null);
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [bytesPerCountry, setBytesPerCountry] = useState(null);

    useEffect(() => {
        getBytesPerCountry()
            .then(setBytesPerCountry);
    }, []);

    return (
        <div style={{ overflowY: 'scroll', height: 'calc(100vh - 127px)' }}>
            <React.Fragment style={{ align: 'right' }}>
                <h2>Resumen</h2>
                <div className={'content-block dx-card responsive-paddings'}>
                    <h2>Dispositivos activos</h2>
                    <DataGrid
                        dataSource={newCustomDataSource("localhosts", true)}
                        showBorders={true}
                    >
                        <Paging defaultPageSize={12} />
                    </DataGrid>
                </div>
                <div className={'content-block dx-card responsive-paddings'} style={{ overflowX: 'auto' }}>
                    <h2>Bytes por destino</h2>
                    <Chart id="chart" width={'100%'}
                        dataSource={newCustomDataSource("activeflowsperdest", true)}
                        palette="Harmony Light"
                        showBorders={true}
                    >

                        <Series
                            valueField="Bytes"
                            argumentField="Destination"
                            name="Destination"
                            type="bar"

                        />

                        <ArgumentAxis
                            discreteAxisDivisionMode="crossLabels"
                        >
                            <Grid visible={true} />
                        </ArgumentAxis>
                        <Crosshair
                            enabled={true}
                            color="#949494"
                            width={3}
                            dashStyle="dot"
                        >
                            <Label
                                visible={true}
                                backgroundColor="#949494"
                            >
                                <Font
                                    color="#fff"
                                    size={12}
                                />
                            </Label>
                        </Crosshair>
                        <Legend
                            verticalAlignment="bottom"
                            horizontalAlignment="center"
                            itemTextPosition="bottom"
                            equalColumnWidth={true}
                        />
                        <Export enabled={true} />
                        <Tooltip enabled={true} />
                    </Chart>
                </div>
                <div className={'content-block dx-card responsive-paddings'}>
                    <h2>Tráfico</h2>
                    {bytesPerCountry === null ? null : <VectorMap
                        id="vector-map"
                        bounds={bounds}
                        onClick={clickHandler}
                    >
                        <Layer
                            dataSource={mapsData.world}
                            customize={customizeLayer(bytesPerCountry)}
                        ></Layer>
                        <Tooltip
                            enabled={true}
                            customizeTooltip={customizeTooltip(bytesPerCountry)}
                        >
                            <Border visible={true}></Border>
                            <Font color="#fff"></Font>
                        </Tooltip>
                    </VectorMap>}
                </div>
                <div className={'content-block dx-card responsive-paddings'}>
                    <h2>Alertas activas</h2>
                    <DataGrid
                        dataSource={newCustomDataSource("alerts", false)}
                        allowColumnResizing={true}
                        columnAutoWidth={true}
                        showBorders={true}
                    >
                        <ColumnChooser enabled={true} />
                        <ColumnFixing enabled={true} />
                        <Paging defaultPageSize={12} />
                    </DataGrid>
                </div>

                <div className={'content-block dx-card responsive-paddings'}>
                    <form action="block" onSubmit={(e) => handleSubmit(e, ip)}>
                        <div className="dx-field">
                            <div className="dx-field-label">A bloquear</div>
                            <div className="dx-field-value">
                                <TextBox
                                    onChange={(e) => {
                                        console.log(e.event.currentTarget.value);
                                        setIp(e.event.currentTarget.value);
                                    }}
                                >
                                    <RequiredRule message="Campo requerido" />
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-fieldset">
                            <Button
                                width="100%"
                                id="button"
                                text="Bloquear"
                                type="success"
                                useSubmitBehavior={true} />
                        </div>

                    </form>
                </div>
                <div className={'content-block dx-card responsive-paddings'}>
                    <form action="send" onSubmit={(e) => handleSubmitConfigure(e, token, username)}>
                        <div className="dx-field">
                            <div className="dx-field-label">Token</div>
                            <div className="dx-field-value">
                                <TextBox
                                    onChange={(e) => {
                                        console.log(e.event.currentTarget.value);
                                        setToken(e.event.currentTarget.value);
                                    }}
                                >
                                    <RequiredRule message="Campo requerido" />
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Nombre de usuario</div>
                            <div className="dx-field-value">
                                <TextBox
                                    onChange={(e) => {
                                        console.log(e.event.currentTarget.value);
                                        setUsername(e.event.currentTarget.value);
                                    }}
                                >
                                    <RequiredRule message="Campo requerido" />
                                </TextBox>
                            </div>
                        </div>
                        <div className="dx-fieldset">
                            <Button
                                width="100%"
                                id="button"
                                text="Configurar"
                                type="success"
                                useSubmitBehavior={true} />
                        </div>

                    </form>
                </div>
            </React.Fragment >
        </div >
    );
}


const bounds = [-180, 85, 180, -60];

const getBytesPerCountry = () => {
    const hostname = window.location.hostname;
    const backendport = '8080';
    const countryPath = 'activeflowspercountry';
    const url = `http://${hostname}:${backendport}/${countryPath}`

    return fetch(url)
        .then(response => response.json())
        .then(response => response.data)
        .then(countriesData => {
            let bytesPerCountry = {};
            countriesData.forEach(
                cd => { bytesPerCountry[country_codes[cd.country]] = cd.bytes }
            );
            return bytesPerCountry;
        });
}

const customizeLayer = (bytesPerCountry) => (elements) => {
    elements.forEach((element) => {
        if (bytesPerCountry[element.attribute('name')]) {
            element.applySettings({
                color: '#0000ff',
                hoveredColor: '#e0e000',
                selectedColor: '#008f00',
            });
        }
    });
};

const clickHandler = ({ target }) => {
    if (target) {
        target.selected(!target.selected());
    }
};
const customizeTooltip = (bytesPerCountry) => ({ attribute }) => {
    const name = attribute('name');
    const bytes = bytesPerCountry[name];
    if (bytes) {
        console.log("country name", name);
        return {
            text: `${name}: ${bytes}`,
            color: "#ff0000"
        };
    }
    return null;
};

function handleSubmit(e, ip) {
    const hostname = window.location.hostname;
    const backendport = '8080';
    const blockPath = 'blockhost';
    const url = `http://${hostname}:${backendport}/${blockPath}`

    fetch(url, { method: 'POST', body: JSON.stringify({ host: ip }) })
        .then((response) => {
            console.log(response)
            if (response.status === 200) {
                notify({
                    message: ip,
                    position: {
                        my: 'center top',
                        at: 'center top',
                    },
                }, 'success', 3000)
            } else {
                (notify({
                    message: "Could not block host",
                    position: {
                        my: 'center top',
                        at: 'center top',
                    },
                }, 'error', 3000))
            }
        })
        .catch(() => notify({
            message: "Could not block host",
            position: {
                my: 'center top',
                at: 'center top',
            },
        }, 'error', 3000));

    e.preventDefault();
}

function handleSubmitConfigure(e, token, username) {
    const hostname = window.location.hostname;
    const backendport = '8080';
    const configPath = 'configurechannel';
    const url = `http://${hostname}:${backendport}/${configPath}`

    fetch(url, { method: 'POST', body: JSON.stringify({ token: token, username: username }) })
        .then((response) => {
            console.log(response)
            if (response.status === 200) {
                notify({
                    message: "Configured!",
                    position: {
                        my: 'center top',
                        at: 'center top',
                    },
                }, 'success', 3000)
            } else {
                (notify({
                    message: "Could not configure your channel",
                    position: {
                        my: 'center top',
                        at: 'center top',
                    },
                }, 'error', 3000))
            }
        })
        .catch(() => notify({
            message: "Could not configure your channel",
            position: {
                my: 'center top',
                at: 'center top',
            },
        }, 'error', 3000));

    e.preventDefault();
}
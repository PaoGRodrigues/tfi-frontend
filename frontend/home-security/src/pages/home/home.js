import React, { useState } from 'react';
import 'devextreme/dist/css/dx.light.css';
import DataGrid, { Paging } from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { bytesPerCountry } from './geodata.js';
import TextBox from 'devextreme-react/text-box';
import Button from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';

import {
    Form,
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
            return fetch(`http://localhost:8080/${path}`)
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

    return (
        <div style={{ overflowY: 'scroll', height: 'calc(100vh - 127px)' }}>
            <React.Fragment style={{ align: 'right' }}>
                <h2>Resumen</h2>
                <div className={'content-block dx-card responsive-paddings'}>
                    <h2>Dispositivos activos</h2>
                    <DataGrid
                        dataSource={newCustomDataSource("localhosts", false)}
                        showBorders={true}
                    >
                        <Paging defaultPageSize={12} />
                    </DataGrid>
                </div>
                <div className={'content-block dx-card responsive-paddings'} style={{ overflowX: 'scroll' }}>
                    <h2>Bytes por destino</h2>
                    <Chart id="chart" width={'100%'}
                        dataSource={newCustomDataSource("traffic", true)}
                        palette="Harmony Light"
                        showBorders={true}
                    >

                        <Series
                            valueField="Bytes"
                            argumentField="Server.IP"
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
                    <VectorMap
                        id="vector-map"
                        onClick={clickHandler}
                        data={newCustomDataSource("traffic", false)}
                    >
                        <Layer
                            dataSource={mapsData.world}
                            customize={customizeLayer} >
                        </Layer>
                        <Tooltip enabled={true}
                            customizeTooltip={customizeTooltip}
                        >
                            <Border visible={true}></Border>
                            <Font color="#fff"></Font>
                        </Tooltip>
                    </VectorMap>
                </div>
                <div className={'content-block dx-card responsive-paddings'}>
                    <h2>Alertas activas</h2>
                    <DataGrid
                        dataSource={newCustomDataSource("alerts", false)}
                        showBorders={true}
                    >
                        <Paging defaultPageSize={12} />
                    </DataGrid>
                </div>

                <div className={'content-block dx-card responsive-paddings'}>
                    <form action="your-action" onSubmit={(e) => handleSubmit(e, ip)}>
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
            </React.Fragment>
        </div >
    );
}

function customizeTooltip(arg) {
    const name = arg.attribute('name');
    const bytes = bytesPerCountry[name];
    if (bytes) {
        return {
            text: `${name}: ${bytes} Mb`,
        };
    }
    return null;
}

function clickHandler({ target }) {
    if (target && bytesPerCountry[target.attribute('name')]) {
        target.selected(!target.selected());
    }
}

function customizeLayer(elements) {
    elements.forEach((element) => {
        const bytes = bytesPerCountry[element.attribute('name')];
        if (bytes) {
            element.applySettings({
                color: '#BDB76B',
                hoveredColor: '#e0e000',
                selectedColor: '#008f00',
            });
        }
    });

}

function handleSubmit(e, ip) {
    fetch(`http://localhost:8080/blockhost`, { method: 'POST', mode: "no-cors", body: JSON.stringify({ host: ip }) })
        .then((response) => {
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
        .catch(() => () => notify({
            message: "Could not block host",
            position: {
                my: 'center top',
                at: 'center top',
            },
        }, 'error', 3000));

    e.preventDefault();
}
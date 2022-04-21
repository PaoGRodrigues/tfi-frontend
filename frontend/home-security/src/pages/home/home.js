import React from 'react';
import 'devextreme/dist/css/dx.light.css';
import DataGrid from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';
import * as mapsData from 'devextreme/dist/js/vectormap-data/world.js';
import { bytesPerCountry } from './geodata.js';
import {
    Chart,
    CommonSeriesSettings,
    Series,
    ArgumentAxis,
    Grid,
    Crosshair,
    Export,
    Legend,
    Margin,
    Label,
    Font,
    Title,
    Subtitle,
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


const newCustomDataSource = (path) => {
    return new CustomStore({
        load: () => {
            return fetch(`http://localhost:8080/${path}`)
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
};
const bounds = [-180, 85, 180, -60];

export default () => {
    return (
        <div style={{ overflowY: 'scroll', height: 'calc(100vh - 127px)' }}>
            <React.Fragment style={{ align: 'right' }}>
                <h2>Resumen</h2>
                <div className={'content-block dx-card responsive-paddings'}>
                    <h2>Dispositivos activos</h2>
                    <DataGrid
                        dataSource={newCustomDataSource("devices")}
                        // defaultColumns={columns}
                        showBorders={true}
                    />
                </div>

                <div className={'content-block dx-card responsive-paddings'} style={{ overflowX: 'scroll' }}>
                    <Chart
                        dataSource={newCustomDataSource("traffic")}
                        palette="Harmony Light"
                        showBorders={true}
                    >
                        <Margin
                            left={10}
                            right={30}
                        />

                        <Series
                            valueField="Bytes"
                            argumentField="Datetime"
                            name="Destination"
                            type="spline"

                        />

                        <ArgumentAxis
                            valueMarginsEnabled={false}
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
                        <Title text="Cantidad de Bytes por destino">
                            <Subtitle text="(bytes)" />
                        </Title>
                        <Export enabled={true} />
                        <Tooltip enabled={true} />
                    </Chart>
                </div>
                <div className={'content-block dx-card responsive-paddings'}>
                    <VectorMap
                        id="vector-map"
                        onClick={clickHandler}
                    >
                        <Layer
                            dataSource={mapsData.world}
                            customize={customizeLayer}>
                        </Layer>
                        <Tooltip enabled={true}
                            customizeTooltip={customizeTooltip}
                        >
                            <Border visible={true}></Border>
                            <Font color="#fff"></Font>
                        </Tooltip>
                    </VectorMap>
                </div>
            </React.Fragment>
        </div>
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

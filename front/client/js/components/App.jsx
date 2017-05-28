import React, { Component } from 'react';
import request from 'superagent';

import '../../css/App.css';

const DataList = ({ series }) => {
    const list = series.map((point, i) => (
        <li key={i}>
            {`${point.date}: ${point.temperature} ºC | ${point.humidity}% | ${point.pressure} mBar`}
        </li>
    ));
    return <ul>{list}</ul>;
};

export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            series: []
        };

        request('/data/360')
            .then(response => this.setState({ series: response.body }))
            .catch(error => console.error(error));
    }

    render() {
        return (
            <div className="app">
                <h1>Series:</h1>
                <DataList series={this.state.series} />
            </div>
        );
    }
}

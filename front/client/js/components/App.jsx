import React, { Component } from 'react';
import request from 'superagent';

//Styles
import '../../css/App.css';

//Components
import { Chart } from './Chart.jsx';
import { LastData } from './LastData.jsx';

//Main app

export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialLoading: true,
            series: [],
            last: {
                temperature: 0,
                humidity: 0,
                pressure: 0
            }
        };

        this.fetchData(72);
    }

    fetchData(number) {
        request(`/data/${number}`)
            .then(response => {
                const cleanData = response.body.map(d => ({
                    date: new Date(d.date),
                    temperature: Number(d.temperature),
                    humidity: Number(d.humidity),
                    pressure: Number(d.pressure) / 10
                }));

                this.setState({
                    initialLoading: false,
                    series: cleanData,
                    last: cleanData[0]
                });
            })
            .catch(error => console.error(error));
    }

    updateSeries(e) {
        e.preventDefault();
        this.fetchData(e.target.value);
    }

    render() {
        return (
            !this.state.initialLoading &&
            <section className="app">
                <header>
                    <h1>Room Status</h1>
                    <LastData last={this.state.last} />
                </header>
                <Chart
                    updateSeries={this.updateSeries.bind(this)}
                    series={this.state.series}
                />

            </section>
        );
    }
}

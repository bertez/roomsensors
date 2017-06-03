import React, { Component } from 'react';
import * as d3 from 'd3';
import { flatten } from 'lodash';
import classNames from 'classnames';

const Line = ({ data, xFun, yFun, lineClass }) => {
    const path = d3.line().x(xFun).y(yFun);

    return <path d={path(data)} className={classNames(lineClass, 'line')} />;
};

const Dot = ({ data, scales, serie }) => {
    const circles = data.map((d, i) => {
        return (
            <circle
                key={i}
                cx={scales.x(d.date)}
                cy={scales.y(d[serie])}
                className={classNames(serie, 'dot')}
                r="3"
            />
        );
    });

    return <g>{circles}</g>;
};

const Series = ({ transform, data, series, scales }) => {
    const lines = Object.keys(series)
        .map(s => {
            if (series[s]) {
                const xFun = d => scales.x(d.date);
                const yFun = d => scales.y(d[s]);
                return (
                    <g key={s}>
                        <Line
                            key={s}
                            data={data}
                            xFun={xFun}
                            yFun={yFun}
                            lineClass={s}
                        />
                        <Dot
                            key={`d_${s}`}
                            data={data}
                            scales={scales}
                            serie={s}
                        />
                    </g>
                );
            }
        })
        .filter(Boolean);

    return <g transform={transform}>{lines}</g>;
};

class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: null,
            height: null,
            series: {
                temperature: true,
                humidity: true,
                pressure: false
            }
        };
    }

    getDataExtent() {
        const activeSeries = this.state.series;

        const flattenedData = flatten(
            Object.keys(activeSeries)
                .map(s => {
                    if (activeSeries[s]) {
                        return this.props.series.map(d => d[s]);
                    }
                })
                .filter(Boolean)
        );

        return d3.extent(flattenedData);
    }

    filterSeries(e) {
        e.preventDefault();
        const val = e.target.value;
        const series = this.state.series;

        if (series.hasOwnProperty(val)) {
            series[val] = !series[val];
        }

        this.setState({ series });
    }

    updateSize() {
        const wWidth = window.innerWidth;

        this.setState({
            width: wWidth,
            //height: wWidth / 1.33
            height: 600
        });
    }

    componentDidMount() {
        this.updateSize();
        window.addEventListener('resize', this.updateSize.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSize.bind(this));
    }

    render() {
        if (!this.state.width) return <div />;

        const margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        };

        const width = this.state.width - (margin.left + margin.right);
        const height = this.state.height - (margin.top + margin.bottom);

        const transform = `translate(${margin.left}, ${margin.top})`;

        const scales = {
            x: d3
                .scaleTime()
                .range([0, width])
                .domain(d3.extent(this.props.series, d => d.date)),
            y: d3.scaleLinear().range([height, 0]).domain(this.getDataExtent())
        };

        return (
            <article className="chart">
                <header>
                    <h1>Data evolution</h1>
                    <nav>
                        <div className="time">
                            <button
                                className={classNames({
                                    active: this.props.series.length === 72
                                })}
                                onClick={this.props.updateSeries}
                                value="72"
                            >
                                6 hours
                            </button>
                            <button
                                className={classNames({
                                    active: this.props.series.length === 288
                                })}
                                onClick={this.props.updateSeries}
                                value="288"
                            >
                                1 day
                            </button>
                        </div>
                        <div className="type">
                            <button
                                className={classNames({
                                    active: this.state.series.temperature
                                })}
                                onClick={this.filterSeries.bind(this)}
                                value="temperature"
                            >
                                Temperature
                            </button>
                            <button
                                className={classNames({
                                    active: this.state.series.humidity
                                })}
                                onClick={this.filterSeries.bind(this)}
                                value="humidity"
                            >
                                Humidity
                            </button>
                            <button
                                className={classNames({
                                    active: this.state.series.pressure
                                })}
                                onClick={this.filterSeries.bind(this)}
                                value="pressure"
                            >
                                Pressure
                            </button>
                        </div>
                    </nav>
                </header>

                <div className="chart-box">
                    <svg width={this.state.width} height={this.state.height}>
                        <Series
                            transform={transform}
                            data={this.props.series}
                            series={this.state.series}
                            scales={scales}
                        />
                    </svg>
                </div>

            </article>
        );
    }
}

export { Chart };

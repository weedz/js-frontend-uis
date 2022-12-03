import { Component, createRef, Fragment, RefObject } from 'react';
import Cell from './Cell';

const initialPattern: Record<number, Set<number>> = {
    45: new Set([45,46,47]),
    46: new Set([45]),
    44: new Set([46]),
};


const numRows = 100;
const numCols = 100;


const operations = [
    [0,1],
    [0,-1],
    [1,-1],
    [-1,1],
    [1,1],
    [-1,-1],
    [1,0],
    [-1,0],
];

interface State {
    running: boolean
}

export default class App extends Component<unknown, State> {
    grid: JSX.Element[][] = [];
    gridRefs: RefObject<Cell>[][] = [];

    state: State = {
        running: false
    };

    constructor(props: unknown) {
        super(props);
        for (let x = 0; x < numCols; ++x) {
            const row = [];
            const refs: RefObject<Cell>[] = [];
            for (let y = 0; y < numRows; ++y) {
                refs.push(createRef())
                row.push(<Cell alive={initialPattern[x]?.has(y)} ref={refs[y]} key={`${x}-${y}`} />);
            }
            this.gridRefs.push(refs);
            this.grid.push(row);
        }
        this.state = {
            running: false,
        }
    }
    runSimulation = () => {
        if (!this.state.running) {
            return;
        }

        const newGrid = this.grid.map((rows, x) => rows.map((col, y) => {
            return this.gridRefs[x][y].current?.state.alive as boolean;
        }));

        for (let i = 0; i < numRows; ++i) {
            for (let k = 0; k < numCols; ++k) {
                let neighbors = 0;
                for (const [x,y] of operations) {
                    const newI = i + x;
                    const newK = k + y;
                    if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                        neighbors += newGrid[newI][newK] ? 1 : 0;
                    }
                }

                if (neighbors < 2 || neighbors > 3) {
                    this.gridRefs[i][k].current?.setAlive(false);
                } else if (!newGrid[i][k] && neighbors === 3) {
                    this.gridRefs[i][k].current?.setAlive(true);
                }
            }
        }

        // setTimeout(this.runSimulation, 100);
        requestAnimationFrame(this.runSimulation);
    }
    render() {
        return (
            <Fragment>
            <button onClick={() => {
                this.setState({
                    running: !this.state.running
                }, () => {
                    if (this.state.running) {
                        this.runSimulation();
                    }
                });
            }}>{this.state.running ? "Stop" : "Start"}</button>
            <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numRows}, 20px)`
            }}>
                {this.grid}
            </div>
            </Fragment>
        )
    }
}

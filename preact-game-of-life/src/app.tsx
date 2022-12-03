import { h, Component, Fragment } from 'preact';
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

export class App extends Component<unknown, {running: boolean}> {
    grid: h.JSX.Element[][];
    constructor(props: unknown) {
        super(props);
        this.grid = [];
        for (let i = 0; i < numRows; ++i) {
            const row = [];
            for (let j = 0; j < numCols; ++j) {
                row.push(<Cell alive={initialPattern[i]?.has(j)} key={`${i}-${j}`} />);
            }
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

        const newGrid = this.grid.map(rows => rows.map(col => {
            // @ts-ignore
            return col, col.__c.state.alive as boolean;
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
                    // @ts-ignore
                    this.grid[i][k].__c.setAlive(false);
                } else if (!newGrid[i][k] && neighbors === 3) {
                    // @ts-ignore
                    this.grid[i][k].__c.setAlive(true);
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

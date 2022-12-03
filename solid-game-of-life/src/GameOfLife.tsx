import { createSignal, Index, indexArray } from 'solid-js';

type Grid = number[][];

const initialPattern: Record<number, Set<number>> = {
    45: new Set([45,46,47]),
    46: new Set([45]),
    44: new Set([46]),
};

// const initialPattern: Record<number, Set<number>> = {
//     5: new Set([3, 4, 5])
// };

const numRows = 100;
const numCols = 100;

const operations = [
    [0, 1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
];


function Cell(props: { alive: boolean }) {
    // console.log(props);
    return <div
        // onClick={toggleCell}
        style={{
            width: "20px",
            height: "20px",
            "background-color": props.alive ? "pink" : "white",
            border: "solid 1px black"
        }} />
}

export const GameOfLife = () => {
    const initialGrid = (() => {
        const rows = [];
        for (let y = 0; y < numRows; ++y) {
            const row = [];
            for (let x = 0; x < numCols; ++x) {
                row.push(initialPattern[x]?.has(y) ? 1 : 0)
            }
            rows.push(row);
        }
        return rows;
    })();

    const [grid, setGrid] = createSignal<Grid>(initialGrid, { equals: false });
    // const [testRow, setTestRow] = createSignal<number[]>([...initialGrid[4]], { equals: false });
    const [running, setRunning] = createSignal<boolean>(false);

    const runSimulation = () => {
        if (!running()) {
            return;
        }
        setGrid((currentGrid) => {
            const oldGrid = currentGrid.map((rows, y) => rows.map((col, x) => {
                return currentGrid[y][x];
            }));

            for (let y = 0; y < numRows; ++y) {
                for (let x = 0; x < numCols; ++x) {
                    let neighbors = 0;
                    for (const [opX, opY] of operations) {
                        const newY = y + opY;
                        const newX = x + opX;
                        if (newY >= 0 && newY < numRows && newX >= 0 && newX < numCols) {
                            neighbors += oldGrid[newY][newX];
                        }
                    }

                    if (neighbors < 2 || neighbors > 3) {
                        currentGrid[y][x] = 0;
                    } else if (oldGrid[y][x] === 0 && neighbors === 3) {
                        currentGrid[y][x] = 1;
                    }
                }
            }
            return currentGrid;
        });

        // setTestRow((currentRow) => {
        //     for (let x = 0; x < numCols; ++x) {
        //         currentRow[x] = currentRow[x] ? 0 : 1;
        //     }
        //     return currentRow;
        // })

        requestAnimationFrame(runSimulation);
    }

    return (
        <>
            <div>
                <button
                    onClick={() => {
                        setRunning(!running());
                        runSimulation();
                    }}
                >
                    {running() ? "Stop" : "Start"}
                </button>
            </div>

            <div style={{
                display: "grid",
                "grid-template-columns": `repeat(${numRows}, 20px)`
            }}>
                <Index each={grid()}>
                    {(row) => {
                        return indexArray(row, cell => <Cell alive={!!cell()} />);
                    }}
                </Index>
            </div>


            {/* <div style={{
                display: "grid",
                "grid-template-columns": `repeat(${numRows}, 20px)`
            }}>
                <Index each={testRow()}>
                    {(cell) => {
                        // console.log(cell);
                        return <Cell alive={!!cell()} />
                    }}
                </Index>
            </div> */}
        </>
    );
}

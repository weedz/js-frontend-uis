import { useCallback, useRef, useState } from 'preact/hooks';

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

function Cell(props: {alive:boolean}) {
    return <div
        // onClick={toggleCell}
        style={{
        width: 20,
        height: 20,
        backgroundColor: props.alive ? "pink" : undefined,
        border: "solid 1px black"
    }} />
}

export function App() {
    const [grid, setGrid] = useState(() => {
        const rows = [];
        for (let y = 0; y < numRows; ++y) {
            const row = [];
            for (let x = 0; x < numCols; ++x) {
                row.push(initialPattern[x]?.has(y) ? 1 : 0)
            }
            rows.push(row);
        }
        return rows;
    });

    const [running, setRunning] = useState(false);

    const runningRef = useRef(running);
    runningRef.current = running;

    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return;
        }

        setGrid((oldGrid) => {
            const newGrid = oldGrid.map((rows, y) => rows.map((col, x) => {
                return col;
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
                        newGrid[y][x] = 0;
                    } else if (oldGrid[y][x] === 0 && neighbors === 3) {
                        newGrid[y][x] = 1;
                    }
                }
            }
            return newGrid
        });

        // setTimeout(runSimulation, 100);
        requestAnimationFrame(runSimulation);
    }, []);

    return (
        <>
        <button onClick={() => {
            setRunning(!running);
            if (!running) {
                runningRef.current = true;
                runSimulation();
            }
        }}>{running ? "Stop" : "Start"}</button>
        <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numRows}, 20px)`
        }}>
            {grid.map((rows, y) => 
                rows.map((col, x) => (
                    <Cell alive={!!col} key={`${x}-${y}`} />
                )))}
        </div>
        </>
    );
}

import { h } from "preact";
import { PureComponent } from "preact/compat"

interface Props {
    alive: boolean
}

export default class Cell extends PureComponent<Props, {alive: boolean}> {
    state = {
        alive: this.props.alive
    };

    toggleCell = () => {
        this.setAlive(!this.state.alive);
    }
    setAlive(alive: boolean) {
        this.setState({
            alive
        });
    }
    render() {
        return (
            <div
                // onClick={this.toggleCell}
                style={{
                width: 20,
                height: 20,
                backgroundColor: this.state.alive ? "pink" : undefined,
                border: "solid 1px black"
            }} />
        )
    }
}

import { render } from 'solid-js/web';

import { GameOfLife } from './GameOfLife';

render(() => <GameOfLife />, document.getElementById('root') as HTMLElement);

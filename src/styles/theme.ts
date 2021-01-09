import { orange } from '@material-ui/core/colors';
import { PaletteOptions } from '@material-ui/core/styles/createPalette';

interface Palette {
    light: PaletteOptions;
    dark: PaletteOptions;
}

export const palette: Palette = {
    light: {
        type: 'light',
        primary: {
            main: orange["A700"]
        },
        secondary: {
            main: '#007fab'
        }
    },
    dark: {
        type: 'dark',
        primary: {
            main: orange[900]
        },
        secondary: {
            main: '#54aedd'
        },
        background: {
            default: 'black'
        }
    }
};

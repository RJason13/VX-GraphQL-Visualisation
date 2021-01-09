// import original module declarations
import { Theme } from '@material-ui/core';
import 'styled-components';

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme extends Theme {}
}

import { Theme } from '@material-ui/core';

export const drawerWidth = (theme: Theme, open: boolean) => theme.spacing(open ? 30 : 7, '');
export const navbarHeight = (theme: Theme) => theme.spacing(6, '');

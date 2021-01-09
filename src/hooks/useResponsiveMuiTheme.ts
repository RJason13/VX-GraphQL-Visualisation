import { responsiveFontSizes, createMuiTheme } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import { useMemo } from 'react';

const useResponsiveMuiTheme = () => {
    return useMemo(() => {
        return responsiveFontSizes(
            createMuiTheme({
                palette: {
                  type: 'light',
                  primary: {
                      main: orange["A700"]
                  },
                  secondary: {
                      main: '#007fab'
                  }
              },
                breakpoints: {
                  values: {
                    xs: 0,
                    sm: 688,
                    md: 992,
                    lg: 1312,
                    xl: 1920
                  }
                }
            })
        );
    }, []);
}

export default useResponsiveMuiTheme;
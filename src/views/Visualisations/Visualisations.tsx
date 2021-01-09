import React, { FC } from "react";
import { Redirect, Route, Switch as RouteSwitch, useRouteMatch } from "react-router-dom";
import routes from './routes';
import PageNavbar from "components/PageNavbar";
import { Box, Container, Link, Typography } from "@material-ui/core";
import styled from "styled-components";

// sub components

const StyledBox = styled(Box)`
    & > section:nth-child(even) {
        background-color: ${({theme})=>theme.palette.type === 'light' ? '#ccc': '#555'};
    }
`;

// main component
const Visualisations: FC = () => {
    const { path, url: baseUrl } = useRouteMatch();
    return (
        <>
            <PageNavbar links={ routes.map(({ uri, icon, title }) => ({ uri: `${baseUrl}${uri}`, icon, title })) } />
            <RouteSwitch>
                <Redirect from={`${path}/`} to={`${path}`} exact strict/>
                <Route path={`${path}`} strict exact>
                    <StyledBox>
                        <section>
                            <Container>
                                <Typography variant="h4">
                                    Chart 1 Title
                                </Typography>
                                <Typography variant="body1">
                                    Chart 1 Description
                                </Typography>
                            </Container>
                        </section>
                        <section>
                            <Container>
                                <Typography variant="h4">
                                    Chart 2 Title
                                </Typography>
                                <Typography variant="body1">
                                    Chart 2 Description
                                </Typography>
                            </Container>
                        </section>
                    </StyledBox>
                </Route>
                {
                    routes.map(({ uri, component }) => {
                        const Child = component;
                        return (
                            <Route path={`${path}${uri}`} strict exact key={uri}>
                                <Child />
                            </Route>
                        );
                    }) 
                }
            </RouteSwitch>
        </>
    );
}
export default Visualisations;
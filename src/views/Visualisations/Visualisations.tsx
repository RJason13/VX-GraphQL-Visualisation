import React, { FC, Suspense } from "react";
import { NavLink, Redirect, Route, Switch as RouteSwitch, useRouteMatch } from "react-router-dom";
import routes from './routes';
import PageNavbar from "components/PageNavbar";
import { Box, Button, Container, Typography } from "@material-ui/core";
import styled from "styled-components";
import Loading from "components/Loading";
import { ArrowRightAlt } from "@material-ui/icons";

// sub components

const StyledBox = styled(Box)`
    & > section:nth-child(even) {
        background-color: ${({theme})=>theme.palette.type === 'light' ? '#eee': '#555'};
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
                            <Container maxWidth="md">
                                <Box py={2}>
                                    <Typography variant="h4">
                                        Monthly Top 3 Topics
                                    </Typography>
                                </Box>
                                <Box py={1}>
                                    <Typography variant="body1">
                                    The first visualization shows which topics are most popular in each month within Grouped Bar chart.
                                    </Typography>
                                </Box>
                                <Box pb={2}>
                                    <NavLink to={`${baseUrl}/monthly-top-3-topics`}>
                                        <Button variant="outlined" color="secondary" endIcon={<ArrowRightAlt />} style={{textDecoration: 'none'}}>
                                            First Visualisation
                                        </Button>
                                    </NavLink>
                                </Box>
                            </Container>
                        </section>
                        <section>
                            <Container maxWidth="md">
                                <Box py={2}>
                                    <Typography variant="h4">
                                        Author's Profile
                                    </Typography>
                                </Box>
                                <Box py={1}>
                                    <Typography variant="body1">
                                        The second visualisation shows insight about an author's topics interests. There are 2 charts visualised, rank of topic's tendency in a bar chart and topic scores over time in line chart.
                                    </Typography>
                                </Box>
                                <Box pb={2}>
                                    <NavLink to={`${baseUrl}/author-profile`}>
                                        <Button variant="outlined" color="secondary" endIcon={<ArrowRightAlt />} style={{textDecoration: 'none'}}>
                                            Second Visualisation
                                        </Button>
                                    </NavLink>
                                </Box>
                            </Container>
                        </section>
                    </StyledBox>
                </Route>
                {
                    routes.map(({ uri, component }) => {
                        const Child = component;
                        return (
                            <Route path={`${path}${uri}`} strict exact key={uri} component={() => {
                                return <Suspense fallback={<Loading />} ><Child /></Suspense>;
                              }}>
                            </Route>
                        );
                    }) 
                }
            </RouteSwitch>
        </>
    );
}
export default Visualisations;
import React, { FC, Suspense } from "react";
import { Redirect, Route, Switch as RouteSwitch, useRouteMatch } from "react-router-dom";
import routes from './routes';
import PageNavbar from "components/PageNavbar";
import { Box, Container, Typography } from "@material-ui/core";
import styled from "styled-components";
import Loading from "components/Loading";

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
                                    Monthly Top 3 Topics
                                </Typography>
                                <Typography variant="body1">
                                   The most prevalent 3 topics for each month are visualised within ... chart.
                                </Typography>
                            </Container>
                        </section>
                        <section>
                            <Container>
                                <Typography variant="h4">
                                    Author's Profile
                                </Typography>
                                <Typography variant="body1">
                                    Aggregate a large-enough number of posts by their author.
                                    Use this information to create interesting user profiles for each of the authors posting on our fictitious blog.
                                    For example, you could explore which topics each author tends to post about the most, what their posting frequency looks like, or perhaps even explore how their topics of interest have changed across time.
                                </Typography>
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
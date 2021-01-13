import React, { FC } from "react";
import { Box, Button, Container, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { ArrowRightAlt } from "@material-ui/icons";

const Home: FC = () => {
    return (
        <Container maxWidth="md">
          <Box component={"section"} py={3}>
            <Box py={4} textAlign="center">
              <Typography variant="h3">
                VX GraphQL Visualisation
              </Typography>
            </Box>
            <Box py={5} textAlign="left">
              <Typography variant="body1">
                Within this project, I experimented with modern web libraries; such as GraphQL and VX &amp; D3; to provide visualisation of fictitious data.
              </Typography>
            </Box>
            <Box pb={2}>
                <NavLink to="/visualisations">
                    <Button variant="outlined" color="secondary" endIcon={<ArrowRightAlt />} style={{textDecoration: 'none'}}>
                        Visualisations
                    </Button>
                </NavLink>
            </Box>
          </Box>
        </Container>);
}
export default Home;
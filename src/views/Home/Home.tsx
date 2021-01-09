import React, { FC } from "react";
import { Box, Container, Typography } from "@material-ui/core";

const Home: FC = () => {
    return (
        <Container maxWidth="md">
          <Box component={"section"} py={5}>
            <Box py={5} textAlign="center">
              <Typography variant="h2">
                Home Page
              </Typography>
            </Box>
          </Box>
        </Container>);
}
export default Home;
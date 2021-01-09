import { CircularProgress, Grid, Zoom } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";

const StyledGrid = styled(Grid)`
    margin: auto;
    position: absolute;
    height: 100%;
`;


const Loading: FC = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true)
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, [])

    return (
        <StyledGrid container justify="center" alignItems="center">
            <Zoom in={show}>
                <CircularProgress />
            </Zoom>
        </StyledGrid>
    );
}

export default Loading;
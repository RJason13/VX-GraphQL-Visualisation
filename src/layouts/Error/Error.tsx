import { Container } from "@material-ui/core";
import { FC } from "react";
import { NavLink } from "react-router-dom";

type SiteError = {
    statusCode: number
}

type ErrorProps = {
    error: SiteError
}

enum ErrorCode {
    NotFound = 404
}

const errorMessages: {[k: number]: string } = {
    [ErrorCode.NotFound]: "404 Not Found"
}

const Error: FC<ErrorProps> = ({ error: { statusCode } }) => {
    let message = errorMessages[statusCode] || 'An error occurred';

    return (
        <Container maxWidth="md">
            <h1>
                {message}
            </h1>
            <NavLink to="/">
                Home Page
            </NavLink>
        </Container>
    );
}

export default Error;
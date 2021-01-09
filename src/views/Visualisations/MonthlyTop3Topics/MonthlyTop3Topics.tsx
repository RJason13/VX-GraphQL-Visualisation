import { Container } from "@material-ui/core";
import { useAllPostsQuery } from "graphql/types-and-hooks";
import React, { FC } from "react";

const ChartExample: FC = () => {
    const {loading, error, data} = useAllPostsQuery({ variables: { count: 5000 }});
    console.log(data)
    return (
        <Container maxWidth="md">
            <div>Coming Soon</div>
        </Container>
    );
}
export default ChartExample;
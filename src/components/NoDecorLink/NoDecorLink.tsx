import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NoDecorLink = styled(NavLink)`
    -webkit-tap-highlight-color: transparent;
    text-decoration: none;
`;

export default NoDecorLink;
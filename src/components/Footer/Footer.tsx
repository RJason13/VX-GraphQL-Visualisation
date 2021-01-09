import { Container, Grid, Link, Typography, useMediaQuery } from "@material-ui/core";
import React from "react";
import styled, { css, DefaultTheme } from "styled-components";
import { ReactComponent as LinkedInLogo } from 'assets/img/third-party/linkedIn-logo.svg';
import { ReactComponent as TwitterLogo } from 'assets/img/third-party/twitter-logo.svg';
import { ReactComponent as GithubLogo } from 'assets/img/third-party/github-logo.svg';


const StyledFooter = styled.footer`
    min-height: ${({ theme }) => theme.spacing(4)}px;

    padding: ${({ theme }) => theme.spacing(1.5, 2)};
    background: ${({ theme }) => theme.palette.grey[900]};
    color:rgb(139, 148, 158);
`;

const LogoMixin = css`
    vertical-align: text-bottom;
    height: 1rem;
    width: 1rem;

    transition: fill 0.2s, background 0.2s;
    fill:rgb(139, 148, 158);
`;

const StyledLink = styled(Link)`
    -webkit-tap-highlight-color: transparent;
    color:rgb(139, 148, 158);
    &:hover {
        text-decoration: none;
    }
`;

const UnderlineOnHoverSpan = styled.span`
    transition: color 0.2s;
    
    ${StyledLink}:hover & {
        color:white;
        text-decoration: underline;
    }
`;

const StyledLinkedInLogo = styled(LinkedInLogo)`
    border-radius: 3px;
    ${LogoMixin}

    background-color: transparent;
    &:hover {
        color: #0073b1;
        background-color: white;
    }
`;

const StyledGithubLogo = styled(GithubLogo)`
    ${LogoMixin}

    &:hover {
        fill: white;
    }
`;

const StyledTwitterLogo = styled(TwitterLogo)`
    ${LogoMixin}
    &:hover {
        fill: rgba(29,161,242);
    }
`;

// main component

const Footer = () => {
    const isXsDown = useMediaQuery((theme: DefaultTheme) => theme.breakpoints.down('xs'));

    return (
        <StyledFooter>
            <Container maxWidth="md">
                <Grid container justify="space-between" alignItems="center" direction={isXsDown ? "column-reverse" : "row"} spacing={isXsDown ? 2 : 0}>
                    <Grid item>
                        <Typography variant="caption" align="center" display={isXsDown ? "block" : "inline"}>
                            Copyright &copy; 2021&nbsp;
                            <StyledLink href="mailto: s.richard.jason@gmail.com">
                                <UnderlineOnHoverSpan>Richard Jason</UnderlineOnHoverSpan>
                            </StyledLink>.
                        </Typography>
                        {!isXsDown && <>&nbsp;</>}
                        <Typography variant="caption" align="center" display={isXsDown ? "block" : "inline"}>
                            Built with&nbsp;
                            <StyledLink href="https://create-react-app.dev" target="_blank">
                                <UnderlineOnHoverSpan>Create React App</UnderlineOnHoverSpan>
                            </StyledLink>
                            ,&nbsp;
                            <StyledLink href="https://www.apollographql.com" target="_blank">
                                <UnderlineOnHoverSpan>Apollo GraphQL</UnderlineOnHoverSpan>
                            </StyledLink>
                            , and&nbsp;
                            <StyledLink href="https://vx-demo.now.sh" target="_blank">
                                <UnderlineOnHoverSpan>VX</UnderlineOnHoverSpan>
                            </StyledLink>.
                        </Typography>
                    </Grid>
                    <Grid item className="MuiTypography-caption">
                        <StyledLink href="https://www.linkedin.com/in/s-richard-jason" target="_blank"><StyledLinkedInLogo /></StyledLink>&nbsp;&nbsp;
                        <StyledLink href="https://github.com/RJason13" target="_blank"><StyledGithubLogo /></StyledLink>&nbsp;&nbsp;
                        <StyledLink href="https://twitter.com/s_richard_jason" target="_blank"><StyledTwitterLogo /></StyledLink>
                    </Grid>
                </Grid>
            </Container>
        </StyledFooter>
    );
}

export default Footer;
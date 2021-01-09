import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header';
import styled, { createGlobalStyle, css } from 'styled-components';
import { navbarHeight } from 'utils/ui';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'state/store';
import { headerExpandSelector } from 'state/header';
import Footer from 'components/Footer';

// sub component

const FitScreenMixin = css<{ active: boolean }>`
    height: ${({ active }) => active ? "100% !important" : null};
    overflow: ${({ active }) => active ? "hidden !important" : null};
`;

const FitScreenStyle = createGlobalStyle<{ active: boolean }>`
    html {
        ${FitScreenMixin}
        overflow-y: ${({ active }) => active ? "scroll !important" : null};
    }
    body {
        ${FitScreenMixin}
    }
`;

const StyledNavbar = styled(Header)`
    z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`;

const StyledContent = styled.div`
    overflow: auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    &::before {
        content: ' ';
        height: ${({ theme }) => navbarHeight(theme)};
    }
`;

const StyledMain = styled.main`
    flex-grow: 1;
    flex-shrink: 1;
    position: relative;
`;

const StyledFooter = styled(Footer)`
    flex-grow: 0;
    flex-shrink: 0;
`;

// main component
let propTypes = {
    children: PropTypes.node.isRequired
};

const mapStateToProps = (state: RootState) => ({ 
    headerExpand: headerExpandSelector(state)
});

const connector = connect(mapStateToProps);

type LayoutProps = ConnectedProps<typeof connector> & {
    className?: string;
    children: React.ReactNode;
};

const DefaultLayout: FC<LayoutProps> = ({ headerExpand, children }) => {

    return (
        <>
            <FitScreenStyle active={headerExpand} />
            <StyledNavbar />
            <StyledContent>
                <StyledMain>{children}</StyledMain>
                <StyledFooter />
            </StyledContent>
        </>
    );
};

DefaultLayout.propTypes = propTypes;

export default connector(DefaultLayout);

import React, { FC } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { headerExpandSelector, toggleHeaderExpand } from 'state/header';
import { RootState } from 'state/store';
import styled, { css } from 'styled-components';
import { StyledNavLink } from './BaseToolbar';

// sub components
const StyledSpan = styled.span`
    display: inline-flex;
    position: relative;
    width: 1em;
    height: 1em;
    font-size: 1.25rem;
`;

const RotateGroup = styled.span<{ $active: boolean, $rotation: number }>`
    position: absolute;
    height: 100%;
    width: 100%;

    transform: rotate(${({$rotation})=>$rotation}deg);
    transform-origin: 50% 50%;
    transition: transform 0.1596s cubic-bezier(0.52, 0.16, 0.52, 0.84) 0.1008s;
    transition: ${({ $active }) => ($active ?
        'transform .3192s cubic-bezier(0.04, 0.04, 0.12, 0.96) .1008s' :
        'transform .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96)')};
`;

const SlashMixin = css<{ $active: boolean }>`
    position: absolute;
    display: inline-flex;
    width: 72%;
    left: 50%;
    background-color: white;
    height: 1px;

    transform: translate(-50%, -50%);
    transition: ${({ $active }) => ($active ?
        'top .1806s cubic-bezier(0.04, 0.04, 0.12, 0.96)' :
        'top .1596s cubic-bezier(0.52, 0.16, 0.52, 0.84) .1008s')};
`;

const BackSlash = styled.span<{ $active: boolean }>`
    ${SlashMixin}
    top: ${({$active})=>$active ? '50%' : '35%' };
`;

const ForwardSlash = styled.span<{ $active: boolean }>`
    ${SlashMixin}
    top: ${({$active})=>$active ? '50%' : '65%' };
`;

// main component
const mapStateToProps = (state: RootState) => ({
    expand: headerExpandSelector(state)
});

const mapDispatchToProps = {
    toggleHeaderExpand
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type HeaderExpanderProps = ConnectedProps<typeof connector> & { className?: string; };

const HeaderExpander: FC<HeaderExpanderProps> = ({ expand, toggleHeaderExpand }) => {

    const onClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        toggleHeaderExpand();
    }
    
    const backSlashRotation = (expand ? 45 : 0);
    const forwardSlashRotation = (expand ? -45 : 0);
    return (
        <StyledNavLink to="" onClick={onClick} exact>
            <StyledSpan>
                <RotateGroup $active={expand} $rotation={backSlashRotation}>
                    <BackSlash $active={expand} />
                </RotateGroup>
                <RotateGroup $active={expand} $rotation={forwardSlashRotation} >
                    <ForwardSlash $active={expand} />
                </RotateGroup>
            </StyledSpan>
        </StyledNavLink>
    );
};

export default connector(HeaderExpander);
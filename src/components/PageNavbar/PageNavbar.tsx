import { Toolbar, Typography, SvgIcon, Avatar, Box, ButtonBase, Fade, SvgIconTypeMap } from '@material-ui/core';
import React, { FC, RefObject, SVGProps, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import NoDecorLink from 'components/NoDecorLink';
import styled, { css } from 'styled-components';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

// sub components
const NonWrappingToolbar = styled(Toolbar)<{ component: keyof HTMLElementTagNameMap }>`
    align-items: flex-start;
    overflow: hidden;
    height: 5.5em;
    padding: 0;
    backdrop-filter: saturate(1.8) blur(${({theme}) => theme.spacing(2.5)}px);
    background-color: ${({theme}) => theme.palette.type === 'light' ? 'rgba(245, 245, 247, 0.6)' : 'rgba(29, 29, 31, 0.6)'};
    transition:
        background-color.5s .2s cubic-bezier(0.52, 0.16, 0.24, 1),
        color .5s .2s cubic-bezier(0.52, 0.16, 0.24, 1), 
        filter .5s .2s cubic-bezier(0.52, 0.16, 0.24, 1), 
        text-shadow .5s .2s cubic-bezier(0.52, 0.16, 0.24, 1),
        border-color .5s .2s cubic-bezier(0.52, 0.16, 0.24, 1);

`;

const StyledContainer = styled(Box)<{ component: keyof HTMLElementTagNameMap, ref: RefObject<HTMLUListElement> }>`
    flex: 1 1 auto;
    margin: 0 2.5em;

    overflow-y: hidden;
    overflow-x: auto;
    text-align: center;
    white-space: nowrap;
    padding-top: 1em;
    padding-bottom: 4em;
    scroll-behavior: smooth;

    & > li {
        list-style: none;
        display: inline-flex;
        padding: 0 1rem;
    }
`;

const PageNavbarLink = styled(NoDecorLink)`
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${({theme}) => theme.palette.type === 'light' ? '#1d1d1f' : '#f5f5f7'};

    & > svg {
        margin-bottom: 0.75rem;
    }
`;

const ScrollControlMixin = css`
    position: absolute;
    top: 4px;
    bottom: 4px;
    width: 2.5em;
    border-style: solid;
    border-color: ${({theme}) => theme.palette.type === 'light' ? '#d2d2d7' : '#424245'};

    ${NonWrappingToolbar} & {
        transition: border-color .5s .2s cubic-bezier(0.52, 0.16, 0.24, 1);
    }
`;

const LeftScrollControl = styled(ButtonBase)`
    ${ScrollControlMixin}
    left: 0;
    border-right-width: 1px;
`;

const RightScrollControl = styled(ButtonBase)`
    ${ScrollControlMixin}
    right: 0;
    border-left-width: 1px;
`;

// main component

export type PageNavbarPropLink = {
    uri: string;
    icon?: FC<SVGProps<SVGSVGElement> & { title?: string | undefined }> | OverridableComponent<SvgIconTypeMap<{}, "svg">> | null;
    title: string;
}

type PageNavbarProps = {
    links: PageNavbarPropLink[]
}

const PageNavbar: FC<PageNavbarProps> = ({ links }) => {

    const [moreLeft, setMoreLeft] = useState(false);
    const [moreRight, setMoreRight] = useState(false);
    const ref = useRef<HTMLUListElement>(null);

    const onLeftControlClick = () => {
        const el = ref.current as HTMLUListElement;
        const { clientWidth, scrollLeft, childNodes } = el;
        const marginLeft = parseFloat(getComputedStyle(ref.current as Element).marginLeft);
        // find cropped-left child
        let i: number;
        let croppedLeftChild = childNodes[0] as HTMLLIElement;
        for (i = 0; i < childNodes.length; i++) {
            if (croppedLeftChild.offsetLeft - marginLeft + croppedLeftChild.clientWidth > scrollLeft) break;
            croppedLeftChild = childNodes[i] as HTMLLIElement;
        }
        let childToScroll = (childNodes[i-1] || childNodes[0]) as HTMLLIElement;
        for (let j = i - 1;j >= 0;j--) {
            const currentChild = childNodes[j] as HTMLLIElement;
            if (currentChild.offsetLeft < croppedLeftChild.offsetLeft + croppedLeftChild.clientWidth - clientWidth) break;
            childToScroll = currentChild;
        }
        el.scrollLeft = childToScroll.offsetLeft - marginLeft;
    };

    const onRightControlClick = () => {
        const el = ref.current as HTMLUListElement;
        const { clientWidth, scrollLeft, childNodes } = el;
        const marginLeft = parseFloat(getComputedStyle(ref.current as Element).marginLeft);
        // find cropped-right child
        let croppedRightChild = childNodes[0] as HTMLLIElement;
        for (let i = 0; i < childNodes.length; i++) {
            croppedRightChild = childNodes[i] as HTMLLIElement;
            if (croppedRightChild.offsetLeft - marginLeft + croppedRightChild.clientWidth > scrollLeft + clientWidth) break;
        }
        el.scrollLeft = croppedRightChild.offsetLeft - marginLeft;
    };

    const showHideControls = () => {
        const { clientWidth, scrollWidth, scrollLeft } = ref.current as HTMLUListElement;
        setMoreLeft(scrollLeft !== 0);
        setMoreRight(scrollLeft + clientWidth < scrollWidth);
    }

    const onScroll = useCallback(() => {
        showHideControls();
    }, []);

    useEffect(() => {
        showHideControls();
        const onResize = () => {
            showHideControls();
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, []);

    return (
        <NonWrappingToolbar component="nav">
            <StyledContainer component="ul" ref={ref} onScroll={onScroll}>
                {
                    links.map(({ uri, icon, title }) => {
                        return (
                            <Box component="li" key={uri}>
                                <PageNavbarLink to={uri}>
                                    { icon ? <SvgIcon fontSize="small" component={icon} /> : <Avatar />}
                                    <Typography variant='caption' children={title} />
                                </PageNavbarLink>
                            </Box>
                        );
                    })
                }
            </StyledContainer>
            <Box>
                <Fade in={moreLeft}>
                    <div>
                        <LeftScrollControl onClick={onLeftControlClick} children={<ChevronLeft />} />
                    </div>
                </Fade>
                <Fade in={moreRight}>
                    <div>
                        <RightScrollControl onClick={onRightControlClick} children={<ChevronRight />} />
                    </div>
                </Fade>
            </Box>
        </NonWrappingToolbar>
    );
}

PageNavbar.propTypes = {
    links: PropTypes.arrayOf(PropTypes.shape({
        uri: PropTypes.string.isRequired,
        icon: PropTypes.any,
        title: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default PageNavbar;
import { Avatar, Box, Button, CircularProgress, Container, Grid, Toolbar, Typography, useMediaQuery } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { ParentSize } from "@vx/responsive";
import AuthorSelectionDialog from "components/AuthorSelectionDialog";
import { AuthorData } from "components/AuthorSelectionDialog/AuthorSelectionDialog"
import HorizontalBarChart from "components/HorizontalBarChart";
import LineChart from "components/LineChart";
import { rollups } from "d3-array";
import { timeFormat, timeParse } from "d3-time-format";
import { useAllPostsQuery } from "graphql/types-and-hooks";
import { fromPairs, omit, orderBy, sortBy, toPairs } from "lodash";
import React, { FC, useMemo, useState } from "react";
import styled, { DefaultTheme } from "styled-components";

type TopicsMap = {
    [label: string]: number
}

type MonthData = {
    group: string;
    [key: string]: number | string;
}

type AuthorsData = {
    [id: string]: {
        author: AuthorData;
        data: MonthData[]
    }
}

type TopicDataEntry = {
    group: string;
    score: number;
}

// sub components
const StyledContainer = styled(Container)`
    text-align: center;
`;

const StyledToolbar = styled(Toolbar)`
    justify-content: center;
`;

const StyledButtonWrapper = styled.div`
    position: relative;
`;

const StyledButtonCircularProgress = styled(CircularProgress)`
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -12px;
    margin-left: -12px;
`;

// main component

const parseDate = timeParse('%b %Y');
const format = timeFormat('%b %Y');
const formatDate = (date: Date) => format(date);
const getGroup = (d: TopicDataEntry) => d.group;
const getValue = (d: TopicDataEntry) => d.score;

const AuthorProfile: FC = () => {
    const [authorId, setAuthorId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const {loading, error, data: allPostsData} = useAllPostsQuery({ variables: { count: 5000 }});
    // TODO: use a proper data changed indicator
    const data = useMemo(() => {
        if (!allPostsData) return null;
        if (!allPostsData.allPosts) return {};
        const posts = allPostsData.allPosts;
        const authorsArr = rollups(posts, (authorPosts) => {
            const monthData = rollups(authorPosts, 
                authorMonthPosts => {
                    const topics: TopicsMap = {};
                    authorMonthPosts.forEach(post => {
                        post?.likelyTopics?.forEach(topic => {
                            const label = topic?.label as string;
                            topics[label] = topics[label] || 0;
                            topics[label] += topic?.likelihood as number;
                        });
                    });

                    return topics;
                }, 
                post => formatDate(new Date(parseInt(post?.createdAt as string)))
            );
        
            return {
                author: omit(authorPosts[0]?.author, "__typename"),
                data: monthData
                    .sort((a,b) => (parseDate(a[0]) as Date).getTime() - (parseDate(b[0]) as Date).getTime())
                    .map(x => ({ group: x[0], topics: x[1] }))
            };
        }, (post) => post?.author.id);

        return fromPairs(authorsArr) as AuthorsData;
    }, [allPostsData]);

    const authors = useMemo(() => data ? toPairs(data).map(x => x[1].author) : [], [data]);
    const currentAuthor = useMemo(() => ((data && authorId && data[authorId]) ? data[authorId].author : null), [authorId, data]);
    const authorData = useMemo(() => data && authorId ? data[authorId].data : [], [authorId, data]);
    const isXsDown = useMediaQuery((theme: DefaultTheme) => theme.breakpoints.down('xs'));

    const topicsMonthlyData = useMemo(() => {
        const topics: { [topic: string]: TopicDataEntry[] } = {};
        authorData.forEach((monthData) => {
            Object.entries(monthData.topics).forEach(([topic, value]) => {
                topics[topic] = topics[topic] || [];
                topics[topic].push({ group: monthData.group, score: value});
            });
        });
        return topics;
    }, [authorData]);
    
    const overallTopicsData = useMemo(() => orderBy(
        Object.entries(topicsMonthlyData).map(([topic, monthlyValues]) => ({ group: topic, score: monthlyValues.reduce((t,x) => t + x.score,0) })),
        ['score'],
        ['desc']
    ), [topicsMonthlyData]);
    const colorDomain = useMemo(() => overallTopicsData.map(getGroup), [overallTopicsData])

    const handleClickOpen = () => {
      setDialogOpen(true);
    };
  
    const handleClose = (value: string | null) => {
      setDialogOpen(false);
      setAuthorId(value);
    };

    console.log(colorDomain)
    return (
        <StyledContainer maxWidth="md">
            <Box py={2}>
                <Typography variant="h5">
                    Author's Profile
                </Typography>
            </Box>
            <StyledToolbar>
                <StyledButtonWrapper>
                    <Button
                        variant="outlined"
                        color="primary"
                        disabled={loading}
                        onClick={handleClickOpen}
                        startIcon={currentAuthor ? <Avatar src={currentAuthor.avatar} /> : null}
                        endIcon={dialogOpen ? <ExpandLess /> : <ExpandMore />}>
                        { currentAuthor ? `${currentAuthor.firstName} ${currentAuthor.lastName}` : "Choose Author" }
                    </Button>
                    {loading && <StyledButtonCircularProgress size={24} /> }
                    <AuthorSelectionDialog data={sortBy(authors, ['firstName', 'lastName'])} selectedValue={authorId} open={dialogOpen} onClose={handleClose} />
                </StyledButtonWrapper>
            </StyledToolbar>
            {loading ? 
                <Box py={4}><CircularProgress /></Box> :
                (error ? 
                    <Typography variant="h6">Something wrong has happened</Typography> :
                    (!authorData || authorData.length === 0 ? 
                        <Typography variant="h6">No data</Typography> :
                        <Grid container direction={isXsDown ? 'column' : 'row'} spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <Typography variant='h6'>
                                    Overall Topics Rank
                                </Typography>
                                <ParentSize debounceTime={10}>
                                    {({ width: visWidth }) => (
                                        <HorizontalBarChart<TopicDataEntry>
                                            width={visWidth}
                                            height={authorData.length * 30} 
                                            getGroup={getGroup}
                                            getValue={getValue}
                                            data={overallTopicsData}
                                            colorDomain={colorDomain} />
                                     )}
                                </ParentSize>
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <Typography variant='h6'>
                                    Topic Scores Over Time
                                </Typography>
                                <ParentSize debounceTime={10}>
                                    {({ width: visWidth }) => (
                                        <LineChart<TopicDataEntry>
                                            width={visWidth}
                                            height={authorData.length * 30}  
                                            getX={getGroup}
                                            getY={getValue}
                                            data={topicsMonthlyData}
                                            colorDomain={colorDomain} />
                                     )}
                                </ParentSize>
                            </Grid>
                        </Grid>
                    )
                )
            }
        </StyledContainer>
    );
}
export default AuthorProfile;
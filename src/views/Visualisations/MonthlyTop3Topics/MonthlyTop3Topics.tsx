import { Box, CircularProgress, Container, Typography } from "@material-ui/core";
import HorizontalBarGroupChart from "components/HorizontalBarGroupChart";
import { useAllPostsQuery } from "graphql/types-and-hooks";
import React, { FC, useMemo } from "react";
import styled from "styled-components";
import { timeFormat, timeParse } from "d3-time-format";
import { range, rollups } from 'd3-array';
import { uniq } from "lodash";
import { GroupData } from "components/HorizontalBarGroupChart/HorizontalBarGroupChart";
import { ParentSize } from "@vx/responsive";

type TopicsMap = {
    [label: string]: number
}

const StyledContainer = styled(Container)`
    text-align: center;
`;

const parseDate = timeParse('%b %Y');
const format = timeFormat('%b %Y');
const formatDate = (date: Date) => format(date);
// TODO: add comments to codes
const ChartExample: FC = () => {
    const {loading, error, data: allPostsData} = useAllPostsQuery({ variables: { count: 10000 }});

    // TODO: use a proper data changed indicator
    const data = useMemo(() => {
        if (!allPostsData) return null;
        if (!allPostsData.allPosts) return [];
        const posts = allPostsData.allPosts;
        const data = rollups(posts, 
            groupedPosts => {
                const topics: TopicsMap = {};
                groupedPosts.forEach(post => {
                    post?.likelyTopics?.forEach(topic => {
                        const label = topic?.label as string;
                        topics[label] = topics[label] || 0;
                        topics[label] += topic?.likelihood as number;
                    });
                });

                return Object.entries(topics)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0,3)
                    .map(x => ({ label: x[0], score: x[1] }));
            }, 
            post => formatDate(new Date(parseInt(post?.createdAt as string)))
        );
        return data
            .sort((a,b) => (parseDate(b[0]) as Date).getTime() - (parseDate(a[0]) as Date).getTime())
            .map(x => ({ group: x[0], topics: x[1] }));
    }, [allPostsData]);
    
    const scoreMax = data ? data.reduce((t, monthData) => monthData.topics.reduce((t, topicsData) => topicsData.score > t ? topicsData.score : t, t), 0) : 0;
    const labelMap = data ? data.map(x => x.topics.map(x => x.label)) : [];
    const colorDomain = data ? uniq(data.map(x => x.topics).flat().map(x => x.label)) : [];

    return (
        <StyledContainer maxWidth="md">
            <Box py={2}>
                <Typography variant="h4">
                    Monthly Top 3 Topics
                </Typography>
            </Box>
            { loading ? 
                <Box py={4}><CircularProgress /></Box> : 
                (error ? 
                    <Typography variant="h6">Something wrong has happened</Typography> :
                    (!data || data.length === 0 ? 
                        <Typography variant="h6">No data</Typography> :
                        <ParentSize debounceTime={10}>
                            {({ width: visWidth }) => (
                                <HorizontalBarGroupChart width={visWidth} height={data.length * 100} 
                                    getGroup={(d: GroupData) => d.group}
                                    getLabel={(key: string, index: number) => labelMap[index][parseInt(key)]}
                                    scoreDomain={[0, scoreMax]} 
                                    subgroupDomain={range(3).map(x => x.toString())}
                                    colorDomain={colorDomain}
                                    data={data.map(x => ({ group: x.group, ...Object.assign({}, x.topics.map(x=>x.score)) }))} />
                            )}
                        </ParentSize>
                    )
                )
            }
        </StyledContainer>
    );
}
export default ChartExample;
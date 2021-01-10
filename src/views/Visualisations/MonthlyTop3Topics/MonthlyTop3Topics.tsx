import { Container, Typography } from "@material-ui/core";
import BarGroupChart from "components/HorizontalBarGroupChart";
import Loading from "components/Loading";
import { useAllPostsQuery } from "graphql/types-and-hooks";
import React, { FC, useMemo } from "react";
import styled from "styled-components";
import { timeFormat, timeParse } from "d3-time-format";
import { range, rollups } from 'd3-array';
import { uniq } from "lodash";
import { GroupData } from "components/HorizontalBarGroupChart/HorizontalBarGroupChart";

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

    if (loading) return <Loading />;
    // TODO: add error handler
    // TODO: make proper fallback flow
    if (!data || data.length === 0) return null;
    const scoreMax = data.reduce((t, monthData) => 
        monthData.topics.reduce(
            (t, topicsData) => topicsData.score > t ? topicsData.score : t
        , t)
    ,0);

    const labelMap = data.map(x => x.topics.map(x => x.label));
    const getLabel = (key: string, index: number) => labelMap[index][parseInt(key)];
    const colorDomain = uniq(data.map(x => x.topics).flat().map(x => x.label));
    // TODO: make chart width dynamic
    return (
        <StyledContainer maxWidth="md">
            <Typography variant="h5">
                Monthly Top 3 Topics
            </Typography>
            <BarGroupChart width={500} height={1200} 
                getGroup={(d: GroupData) => d.group}
                getLabel={getLabel}
                scoreDomain={[0, scoreMax]} 
                subgroupDomain={range(3).map(x => x.toString())}
                colorDomain={colorDomain}
                data={data.map(x => ({ group: x.group, ...Object.assign({}, x.topics.map(x=>x.score)) }))} />
        </StyledContainer>
    );
}
export default ChartExample;
import { Container } from "@material-ui/core";
import BarGroupChart from "components/HorizontalBarGroupChart";
import Loading from "components/Loading";
import { useAllPostsQuery } from "graphql/types-and-hooks";
import React, { FC, useMemo } from "react";
import styled from "styled-components";
import { timeFormat } from "d3-time-format";
import { add, endOfMonth, isBefore, startOfMonth } from "date-fns";
import { range, rollups } from 'd3-array';
import { uniq } from "lodash";

type TopicScore = {
    label: string;
    score: number;
}

type TopTopicsData = {
    group: string;
    topics: TopicScore[]
}


type TopicsMap = {
    [label: string]: number
}

const StyledContainer = styled(Container)`
    text-align: center;
`;

const format = timeFormat('%b %Y');
const formatDate = (date: Date) => format(date);
// TODO: add proper comments to codes
const ChartExample: FC = () => {
    const {loading, error, data: allPostsData} = useAllPostsQuery({ variables: { count: 200 }});

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
            .sort((a,b) => parseInt(b[0]) - parseInt(a[0]))
            .map(x => ({ group: x[0], topics: x[1] }));
    }, [allPostsData]);

    if (loading) return <Loading />;
    // TODO: make proper fallback flow
    if (!data || data.length === 0) return null;
    const scoreMax = data.reduce((t, monthData) => 
        monthData.topics.reduce(
            (t, topicsData) => topicsData.score > t ? topicsData.score : t
        , t)
    ,0);

    const subgroupDomain = uniq(data.map(x => x.topics).flat().map(x => x.label));
    console.log(data.map(x => ({ group: x.group, ...x.topics.reduce((t, topic) => ({ ...t, [topic.label]: topic.score }), {}) })))
    // TODO: make chart width dynamic
    return (
        <StyledContainer maxWidth="md">
            <BarGroupChart width={500} height={800} 
                getGroup={(d: TopTopicsData) => d.group} 
                scoreDomain={[0, scoreMax]} 
                subgroupDomain={subgroupDomain} 
                data={data.map(x => ({ group: x.group, ...x.topics.reduce((t, topic) => ({ ...t, [topic.label]: topic.score }), {}) }))} />
        </StyledContainer>
    );
}
export default ChartExample;
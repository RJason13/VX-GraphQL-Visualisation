import { Container } from "@material-ui/core";
import BarGroupChart from "components/BarGroupChart";
import Loading from "components/Loading";
import { useAllPostsQuery } from "graphql/types-and-hooks";
import React, { FC, useMemo } from "react";
import { CityTemperature } from '@vx/mock-data/lib/mocks/cityTemperature';
import styled from "styled-components";
import { timeFormat } from "d3-time-format";
import { add, endOfMonth, isBefore, startOfMonth } from "date-fns";


type TopTopicsData = {
    month: string;
    topics: {
        [label: string]: number 
    }
}

const StyledContainer = styled(Container)`
    text-align: center;
`;

const format = timeFormat('%b %Y');
const formatDate = (date: Date) => format(date);

const ChartExample: FC = () => {
    const {loading, error, data} = useAllPostsQuery({ variables: { count: 200 }});

    // TODO: use a proper data changed indicator
    const topicsByMonth = useMemo(() => {
        if (!data) return null;
        if (!data.allPosts) return [];
        const posts = data.allPosts;
        const monthSummary: { [month: string]: TopTopicsData } = {};
        let minDate = Infinity;
        let maxDate = -Infinity;
        posts.forEach(post => {
            const date = parseInt(post?.createdAt as string);
            if (date < minDate) minDate = date;
            if (date > maxDate) maxDate = date;

            const key = formatDate(new Date(date));
            monthSummary[key] = monthSummary[key] || { month: key, topics: {}};
            const topics = monthSummary[key].topics;
            post?.likelyTopics?.forEach(topic => {
                const label = topic?.label as string;
                topics[label] = topics[label] || 0;
                topics[label] += topic?.likelihood as number;
            });
        });

        const result = [];
        const startDate = startOfMonth(new Date(minDate));
        const endDate = endOfMonth(new Date(maxDate));
        let currentDate = startDate;

        while (isBefore(currentDate, endDate)) {
            const key = formatDate(currentDate);

            result.push(monthSummary[key] || { month: key, topics: {} });
            currentDate = add(currentDate, { months: 1 });
        }
        return result;
    }, [data]);
    console.log(topicsByMonth);

    if (loading) return <Loading />;
    // TODO: make chart width dynamic
    return (
        <StyledContainer maxWidth="md">
            <BarGroupChart width={500} height={800} getDate={(d: CityTemperature) => d.date} />
        </StyledContainer>
    );
}
export default ChartExample;
# VX-GraphQL-Visualisation

## Problem:
Provide a data insight visualisation from raw posts data which contain AI-based likely topics.

## Solution:
1. Choose tools:
   - TypeScript as the language
   - Create React App as build tools
   - Material UI as component library
   - Styled Component as styling library
   - Apollo GraphQL as API library
   - graphql codegen as the GraphQL types helper generator
   - VX as data visualisation library
   - date-fns as datetime manipulation library
2. Define page structure:
   - home page containing brief description of what the site is about.
   - visualisations page containing nested routed components for multiple different data insight.
3. UI design approach: mobile first strategy.
4. Choose insights to be shown:
   - Monthly Top 3 Topics with month range, include unpublished posts checkbox, and author filters.
   - Author Trends, e.g. favorite topics or change in topics posted over time.

## Deliverables
- [x] create project structure and page layout (completed)
- [x] add apollo graphql react connector (completed)
- [ ] build data manipulation flow (in progress: 70%)
- [ ] build insight visualisation (in progress: dummy chart placeholder created)
- [ ] add data filter flow (not started)

## Challenges
For me the most challenging parts I faced were:
- as my understanding of the data is limited, I was thinking of what data insight I should visualise, e.g. should I use the likelyhood of each topic as score to be sum aggregating the data or should I just count the topics and validate them by a certain likelyhood threshold.
- another challenge I faced was learning VX and date-fns on the go.

## Feedback for API
- it'll be useful to add other type of posts queries, e.g. postsByDateRange and postsByAuthor
- it'll be useful to add other type of users queries, e.g. usersByIds since including all user detail while fetching posts is unnecessarily adding data load to request response and fetching one user detail per fetch cause heavier burden than bulk fetching users in one request.
import { FC, lazy } from "react";
import { PageNavbarPropLink } from "components/PageNavbar";
import { AccountCircle, Star } from "@material-ui/icons";

type RouteEntry = PageNavbarPropLink & {
    component: React.LazyExoticComponent<FC<any>> | FC<any>;
}

const routes: RouteEntry[] = [
    {
        uri: '/monthly-top-3-topics',
        title: 'Monthly Top 3 Topics',
        icon: Star,
        component: lazy(() => import('./MonthlyTop3Topics'))
    },
    {
        uri: '/author-profile',
        title: "Author's Profile",
        icon: AccountCircle,
        component: lazy(() => import('./AuthorProfile'))
    }
    
];

export default routes;
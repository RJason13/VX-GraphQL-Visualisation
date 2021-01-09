import { FC, lazy } from "react";
import { PageNavbarPropLink } from "components/PageNavbar";

type RouteEntry = PageNavbarPropLink & {
    component: React.LazyExoticComponent<FC<any>> | FC<any>;
}

const routes: RouteEntry[] = [
    {
        uri: '/chart-example',
        title: 'Chart Example',
        component: lazy(() => import('./ChartExample'))
    }
];

export default routes;
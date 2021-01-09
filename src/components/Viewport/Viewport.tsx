import React, { FC } from 'react';
import { Helmet } from 'react-helmet';

const Viewport: FC = ({ children }) => {
    return (
        <Helmet>
            {/* To ensure proper rendering and touch zooming for all devices, add the responsive viewport meta tag to your <head> element. */}
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />
            {children}
        </Helmet>
    );
};

export default Viewport;

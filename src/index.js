import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {StaticRouter} from 'react-router-dom/server'

import Document from './Document'

export default function serverEntry(url) {
    return ReactDOMServer.renderToString(
        <StaticRouter location={url}>
            <Document/>
        </StaticRouter>
    )
}

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Document from './Document'

export default function serverEntry(url) {
    return ReactDOMServer.renderToString(
        <Document url={url}/>
    )
}

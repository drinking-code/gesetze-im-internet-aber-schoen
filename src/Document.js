import {StaticRouter} from 'react-router-dom/server'

import './style.scss'
import App from './App'

export default function Document({url}) {
    return (
        <html lang={'de'}>
        <head>
            <meta charSet="utf-8"/>
            <title>Gesetze im Internet; aber schön</title>
            <link rel={'stylesheet'} href={'/style.css'}/>
        </head>
        <body>
        <StaticRouter location={url}>
            <App/>
        </StaticRouter>
        </body>
        </html>
    )
}

import {Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LawPage from './pages/LawPage'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'
import AboutPage from './pages/AboutPage'
import {escapeNonSlash} from './utils/string'
import AllPage from './pages/AboutPage'

export default function App({notFound, status}) {
    return (
        <Routes>
            <Route path={'/'} exact element={<LandingPage/>}/>
            <Route path={'/suche'} exact element={<SearchPage/>}/>
            <Route path={escapeNonSlash('/über')} element={<AboutPage/>}/>
            <Route path={'/alle'} element={<AllPage/>}/>
            <Route path={'/:law'} exact element={
                notFound
                    ? <NotFoundPage status={status}/>
                    : <LawPage/>
            }/>
        </Routes>
    )
}

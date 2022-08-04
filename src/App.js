import {Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LawPage from './pages/LawPage'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'
import AboutPage from './pages/AboutPage'

export default function App({notFound, status}) {
    function escapeNonSlash(str) {
        return str.split('/').map(encodeURIComponent).join('/')
    }

    return (
        <Routes>
            <Route path={'/'} exact element={<LandingPage/>}/>
            <Route path={'/suche'} exact element={<SearchPage/>}/>
            <Route path={escapeNonSlash('/über')} element={<AboutPage/>}/>
            <Route path={'/:law'} exact element={
                notFound
                    ? <NotFoundPage status={status}/>
                    : <LawPage/>
            }/>
        </Routes>
    )
}

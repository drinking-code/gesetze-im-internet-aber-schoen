import {Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LawPage from './pages/LawPage'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App({notFound}) {
    return (
        <Routes>
            <Route path={'/'} exact element={<LandingPage/>}/>
            <Route path={'/suche'} exact element={<SearchPage/>}/>
            <Route path={'/:law'} exact element={
                notFound
                    ? <NotFoundPage/>
                    : <LawPage/>
            }/>
        </Routes>
    )
}

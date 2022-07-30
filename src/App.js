import {Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LawPage from './pages/LawPage'
import SearchPage from './pages/SearchPage'

export default function App() {
    return (
        <Routes>
            <Route path={'/'} exact element={<LandingPage/>}/>
            <Route path={'/suche'} exact element={<SearchPage/>}/>
            <Route path={'/:law'} exact element={<LawPage/>}/>
        </Routes>
    )
}

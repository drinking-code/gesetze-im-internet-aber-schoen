import {Fragment} from 'react'
import {Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LawPage from './pages/LawPage'

export default function App() {
    return (
        <Fragment>
            <header>
            </header>
            <Routes>
                <Route path={'/'} exact element={<LandingPage/>}/>
                <Route path={'/:law'} exact element={<LawPage/>}/>
            </Routes>
        </Fragment>
    )
}

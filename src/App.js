import {Fragment} from 'react'
import {Route, Routes} from 'react-router-dom'
import LandingPage from './pages/LandingPage'

export default function App() {
    return (
        <Fragment>
            <header>
            </header>
            <Routes>
                <Route path={'/'} exact element={<LandingPage/>}/>
            </Routes>
        </Fragment>
    )
}

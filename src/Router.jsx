import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
    useHistory,
    Link,
    useLocation,
    useRouteMatch,
    useParams
} from 'react-router-dom'
import React from 'react'
import Cookies from 'js-cookie'
import ServersContainer from './components/dashboard/ServersContainer'
import LoginContainer from './components/auth/LoginContainer'
import AccountContainer from './components/dashboard/AccountContainer'
import jsonwebtoken from 'jsonwebtoken'
import AdminOverviewContainer from './components/admin/overview/AdminOverviewContainer'
import AdminServersContainer from './components/admin/servers/AdminServersContainer'
import AdminCreateServerContainer from './components/admin/servers/AdminCreateServerContainer'
import AdminSettingsContainer from './components/admin/settings/AdminSettingsContainer'
import AdminNodesContainer from './components/nodes/AdminNodesContainer'
import CreateNode from './components/nodes/CreateNode'
import Firebase from './components/db'
import { getAuth, signOut } from 'firebase/auth'
import { Backdrop, CircularProgress } from '@material-ui/core'
import AuthLoading from './components/auth/AuthLoading'
import InstancesContainer from './components/instances/InstancesContainer'
import AccountContainerInstances from './components/instances/AccountContainerInstances'
import Dashboard from './components/Dashboard'
import InstanceNavigation from './components/instances/Navigation'
import GetLocation from './routes/getLocation'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminInstanceSelectContainer from './components/admin/instance_selection/AdminInstanceSelectContainer'
import AdminInstanceSelectDashboard from './components/admin/instance_selection/AdminInstanceSelectDashboard'
function AppRouter() {
    const [page_nav, setPageNav] = React.useState()
    const [logged_in, setLoggedIn] = React.useState('loading')
    const [admin, setAdmin] = React.useState()
    const auth = getAuth(Firebase)
    React.useEffect(() => {
        //console.log(location.pathname)
    })

    React.useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log(user)
                console.log("logged in")
                setLoggedIn(true)
            } else {
                console.log('logged out')
                setLoggedIn(false)
            }
        })
    }, [])
    React.useEffect(() => {
        if (logged_in === true) {
            auth.currentUser.getIdTokenResult().then((idTokenResult) => {
                console.log(idTokenResult)
                console.log(window.location.hostname)
                if (!!idTokenResult.claims.admin) {
                    setAdmin(true)
                } else {
                    setAdmin(false)
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [logged_in])

    function logout() {
        auth.signOut(auth).then(() => {
            console.log('logged out!')
            setLoggedIn(false)

        }).catch((error) => {
            console.log('error ' + error)
        })

    }
    function isAdmin() {
        // if (Cookies.get('token')){
        //     var user_info = jsonwebtoken.decode(Cookies.get('token'))
        //     return(user_info.admin)
        // } else {
        //     return(false)
        // }
        return true
    }
    return (
        <Router>
            <Switch>
                {/*Misc Routes */}
                <Route exact path="/404" render={() => <p>404 not found</p>} />


                {/*Admin Routes*/}
                <Route path="/admin/instance/:instance">
                    {logged_in === "loading" ? <AuthLoading /> : logged_in == true ? admin == true ?
                        <AdminDashboard>
                            <Switch>
                                <Route exact path="/admin/instance/:instance" render={() => <p>yesInstance</p>} />
                            </Switch>
                        </AdminDashboard>
                        : <p>403 Unauthorized</p> : <Redirect to="/auth/login" />}
                </Route>

                {/*Admin Routes (no instance) */}
                <Route path="/admin">
                    {logged_in === "loading" ? <AuthLoading /> : logged_in == true ? admin == true ?
                        <AdminInstanceSelectDashboard>
                            <Switch>
                                <Route exact path="/admin" component={AdminInstanceSelectContainer} />
                            </Switch>
                        </AdminInstanceSelectDashboard>
                        : <p>403 Unauthorized</p> : <Redirect to="/auth/login" />}
                </Route>



                {/*Authentication Routes */}
                <Route exact path="/auth/login" component={logged_in == "loading" ? LoginContainer : logged_in == true ? () => <Redirect to="/" /> : LoginContainer} />
                <Route exact path="/auth/logout" >
                    {logged_in == "loading" ? <AuthLoading /> : logged_in == true ? () => logout() : <Redirect to="/auth/login" />}
                </Route>


                {/*Instance Routes*/}
                <Route path="/instance/:instance">
                    {logged_in === "loading" ? <AuthLoading /> : logged_in == true ?
                        <Dashboard>
                            <Switch>
                                <Route exact path="/instance/:instance" component={ServersContainer} />
                                <Route exact path="/instance/:instance/account" component={AccountContainer} />
                            </Switch>
                        </Dashboard>
                        : <Redirect to="/auth/login" />}
                </Route>

                {/* Instance Unselected Routes*/}
                <React.Fragment>
                    {logged_in == "loading" ? <AuthLoading /> : logged_in == true ?
                        <InstanceNavigation>
                            <Switch>
                                <Route exact path="/" component={InstancesContainer} />
                                <Route exact path="/account" component={AccountContainerInstances}></Route>
                                <Route exact path="*" component={() => <Redirect to="/" />}></Route>
                            </Switch>
                        </InstanceNavigation>
                        : <Redirect to="/auth/login" />}
                </React.Fragment>
            </Switch>



            {/*             <Route exact path="/:instance">{logged_in == "loading" ? <AuthLoading />: logged_in == true ? <ServersContainer /> : <Redirect to="/auth/login" />}</Route>
 */}            {/* <Route exact path="/:instance/account">{logged_in == "loading" ? <AuthLoading /> : logged_in == true ? <AccountContainer /> : <Redirect to="/auth/login" />}</Route>
            <Route exact path="/auth/logout" >
                {logged_in == "loading" ? <AuthLoading /> : logged_in == true ? () => logout() : <Redirect to="/auth/login" />}
            </Route>
            <Route exact path = "/auth/login"> {logged_in == "loading" ? <AuthLoading /> : logged_in == true ? <Redirect to="/" /> : <LoginContainer />}
            </Route>
            <Route exact path = "/:instance/admin" render={() => isAdmin() ? <AdminOverviewContainer /> : <Redirect to="/" />}>
            </Route>
            <Route exact path = "/:instance/admin/servers" render={() => isAdmin() ? <AdminServersContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/servers/create" render={() => isAdmin() ? <AdminCreateServerContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/settings" render={() => isAdmin() ? <AdminSettingsContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/settings/mail" render={() => isAdmin() ? <AdminSettingsContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/nodes" render={() => isAdmin() ? <AdminNodesContainer /> : <Redirect to="/" />} />
            <Route exact path = "/:instance/admin/nodes/create" render={() => isAdmin() ? <CreateNode /> : <Redirect to="/" />} /> */}
        </Router>
    )
}

export default AppRouter;
import React, { Suspense } from "react"
import { Router, Location, Redirect } from "@reach/router"
import { Flipper } from "react-flip-toolkit"

import { GlobalStyles } from "styles/globalStyles"
import { AuthProvider } from "utils/auth"
import { LoadingProvider } from "utils/loading"

import LoginPage from "pages/LoginPage"
import Dashboard from "pages/Dashboard"
import ProjectOverview from "pages/ProjectOverview"

export const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <AuthProvider>
        <LoadingProvider>
          <Location>
            {({ location }) => (
              <Flipper flipKey={location}>
                <Suspense fallback={<></>}>
                  <Router>
                    <Redirect from="/" to="/app/login" noThrow />
                    <LoginPage path="/app/login" />
                    <Dashboard path="/app/dashboard" />
                    <ProjectOverview path="/app/workspace/:projectId" />
                  </Router>
                </Suspense>
              </Flipper>
            )}
          </Location>
        </LoadingProvider>
      </AuthProvider>
    </>
  )
}

export default App

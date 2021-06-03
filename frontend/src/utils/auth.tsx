import React, { useState, useMemo, useContext, useEffect } from "react"
import { useGoogleLogin, useGoogleLogout } from "react-google-login"
import { navigate } from "@reach/router"

const noop = () => {}

type AuthContextValue =  {
  token: string
  loaded: boolean
  signIn: () => void
  signOut: () => void
}

export const AuthContext =
  React.createContext<AuthContextValue>(undefined as unknown as AuthContextValue)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC = props => {
  const { children } = props
  const [userObject, setUserObject] = useState()
  const token = useMemo(() => userObject?.tokenId, [userObject])

  const googleLoginCommon = {
    jsSrc: "https://apis.google.com/js/api.js",
    clientId: "58231025054-oua7h9662eqpb7ngl33qjhshetl13fod.apps.googleusercontent.com",
    scope: "profile email",
    accessType: "online",
    cookiePolicy: "single_host_origin",
    fetchBasicProfile: true,
    isSignedIn: true,
    uxMode: "popup",
    onRequest: noop,
    onFailure: console.error,
  }

  const { signIn, loaded } = useGoogleLogin({
    ...googleLoginCommon,
    onSuccess: setUserObject
  })

  const { signOut } = useGoogleLogout({
    ...googleLoginCommon,
    onLogoutSuccess: () => {
      setUserObject(null)
      navigate("/app/login")
    }
  })

  useEffect(() => {
    localStorage.setItem("jwt", token)
  }, [token])

  const value = useMemo(() => ({
    token,
    signIn,
    signOut,
    loaded
  }), [token, signIn, signOut, loaded])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

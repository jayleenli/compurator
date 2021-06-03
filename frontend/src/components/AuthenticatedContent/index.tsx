import React, { useEffect, useState } from "react"
import tw from "tailwind.macro"
import { useAuth } from "utils/auth"
import LoadingInfo from "components/LoadingInfo"
import { Link } from "@reach/router"

const LoadingLayout = tw.div`
  flex flex-col items-center justify-center
  mx-auto
`

const ErrorLink = tw(Link)`
  my-4
  text-orange-500 font-bold
`

const AuthenticatedContent: React.FC = props => {
  const { children } = props
  const { token } = useAuth()
  const [loginHint, setLoginHint] = useState(false)

  useEffect(() => {
    let handle: number

    if (token) {
      setLoginHint(false)
    }

    if (!token && !loginHint) {
      setTimeout(() => {
        setLoginHint(true)
      }, 5000)
    }

    return () => {
      if (handle) {
        clearTimeout(handle)
      }
    }
  }, [token, loginHint])


  if (token) {
    return (
      <>
        {children}
      </>
    )
  }

  return (
    <LoadingLayout>
      <LoadingInfo colorScheme="invert" message="Authenticating you with Google..."/>
      {loginHint && (
        <ErrorLink to="/app/login">It seems to be taking a while... Click here to try logging in again.</ErrorLink>
      )}
    </LoadingLayout>
  )
}

export default AuthenticatedContent

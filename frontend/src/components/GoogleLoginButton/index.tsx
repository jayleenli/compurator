import React from "react"
import tw from "tailwind.macro"
import { useAuth } from "utils/auth"

const Button = tw.button`
  py-2 px-4
  bg-white
  hover:bg-gray-200
  shadow
  hover:shadow-lg
  rounded
`

const GoogleLoginButton: React.FC = () => {
  const { signIn } = useAuth()

  return (
    <Button onClick={() => signIn()}>Sign in with Google</Button>
  )
}

export default GoogleLoginButton

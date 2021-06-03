import React from "react"
import tw from "tailwind.macro"
import { Flipped } from "react-flip-toolkit"
import { Link } from "@reach/router"

import richert from "images/richert.jpg"
import { useAuth } from "utils/auth"

const BrandImage = tw.img`
  mr-4
  w-12
  rounded-full
`

const Brand = tw.div`
  flex items-center
`

const Wrapper = tw.nav`
  flex items-center
  py-4 px-12
  text-white font-semibold
  justify-between
`

export const NavBar: React.FC = () => {
  const { signOut } = useAuth()

  return (
    <Wrapper>
      <Brand>
        <Flipped flipId="richert">
          <Link to="/app/dashboard">
            <BrandImage src={richert} />
          </Link>
        </Flipped>
        <Link to="/app/dashboard">
          Compurator - The Richert Wang Experience
        </Link>
      </Brand>
      <button onClick={signOut}>Logout</button>
    </Wrapper>
  )
}

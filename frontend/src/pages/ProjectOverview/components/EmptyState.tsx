import React from "react"
import tw from "tailwind.macro"

import pichert from "images/pichert.png"

const Wrapper = tw.div`
  table
  mx-auto
`

const ImageWrapper = tw.div`
  table
  mx-auto mb-4
  bg-orange-500
  rounded-full
`

const Image = tw.img`
  h-64
`

const Link = tw.a`
  text-orange-500
  hover:underline
`

const Description = tw.p`
  text-xl
`

const List = tw.ol`
  list-decimal
`

const EmptyState: React.FC = () => {
  return (
    <Wrapper>
      <ImageWrapper>
        <Image src={pichert} alt="Pixelated Richert Wang" />
      </ImageWrapper>
      <Description>
        Add products to this workspace!
      </Description>
      <List>
        <li>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/ucsb-cs48-w20/4pm-laptops-comparer/releases"
          >
            Install our Firefox extension
          </Link>
        </li>
        <li>Visit Amazon pages and click our extension</li>
      </List>
    </Wrapper>
  )
}

export default EmptyState

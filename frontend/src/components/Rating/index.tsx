import React from "react"
import tw from "tailwind.macro"
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/all"

const Wrapper = tw.span`
  flex
  text-yellow-500 text-xl
`

type RatingProps = {
  rating: number
}

const HALF_STAR = 0.1
const FULL_STAR = HALF_STAR * 2

const Rating: React.FC<RatingProps> = props => {
  const { rating } = props

  const stars = []
  // ratings should be shifted up a bit so that non-perfect scores can still
  // get a 5 star rating
  let remainingRating = rating + ( HALF_STAR / 2 )

  for (let i = 0; i < 5; i++) {
    if (remainingRating >= FULL_STAR) {
      stars.push(<FaStar key={i} />)
    } else if (remainingRating >= HALF_STAR) {
      stars.push(<FaStarHalfAlt key={i} />)
    } else {
      stars.push(<FaRegStar key={i} />)
    }
    remainingRating -= FULL_STAR
  }

  return (
    <Wrapper>
      {stars}
    </Wrapper>
  )
}

export default Rating

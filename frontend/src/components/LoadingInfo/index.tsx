import React from "react"
import tw from "tailwind.macro"
import styled from "styled-components/macro"
import { ImpulseSpinner } from "react-spinners-kit"

type WrapperProps = {
  colorScheme?: "default" | "invert"
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`
    flex flex-col items-center justify-center
    text-sm
    mx-auto
  `};
  ${({ colorScheme }) => colorScheme === "invert" && tw`text-white`}
`

const SpinnerWrapper = tw.div`
  my-10
`

type LoadingInfoProps = {
  colorScheme?: "default" | "invert"
  message?: string
}

const LoadingInfo: React.FC<LoadingInfoProps> = props => {
  const { message, colorScheme = "default" } = props

  let colors
  if (colorScheme === "default") {
    colors = {
      frontColor: "#ffffff",
      backColor: "#3182ce"
    }
  } else if (colorScheme === "invert") {
    colors = {
      backColor: "#ffffff",
      frontColor: "#3182ce"
    }
  }


  return (
    <Wrapper colorScheme={colorScheme}>
      <SpinnerWrapper>
        <ImpulseSpinner size={60} {...colors} />
      </SpinnerWrapper>
      { message }
    </Wrapper>
  )
}

export default LoadingInfo

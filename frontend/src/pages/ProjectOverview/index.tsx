import React, { useState, useCallback } from "react"
import { RouteComponentProps, navigate } from "@reach/router"
import tw from "tailwind.macro"
import { createGlobalStyle } from "styled-components/macro"
import { Flipped } from "react-flip-toolkit"
import { FaAngleLeft } from "react-icons/all"

import { NavBar } from "components/NavBar"
import { usePatchWorkspace, useWorkspace } from "resources/projects"
import LoadingInfo from "components/LoadingInfo"
import DeleteButton from "./components/DeleteButton"
import ProductList from "./components/ProductList"
import EmptyState from "./components/EmptyState"
import Helmet from "react-helmet"

const BodyStyles = createGlobalStyle`
  body {
    ${tw`bg-blue-600`};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%232a4365' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`

const Wrapper = tw.div`
  max-w-6xl
  mb-10 mx-auto px-1 py-2
  md:px-6 md:py-6
  bg-white
  rounded-lg
  shadow-lg
`

const TopBar = tw.div`
  flex flex-col items-start justify-between
  md:flex-row md:items-center
  mb-8
`

const Group = tw.div`
  flex flex-row items-center
`

const BackButton = tw.button`
  text-4xl
  p-2
  md:mr-4
`

const TitleInput = tw.input`
  bg-gray-200
  px-4 py-2
  rounded
`

type ProjectOverviewContentsProps = {
  projectId: string
  projectName: string
  products: any[]
  refetch: () => void
}

const ProjectOverviewContents: React.FC<ProjectOverviewContentsProps> = props => {
  const { projectId, projectName, products } = props
  const [title, setTitle] = useState(projectName)

  const patchWorkspace = usePatchWorkspace(projectId)

  const navigateToDashboard = useCallback(() => {
    navigate("/app/dashboard")
  }, [])

  const changeTitle = useCallback(e => {
    setTitle(e.target.value)
  }, [])

  const commitTitle = useCallback(e => {
    patchWorkspace({
      data: {
        name: e.target.value
      }
    })
  }, [patchWorkspace])

  return (
    <>
      <TopBar>
        <Group>
          <BackButton onClick={navigateToDashboard}>
            <FaAngleLeft />
          </BackButton>
          <TitleInput
            type="text"
            value={title}
            onChange={changeTitle}
            onBlur={commitTitle}
          />
        </Group>
        <DeleteButton workspaceId={projectId} />
      </TopBar>
      <ProductList workspaceId={projectId} products={products}/>
      { !products.length && <EmptyState /> }
    </>
  )
}

type ProjectOverviewProps = {
  projectId?: string,
  location?: { state?: { prefetchedData?: any } }
} & RouteComponentProps

const ProjectOverview: React.FC<ProjectOverviewProps> = props => {
  const { projectId, location } = props
  const prefetchedData = location?.state?.prefetchedData

  const { data: liveData, run: refetch } = useWorkspace(projectId!)

  const data = liveData || prefetchedData

  const flipId = `bg-${projectId}`

  return (
    <>
      <Helmet>
        <title>{data?.name ?? "My Workspace"} | Compurator</title>
      </Helmet>
      <BodyStyles/>
      <NavBar/>
      <Flipped flipId={flipId}>
        <Wrapper>
          {
            !data ? (
              <LoadingInfo message="Loading your workspace" />
            ) : (
              <ProjectOverviewContents
                projectId={projectId!}
                projectName={data.name}
                products={data.products}
                refetch={refetch}
              />
            )
          }
        </Wrapper>
      </Flipped>
    </>
  )
}

export default ProjectOverview

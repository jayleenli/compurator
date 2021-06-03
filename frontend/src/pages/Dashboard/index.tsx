import React from "react"
import { RouteComponentProps } from "@reach/router"
import tw from "tailwind.macro"
import { createGlobalStyle } from "styled-components/macro"
import {
  animated,
  useTrail,
  config
} from "react-spring"

import {
  ProjectThumbnail as ProjectThumbnailBase,
  NewProjectThumbnail as NewProjectThumbnailBase
} from "components/ProjectThumbnail"
import { NavBar } from "components/NavBar"
import { useCreateWorkspace, useWorkspaces } from "resources/projects"
import AuthenticatedContent from "components/AuthenticatedContent"
import LoadingInfo from "components/LoadingInfo"
import Helmet from "react-helmet"

const BodyStyles = createGlobalStyle`
  body {
    ${tw`bg-blue-600`};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%232a4365' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`

const Layout = tw.div`
  flex flex-wrap justify-start
  p-8
`

const ProjectThumbnail = animated(ProjectThumbnailBase)
const NewProjectThumbnail = animated(NewProjectThumbnailBase)

const springConfig = {
  config: config.stiff,
  from: {
    y: 100,
    opacity: 0
  },
  to: {
    y: 0,
    opacity: 1
  }
}

const WorkspacesGrid: React.FC = () => {
  const { workspaces, loading, error } = useWorkspaces()
  const createWorkspace = useCreateWorkspace()

  const trail = useTrail(workspaces.length + 1, springConfig)

  type TrailStyles = { y: any; opacity: number }

  if (error) {
    return (
      <>
        A fatal error occurred: {error}
      </>
    )
  }

  if (loading) {
    return  <LoadingInfo colorScheme="invert" message="Loading your workspaces" />
  }

  return (
    <>
      {trail.map((props, i) => {
        const { y, ...rest } = props as TrailStyles

        if (i === workspaces.length) {
          return (
            <NewProjectThumbnail
              key="newProject"
              id="newProject"
              onClick={createWorkspace}
              style={{
                ...rest,
                transform: y.interpolate((v: number) => `translateY(${v}px)`)
              }}
            />
          )
        }

        const id = workspaces[i].workspace_id

        return (
          <ProjectThumbnail
            key={id}
            projectId={id}
            projectName={workspaces[i].name}
            products={workspaces[i].products}
            style={{
              ...rest,
              transform: y.interpolate((v: number) => `translateY(${v}px)`)
            }}
          />
        )
      })}
    </>
  )
}

const Dashboard: React.FC<RouteComponentProps> = () => {

  return (
    <>
      <Helmet>
        <title>My Workspaces | Compurator</title>
      </Helmet>
      <BodyStyles />
      <NavBar />
      <Layout>
        <AuthenticatedContent>
          <WorkspacesGrid />
        </AuthenticatedContent>
      </Layout>
    </>
  )
}

export default Dashboard

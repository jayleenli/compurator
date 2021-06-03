import React, { HTMLAttributes, useCallback } from "react"
import tw from "tailwind.macro"
import { FaPlus } from "react-icons/all"
import { navigate } from "@reach/router"
import { Flipped } from "react-flip-toolkit"
import { useWorkspace } from "resources/projects"
import { useLoading } from "utils/loading"

const Wrapper = tw.div`
  m-4
  w-1/6 min-w-24 max-w-48
  flex-none
  text-white
`

const PageRect = tw.div`
  block
  relative
  pt-aspect-page
`

const SheetLayout = tw.div`
  absolute inset-0
  p-4
  flex flex-wrap justify-center items-center
  bg-white
  shadow
  rounded
  text-4xl
  cursor-pointer
  overflow-hidden
`

const ProductImage = tw.img`
  w-1/2
`

const InnerLayout = tw.div`
  absolute inset-0
  flex justify-center items-center
  border-dashed border-4 border-white
  rounded
  text-4xl
  cursor-pointer
`

const ProjectFooter = tw.div`
  mt-2
`

const NewProjectFooter = tw(ProjectFooter)`
  text-center
`

type DivProps = HTMLAttributes<HTMLDivElement>

type ProjectProps = {
  projectId: string
  projectName: string,
  products: [{
    p_id: string
    img_url: string
  }]
}

// The thumbnail should not FLIP when transitioning from project overview to
// dashboard
function neverFlip() {
  return false
}


export const ProjectThumbnail: React.FC<ProjectProps & DivProps> = props => {
  const { projectId, projectName, products, ...otherProps } = props

  const { startLoader, completeLoader } = useLoading()
  const { run } = useWorkspace(projectId, { autoRun: false })

  const navigateToWorkspace = useCallback(async () => {
    startLoader()
    const { data } = await run()
    completeLoader()

    navigate(`/app/workspace/${projectId}`, { state: { prefetchedData: data }})
  }, [projectId, run, startLoader, completeLoader])

  return (
    <Wrapper {...otherProps}>
      <PageRect onClick={navigateToWorkspace}>
        <Flipped flipId={`bg-${projectId}`} shouldFlip={neverFlip}>
          <SheetLayout>
            {products.map(p => (
              <Flipped flipId={`product-${projectId}-${p.p_id}`}>
                <ProductImage key={p.p_id} src={p.img_url} />
              </Flipped>
            ))}
          </SheetLayout>
        </Flipped>
      </PageRect>
      <ProjectFooter>
        {projectName}
      </ProjectFooter>
    </Wrapper>
  )
}

export const NewProjectThumbnail: React.FC<DivProps> = props => {
  const { onClick, ...otherProps } = props

  return (
    <Wrapper {...otherProps}>
      <PageRect onClick={onClick}>
        <InnerLayout>
          <FaPlus />
        </InnerLayout>
      </PageRect>
      <NewProjectFooter>
        New Workspace
      </NewProjectFooter>
    </Wrapper>
  )
}

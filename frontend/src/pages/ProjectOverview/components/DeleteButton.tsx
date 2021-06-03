import React, { useCallback, useState } from "react"
import tw from "tailwind.macro"
import { FaTrash } from "react-icons/all"
import { navigate } from "@reach/router"

import { useDeleteWorkspace } from "resources/projects"
import { useLoading } from "utils/loading"

const Button = tw.button`
  flex items-center
  text-red-500
  hover:bg-red-200
  py-2 px-3
  rounded
`

const ButtonIcon = tw(FaTrash)`
  mr-2
`

type DeleteButtonProps = {
  workspaceId: string
}

const DeleteButton: React.FC<DeleteButtonProps> = props => {
  const { workspaceId } = props
  const { startLoader, completeLoader } = useLoading()
  const deleteWorkspace = useDeleteWorkspace(workspaceId)
  const [deleting, setDeleting] = useState(false)


  const onClick = useCallback(async () => {
    setDeleting(true)
    startLoader()
    await deleteWorkspace()
    completeLoader()

    navigate("/app/dashboard")
  }, [startLoader, completeLoader, deleteWorkspace])

  return (
    <Button disabled={deleting} onClick={onClick}>
      <ButtonIcon />
      Delete Workspace
    </Button>
  )
}

export default DeleteButton

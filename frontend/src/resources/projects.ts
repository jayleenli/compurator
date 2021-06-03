import { useCallback, useEffect } from "react"
import { navigate } from "@reach/router"
import { useAuth } from "utils/auth"
import useAxios from "axios-hooks"

import { useLoading } from "utils/loading"

const BASE_URL = process.env.REACT_APP_API_ENDPOINT

export function useWorkspaces() {
  const { token, loaded } = useAuth()

  const [{ data, error }, run] =
    useAxios({
      url: `${BASE_URL}/workspaces`,
      headers: {
        Authorization: token
      }
    }, { manual: true })

  useEffect(() => {
    if (loaded) {
      if (token) {
        run()
      }
    }
  }, [loaded, run, token])

  return {
    workspaces: data?.workspaces || [],
    error: data?.error || error?.message,
    loading: !data && !error
  }
}

export function useCreateWorkspace() {
  const { token } = useAuth()
  const { startLoader, completeLoader } = useLoading()

  const [{ data }, run] =
    useAxios({
      url: `${BASE_URL}/workspaces`,
      method: "POST",
      headers: {
        Authorization: token
      }
    }, { manual: true })

  useEffect(() => {
    if (data) {
      navigate(`/app/workspace/${data._id}`)
      completeLoader()
    }
  }, [completeLoader, data])

  return useCallback(() => {
    startLoader()
    run()
  }, [startLoader, run])
}

export function useWorkspace(workspaceId: string, { autoRun = true } = {}) {
  const { token } = useAuth()

  const [{ data, error }, run] =
    useAxios({
      url: `${BASE_URL}/workspaces/${workspaceId}`,
      headers: {
        Authorization: token
      }
    }, { manual: true })

  useEffect(() => {
    if (autoRun && token) {
      run()
    }
  }, [autoRun, run, token])

  return {
    data,
    error: data?.error || error?.message,
    loading: !data && !error,
    run
  }
}

export function usePatchWorkspace(workspaceId: string) {
  const { token } = useAuth()

  const [, run] =
    useAxios({
      url: `${BASE_URL}/workspaces/${workspaceId}`,
      method: "patch",
      headers: {
        Authorization: token
      }
    }, { manual: true })

  return run
}

export function useDeleteWorkspace(workspaceId: string) {
  const { token } = useAuth()

  const [, run] =
    useAxios({
      url: `${BASE_URL}/workspaces/${workspaceId}`,
      method: "delete",
      headers: {
        Authorization: token
      }
    }, { manual: true })

  return run
}

export function useDeleteProduct(workspaceId: string, productId: string) {
  const { token } = useAuth()

  const [, run] =
    useAxios({
      url: `${BASE_URL}/workspaces/${workspaceId}/${productId}`,
      method: "delete",
      headers: {
        Authorization: token
      }
    }, { manual: true })

  return run
}

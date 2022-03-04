import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { getCollections } from "../helpers/collections"
import { TCollection } from "../pages/CollectionPage/CollectionPage"
import { ConnectionContext } from "./connection"
import { ContractContext } from "./contract"

interface CollectionContextProps {
  collections: TCollection[]
  isFetchingCollections: boolean
  fetchCollections: Function
}

export const CollectionContext = createContext<CollectionContextProps>({
  collections: [],
  isFetchingCollections: true,
  fetchCollections: () => { },
})

const CollectionProvider = (props: any) => {
  const [collections, setCollections] = useState<TCollection[]>([])
  const { contractAccountId } = useContext(ContractContext)
  const { provider } = useContext(ConnectionContext)
  const [isFetchingCollections, setIsFetchingCollections] = useState(true)

  const fetchCollections = useCallback(async () => {
    try {
      setIsFetchingCollections(true)
      const results = await getCollections(provider, contractAccountId)
      setCollections(results)
      setIsFetchingCollections(false)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])
  return (
    <CollectionContext.Provider
      value={{ collections, isFetchingCollections, fetchCollections }}
    >
      {props.children}
    </CollectionContext.Provider>
  )
}

export default CollectionProvider

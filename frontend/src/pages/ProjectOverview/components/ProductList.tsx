import React, { useCallback, useState } from "react"
import tw from "tailwind.macro"
import { Flipped } from "react-flip-toolkit"
import { FaTimes } from "react-icons/all"
import { useDeleteProduct, usePatchWorkspace } from "resources/projects"
import { useLoading } from "utils/loading"
import SpecsTable from "pages/ProjectOverview/components/SpecsTable"
import Rating from "components/Rating"

const Column = tw.div`
  relative 
  mx-4
`

const ScrollingContainer = tw.div`
  flex flex-row
  overflow-auto
`

const ProductTitle = tw.a`
  hover:underline
`

const Price = tw.p`
  text-green-600 font-semibold
`

const ProductImage = tw.img`
  h-64 min-w-72
  mb-4 mx-auto
  object-contain
`

const NotesField = tw.textarea`
  w-full
  my-2
  p-2
  rounded
  bg-gray-100
`

const DeleteButton = tw.button`
  absolute
  p-2
  text-gray-500
  hover:text-black
`

const Scores = tw.div`
  flex flex-col justify-between
  md:flex-row
`

const Score = tw.div`
  mt-2 mb-4
`

const Title = tw.h1`
  font-semibold
`

type ProductInfoProps = {
  workspaceId: string
  product: any
}

const ProductInfo: React.FC<ProductInfoProps> = props => {
  const { workspaceId, product } = props
  const patchWorkspace = usePatchWorkspace(workspaceId)
  const { startLoader, completeLoader } = useLoading()
  const deleteProduct = useDeleteProduct(workspaceId, product.p_id)

  const [notes, setNotes] = useState(product.notes)

  const onNotesChange = useCallback(e => {
    setNotes(e.target.value)
  }, [])

  const commitNotes = useCallback(() => {
    patchWorkspace({
      data: {
        note: {
          p_id: product.p_id,
          content: notes
        }
      }
    })
  }, [patchWorkspace, notes, product])

  const onDelete = useCallback(async () => {
    startLoader()
    await deleteProduct()
    completeLoader()

    // refresh the page
    window.history.replaceState(null, "")
    // noinspection SillyAssignmentJS
    window.location.href = window.location.href
  }, [completeLoader, deleteProduct, startLoader])

  return (
    <Column>
      <DeleteButton onClick={onDelete}>
        <FaTimes />
      </DeleteButton>
      <Flipped flipId={`product-${workspaceId}-${product.p_id}`}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={product.url}
        >
          <ProductImage src={product.img_url} />
        </a>
      </Flipped>
      <ProductTitle
        target="_blank"
        rel="noopener noreferrer"
        href={product.url}
      >
        {product.title}
      </ProductTitle>
      <Price>{product.price}</Price>
      <NotesField placeholder="Your notes here"
                  value={notes || ""}
                  onChange={onNotesChange}
                  onBlur={commitNotes}
      />
      <Scores>
        {
          product.review_score && (
            <Score>
              <Title>Consumer Review Score</Title>
              <Rating rating={product.review_score} />
            </Score>
          )
        }
        {
          product.seller_rep && (
            <Score>
              <Title>Seller Reputation</Title>
              <Rating rating={product.seller_rep} />
            </Score>
          )
        }
      </Scores>
      { product.specs && <Title>Product Details</Title>}
      { product.specs && <SpecsTable specs={product.specs} />}
    </Column>
  )
}



type ProductListProps = {
  workspaceId: string
  products: any[]
}

const ProductList: React.FC<ProductListProps> = props => {
  const { workspaceId, products } = props

  return (
    <ScrollingContainer>
      {products.map(p => (
        <ProductInfo key={p.p_id} workspaceId={workspaceId} product={p}/>
      ))}
    </ScrollingContainer>
  )
}

export default ProductList

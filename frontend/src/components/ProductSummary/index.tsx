import React from "react"

type ProductSummaryProps = {
  name: string,
  price: string
}

const ProductSummary: React.FC<ProductSummaryProps> = props => {
  const { name, price } = props
  return (
    <div>
      <div>{name}</div>
      <div>{price}</div>
    </div>
  )
}

export default ProductSummary


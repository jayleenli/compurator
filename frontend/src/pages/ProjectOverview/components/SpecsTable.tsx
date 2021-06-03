import React from "react"
import tw from "tailwind.macro"
import styled from "styled-components/macro"

const Table = tw.table`
  my-1
  w-full
`

type RowProps = {
  index: number
}

const Row = styled.tr<RowProps>`
  ${({ index }) => (index + 1) % 2 && tw`bg-gray-100`}
`

const Entry = tw.td`
  py-2 pl-3
`

type SpecsTableProps = {
  specs: { key: string, value: string }[]
}

const SpecsTable: React.FC<SpecsTableProps> = props => {
  const { specs } = props
  return (
    <Table>
      <tbody>
        {specs.map((spec, i) => (
          <Row key={spec.key} index={i}>
            <Entry>{spec.key}</Entry>
            <td>{spec.value}</td>
          </Row>
        ))}
      </tbody>
    </Table>
  )
}

export default SpecsTable

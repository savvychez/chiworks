"use client"

import * as React from "react"
import { useEffect } from "react"
import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

export default function FilterDropdown({ filterParams, propogateQueryString }) {
  // create boolean array of length filterParams.length
  const generateSelect = () => {
    let select = []
    for (let i = 0; i < Object.keys(filterParams).length; i++) {
      for (let j = 0; j < filterParams[i].items.length; j++) {
        select.push(false)
      }
    }
    return select
  }

  const flattenParams = () => {
    let flatParams = []
    console.log(filterParams)
    for (let i = 0; i < filterParams.length; i++) {
      for (let j = 0; j < filterParams[i].items.length; j++) {
        const item = {
          name: filterParams[i].items[j].name,
          query: filterParams[i].items[j].query
        }
        flatParams.push(item)
      }
    }
    return flatParams
  }

  const [position, setPosition] = React.useState("top")
  const [selected, setSelected] = React.useState(generateSelect())
  const [flatParams, setFlatParams] = React.useState(flattenParams())
  const [prettyString, setPrettyString] = React.useState("None")

  const updateSelect = (value, index) => {
    console.log(value, index)
    let newSelect = [...selected]
    newSelect[index] = !!!value
    setSelected(newSelect)
  }

  const getOffsetIndex = (i1, i2) => {
    let offset = 0
    for (let i = 0; i < i1; i++) {
      offset += filterParams[i].items.length
    }
    return offset + i2
  }

  useEffect(() => {
    let selectedItems = []
    let queryItems = []
    for (let i = 0; i < selected.length; i++) {
      if (selected[i]) {
        selectedItems.push(flatParams[i].name)
        queryItems.push(flatParams[i].query)
      }
    }
    console.log(selectedItems)
    const tempString = selectedItems.join(", ")
    const queryString = queryItems.join("&")
    console.log(queryString)
    propogateQueryString(queryString)
    console.log("QUERY")
    if (tempString.length > 15) {
      setPrettyString(tempString.substring(0, 15) + "...")
    } else {
      setPrettyString(tempString ? tempString : "None")
    }
  }, [selected])

  return (
    <DropdownMenu className="ml-2">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white/50 w-full sm:w-autobg-white/50 my-1 !sm:my-0 sm:w-max mr-2">Filter By:&nbsp;&nbsp;<strong>{prettyString}</strong></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {filterParams.map((group, i1) => (
          <DropdownMenuRadioGroup key={group.name}>
            <DropdownMenuLabel>
              {group.name}
            </DropdownMenuLabel>
            {
              group.items.map((dropdownItem, i2) => (
                <DropdownMenuCheckboxItem key={dropdownItem.name} checked={selected[getOffsetIndex(i1, i2)]} onCheckedChange={() => updateSelect(selected[getOffsetIndex(i1, i2)], getOffsetIndex(i1, i2))}>
                  {dropdownItem.name}
                </DropdownMenuCheckboxItem>
              ))
            }
          </DropdownMenuRadioGroup>
        ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

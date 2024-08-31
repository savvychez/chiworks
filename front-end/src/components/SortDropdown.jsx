"use client"

import * as React from "react"
import { useEffect} from "react"
import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

export default function SortByDropdown({sortParams, propogateQueryString}) {
  const [position, setPosition] = React.useState()
  const [selected, setSelected] = React.useState()

  useEffect(() => {
    // setPosition(Object.keys(sortParams)[0])
  }, [])

  useEffect(() => {
    setSelected(position)
    // alert(sortParams[position])
    propogateQueryString(sortParams[position])
  }, [position])


  return (
    <DropdownMenu className="">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white/50 w-full my-1 !sm:my-0 sm:w-max mr-2">Sort By:&nbsp;&nbsp;<strong>{selected ? selected : "None"}</strong></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {Object.keys(sortParams).map((key) => (
            <DropdownMenuRadioItem key={key} value={key}>
              {key}
            </DropdownMenuRadioItem>
          ))
          }
          {/* <DropdownMenuRadioItem value="top">Names A-Z</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="middle">Names Z-A</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Other</DropdownMenuRadioItem> */}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

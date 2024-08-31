import * as React from "react";

import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useEffect } from "react";

export default function ModelDropdown({onModelChange}) {
  const [position, setPosition] = React.useState("top");
  const [model, setModel] = React.useState("Jobs");
  const models = ["Jobs", "Employers", "Resources"];

  useEffect(() => {
    onModelChange(model)
  }, [model]);
  return (
    <DropdownMenu className="">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white/50 w-full sm:w-auto">
          Showing&nbsp;<strong>{model}</strong>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Select a model</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {models.map((m) => (
          <DropdownMenuItem
            key={m}
            isSelected={model === m}
            onClick={() => setModel(m)}
          >
            {m}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

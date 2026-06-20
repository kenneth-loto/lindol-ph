"use no memo";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActionItem<TData> {
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick: (row: Row<TData>) => void;
}

interface RowActionsProps<TData> {
  row: Row<TData>;
  actions: ActionItem<TData>[];
}

export function RowActions<TData>({ row, actions }: RowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-8 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />
      <DropdownMenuContent className="w-auto" align="end">
        {actions.map((action, index) => {
          const previous = actions[index - 1];
          const isBoundary = action.danger && previous && !previous.danger;

          return (
            <Fragment key={action.label}>
              {isBoundary && <DropdownMenuSeparator />}

              <DropdownMenuItem
                variant={action.danger ? "destructive" : "default"}
                onClick={() => action.onClick(row)}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

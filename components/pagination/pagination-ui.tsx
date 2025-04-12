'use client'

import { useDictionary } from '@/hooks'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from 'lucide-react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'

type Props = {
  selectedRowsCount?: number
  alwaysShowSelectedRowsCount?: boolean
  totalRowsCount: number
  pageSize: number
  pageSizeOptions?: number[]
  pageIndex: number
  pageCount: number
  onPageSizeChange(size: number): void
  onGoToFirstPage(): void
  onGoToPreviousPage(): void
  onGoToNextPage(): void
  onGoToLastPage(): void
  canGoToPreviousPage: boolean
  canGoToNextPage: boolean
}

export function PaginationUI({
  selectedRowsCount,
  alwaysShowSelectedRowsCount = false,
  totalRowsCount,
  pageSize,
  pageSizeOptions = [10, 20, 30, 40, 50],
  pageIndex,
  pageCount,
  onPageSizeChange,
  onGoToFirstPage,
  onGoToPreviousPage,
  onGoToNextPage,
  onGoToLastPage,
  canGoToPreviousPage,
  canGoToNextPage
}: Props) {
  const {
    common: { pagination: dict }
  } = useDictionary()

  const allPageSizeOptions = [...new Set([pageSize, ...pageSizeOptions])].sort(
    (a, b) => a - b
  )

  return (
    <div className="flex items-center justify-between px-4">
      {(selectedRowsCount || alwaysShowSelectedRowsCount) && (
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {selectedRowsCount || 0} {dict.of} {totalRowsCount}{' '}
          {dict.rowsSelected}
        </div>
      )}
      <div className="ml-auto flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            {dict.rowsPerPage}
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={value => {
              onPageSizeChange(Number(value))
            }}
          >
            <SelectTrigger className="w-20" id="rows-per-page">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {allPageSizeOptions.map(size => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          {dict.page} {pageIndex + 1} {dict.of} {pageCount}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={onGoToFirstPage}
            disabled={!canGoToPreviousPage}
          >
            <span className="sr-only">{dict.goToFirstPage}</span>
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={onGoToPreviousPage}
            disabled={!canGoToPreviousPage}
          >
            <span className="sr-only">{dict.goToPreviousPage}</span>
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={onGoToNextPage}
            disabled={!canGoToNextPage}
          >
            <span className="sr-only">{dict.goToNextPage}</span>
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={onGoToLastPage}
            disabled={!canGoToNextPage}
          >
            <span className="sr-only">{dict.goToLastPage}</span>
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";

export interface ProductFormType {
  _id?: any;
  name?: string | null;
  category?: string | null;
  price?: number | null;
}

export default function ProductForm({
  _id,
  name,
  category,
  price,
}: ProductFormType) {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Producto</TableColumn>
        <TableColumn>Categoría</TableColumn>
        <TableColumn>Precio</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow key={_id}>
          <TableCell>{name}</TableCell>
          <TableCell>{category}</TableCell>
          <TableCell>$ {price}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

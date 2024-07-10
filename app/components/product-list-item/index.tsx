"use client";

import React, { FormEvent, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  ChipProps,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { AiOutlineDollar } from "react-icons/ai";
import Modal from "../modal";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

interface Product {
  _id: string;
  name: string;
  price: number;
  measures: string[];
  category: string;
  pics: string[];
}

interface ProductListItemProps {
  products: Product[];
}

const ProductListItem: React.FC<ProductListItemProps> = ({ products }) => {
  const { onOpenChange } = useDisclosure();
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [sellOpen, setSellOpen] = useState<boolean>(false);

  console.log("Products:", products); // Añade esto para inspeccionar los datos

  const renderCell = React.useCallback(
    (product: Product, columnKey: React.Key) => {
      const cellValue = product[columnKey as keyof Product];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: `${product.pics[0]}` }}
              description={`$${product.price}`}
              name={cellValue}
            />
          );
        case "category":
          return <p className="text-bold text-sm capitalize">{cellValue}</p>;

        case "measures":
          return (
            <p className="text-sm">
              {product.measures && product.measures.length > 0
                ? product.measures.join(", ")
                : "No measures"}
            </p>
          );

        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Detalles">
                <span className="text-2xl md:text-xl text-default-400 cursor-pointer active:opacity-50">
                  <FaEye />
                </span>
              </Tooltip>
              <Tooltip content="Editar producto">
                <span className="text-2xl md:text-xl text-default-400 cursor-pointer active:opacity-50">
                  <MdEdit />
                </span>
              </Tooltip>
              <Tooltip color="success" content="Cargar venta">
                <span className="text-2xl md:text-xl text-success cursor-pointer active:opacity-50">
                  <AiOutlineDollar />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Borrar producto">
                <span className="text-2xl md:text-xl text-danger cursor-pointer active:opacity-50">
                  <Button className="bg-transparent text-danger">
                    <MdDelete />
                  </Button>
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const columns = [
    { name: "Nombre", uid: "name" },
    { name: "Precio", uid: "price" },
    { name: "Categoria", uid: "category" },
    { name: "Medidas", uid: "measures" },
    { name: "", uid: "actions" },
  ];

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={products}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ProductListItem;

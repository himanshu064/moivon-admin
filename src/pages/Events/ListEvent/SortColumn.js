import React from "react";
import { Th } from "@chakra-ui/react";
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import styles from "./sortColumn.module.css";

export const SORT_ORDERS = {
  ASC: "asc",
  DESC: "desc",
};

const SortColumn = ({ name, sortBy, orderBy, onSort }) => {
  return (
    <Th>
      <span className={styles.sortColumnContainer}>
        <span>{name}</span>
        {onSort && (
          <span className={styles.sortIconsContainer}>
            {orderBy === "" && (
              <BsArrowDownShort
                size={20}
                color="lightgray"
                title={`Sort ${name}`}
                onClick={() => onSort(sortBy, SORT_ORDERS.ASC)}
              />
            )}
            {orderBy === SORT_ORDERS.ASC && (
              <BsArrowDownShort
                size={20}
                onClick={() => onSort(sortBy, SORT_ORDERS.DESC)}
              />
            )}
            {orderBy === SORT_ORDERS.DESC && (
              <BsArrowUpShort
                size={20}
                onClick={() => onSort(sortBy, SORT_ORDERS.ASC)}
              />
            )}
          </span>
        )}
      </span>
    </Th>
  );
};

export default SortColumn;

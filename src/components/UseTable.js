import React, { useState } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    makeStyles,
    TableSortLabel,
} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";

const useStyles = makeStyles((theme) => ({
    table: {
        "& thead th": {
            fontWeight: "600",
            color: "#fff",
            backgroundColor: "#3fc1c9",
        },
        "& tbody td": {
            fontWeight: "300",
        },
        "& tbody tr:hover": {
            backgroundColor: "rgba(51, 57, 150, 0.04)",
            cursor: "pointer",
        },
    },
    container: {
        maxHeight: "75vh",
        display: "flex",
        flexDirection: "column"
    },
    sortLabel: {
        color: "#fff",
        "& $icon": {
            opacity: 1,
            color: "#fff",
        },
        "&:hover": {
            color: "#fff",
            opacity: 1,
            "&& $icon": {
                opacity: 1,
                color: "#fff",
            },
        },
    },
    tablecell: {
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1),
        },
    },
}));

export default function useTable(records, headCells, filterFn) {
    const classes = useStyles();

    const [order, setOrder] = useState();
    const [orderBy, setOrderBy] = useState();

    const TblContainer = (props) => (
        <TableContainer className={classes.container}>
            <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.table}
            >
                {props.children}
            </Table>
        </TableContainer>
    );

    const TblHead = (props) => {
        const handleSortRequest = (cellId) => {
            const isAsc = orderBy === cellId && order === "asc";
            setOrder(isAsc ? "desc" : "asc");
            setOrderBy(cellId);
        };

        return (
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            className={classes.tablecell}
                            key={headCell.id}
                            sortDirection={
                                orderBy === headCell.id ? order : false
                            }
                            align={headCell.align}
                        >
                            {headCell.disableSorting ? (
                                headCell.label
                            ) : (
                                <TableSortLabel
                                    className={classes.sortLabel}
                                    active={orderBy === headCell.id}
                                    direction={
                                        orderBy === headCell.id ? order : "asc"
                                    }
                                    onClick={() => {
                                        handleSortRequest(headCell.id);
                                    }}
                                >
                                    {headCell.label}
                                </TableSortLabel>
                            )}
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    };

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function getComparator(order, orderBy) {
        return order === "desc"
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const recordsAfterSorting = () => {
        return stableSort(filterFn.fn(records), getComparator(order, orderBy));
    };

    return {
        TblContainer,
        TblHead,
        recordsAfterSorting,
    };
}

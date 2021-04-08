import React, { useEffect, useState } from "react";
import UseTable from "./UseTable";
import Input from "./Input";
import {
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Toolbar,
    InputAdornment,
    makeStyles,
} from "@material-ui/core";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Search } from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles((theme) => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3),
    },
    searchInput: {
        flex: 1,
    },
    toolBar: {
        padding: theme.spacing(1),
    },
    tblContent: {
        margin: theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(5),
        },
    },
    tablecell: {
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(1),
        },
    },
    fillExpand: {
        flex: 1,
        minHeight: 0,
        overflow: "scroll"
    }
}));

const ManageKeyword = () => {
    const classes = useStyles();

    let newPlayersData = [];

    let newTeamsData = [];

    const newHeadCells = [
        { id: "image", label: "Player", align: "center", disableSorting: true },
        { id: "name", label: "Name", align: "center", disableSorting: true },
        { id: "skill", label: "Skill", align: "center", disableSorting: true },
        { id: "value", label: "Value", align: "center", disableSorting: true },
        {
            id: "matches",
            label: "Upcoming Match",
            align: "center",
            disableSorting: true,
        },
    ];

    const [playersData, setPlayersData] = useState(newPlayersData);

    const [TeamData, setTeamsData] = useState(newTeamsData);

    const [filterFn, setFilterFn] = useState({
        fn: (items) => {
            return items;
        },
    });

    const { TblContainer, TblHead, recordsAfterSorting } = UseTable(
        playersData,
        newHeadCells,
        filterFn
    );

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const apiUrl = `https://api.npoint.io/20c1afef1661881ddc9c`;
        setLoading(true);
        axios.get(apiUrl).then((res) => {
            const responseData = res.data || [];
            setLoading(false);
            console.log("responseData :", responseData);
            setPlayersData(responseData.playerList);
            setTeamsData(responseData.teamsList);
        });
    }, [setPlayersData]);

    const handleSearch = (e) => {
        let target = e.target;
        setFilterFn({
            fn: (items) => {
                if (target.value == "") return items;
                else
                    return items.filter(
                        (x) =>
                            x.PFName.toLowerCase().includes(target.value) ||
                            x.TName.toLowerCase().includes(target.value)
                    );
            },
        });
    };

    const getUpcomingMatch = (upComingMatchesList = []) => {
        if (upComingMatchesList.length !== 0) {
            if (
                upComingMatchesList[0].CCode &&
                upComingMatchesList[0].VsCCode
            ) {
                const match = `${upComingMatchesList[0].CCode} vs ${upComingMatchesList[0].VsCCode}`;
                return match;
            }
        }
    };

    const getMAtchDateTime = (upComingMatchesList = []) => {
        if (upComingMatchesList.length !== 0) {
            if (upComingMatchesList[0].MDate) {
                const date = new Date(`${upComingMatchesList[0].MDate} UTC`);
                return date.toLocaleString();
            }
        }
    };

    return (
        <>
            <Paper>
                <Toolbar className={classes.toolBar}>
                    <Input
                        label="Search"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                        onChange={handleSearch}
                    />
                </Toolbar>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <TblContainer className={classes.tblContent}>
                        <TblHead />

                        <TableBody className={classes.fillExpand}>
                            {recordsAfterSorting().map((record) => (
                                <TableRow key={record.Id}>
                                    <TableCell
                                        className={classes.tablecell}
                                        style={{
                                            justifyContent: "center",
                                            display: "flex",
                                        }}
                                    >
                                        <Avatar
                                            alt="Remy Sharp"
                                            src={record.Id + ".jpg"}
                                        />
                                    </TableCell>
                                    <TableCell
                                        className={classes.tablecell}
                                        align="center"
                                    >
                                        {record.PFName}
                                    </TableCell>
                                    <TableCell
                                        className={classes.tablecell}
                                        align="center"
                                    >
                                        {record.SkillDesc}
                                    </TableCell>
                                    <TableCell
                                        className={classes.tablecell}
                                        align="center"
                                    >
                                        ${record.Value} M
                                    </TableCell>
                                    <TableCell
                                        className={classes.tablecell}
                                        align="center"
                                    >
                                        {getUpcomingMatch(
                                            record.UpComingMatchesList
                                        )}{" "}
                                        &nbsp;&nbsp;{" "}
                                        {getMAtchDateTime(
                                            record.UpComingMatchesList
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TblContainer>
                )}
            </Paper>
        </>
    );
};

export default ManageKeyword;

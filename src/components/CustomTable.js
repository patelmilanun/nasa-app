import { useState } from 'react';
import {
  Box,
  Paper,
  Chip,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Pagination,
  CircularProgress,
  LinearProgress,
  Typography,
  IconButton,
  Dialog,
  Stack,
  Link,
  DialogContent,
  Divider,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { MdClose } from 'react-icons/md';
import { FiYoutube } from 'react-icons/fi';
import { SiWikipedia } from 'react-icons/si';
import moment from 'moment';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F4F5F7',
    color: '#4B5563',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  'td, th': {
    border: 0,
  },
}));

const CustomChip = styled(Chip)(({ theme }) => ({
  fontFamily: 'Roboto',
  fontWeight: 500,
  padding: '12px 4px',
  verticalAlign: 'baseline',
}));

const CustomBox = styled(Box)(({ theme }) => ({
  minHeight: '530px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const CustomListItem = ({ label, value, divider = true }) => {
  return (
    <>
      <Box my={2}>
        <Grid container>
          <Grid item xs={5}>
            <Typography>{label}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>{value ?? '-'}</Typography>
          </Grid>
        </Grid>
      </Box>
      {divider && <Divider />}
    </>
  );
};

export default function CustomTable({
  launches,
  setPage,
  page,
  totalPages,
  isLoading,
}) {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openDetailModal = (launch) => {
    setDetailDialogOpen(true);
    setSelectedItem(launch);
  };

  const handleClose = () => {
    setDetailDialogOpen(false);
  };

  return (
    <>
      <Box mb={3}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">No:</StyledTableCell>
                <StyledTableCell>Launched (UTC)</StyledTableCell>
                <StyledTableCell>Location</StyledTableCell>
                <StyledTableCell>Mission</StyledTableCell>
                <StyledTableCell>Orbit</StyledTableCell>
                <StyledTableCell align="center">Launch Status</StyledTableCell>
                <StyledTableCell>Rocket</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <StyledTableRow>
                  <StyledTableCell
                    sx={{
                      padding: 0,
                    }}
                    colSpan={7}
                  >
                    {launches.length === 0 && (
                      <CustomBox colSpan={7}>
                        <CircularProgress />
                      </CustomBox>
                    )}
                    {launches.length > 0 && <LinearProgress />}
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {!isLoading && launches.length === 0 && (
                <StyledTableRow>
                  <StyledTableCell
                    sx={{
                      padding: 0,
                    }}
                    colSpan={7}
                  >
                    {launches.length === 0 && (
                      <CustomBox colSpan={7}>
                        <Typography color="#374151" fontSize="14px">
                          No results found for the specified filter
                        </Typography>
                      </CustomBox>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {launches.map((launch, index) => (
                <StyledTableRow
                  style={{ cursor: 'pointer' }}
                  onClick={() => openDetailModal(launch)}
                  hover
                  key={launch.id}
                >
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    {moment(launch.date_utc)
                      .utc()
                      .format('DD MMMM YYYY [at] HH:mm')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {launch?.launchpad?.name ?? '-'}
                  </StyledTableCell>
                  <StyledTableCell>{launch?.name ?? '-'}</StyledTableCell>
                  <StyledTableCell>
                    {launch?.payloads?.[0]?.orbit ?? '-'}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <CustomChip
                      sx={
                        launch?.success
                          ? {
                              color: '#03543F',
                              background: '#DEF7EC',
                            }
                          : launch?.upcoming
                          ? {
                              color: '#92400F',
                              background: '#FEF3C7',
                            }
                          : {
                              color: '#981B1C',
                              background: '#FDE2E1',
                            }
                      }
                      label={
                        launch?.success
                          ? 'Success'
                          : launch?.upcoming
                          ? 'Upcoming'
                          : 'Failed'
                      }
                      size="small"
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {launch?.rocket?.name ?? '-'}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Pagination
        sx={{
          justifyContent: 'right',
          display: 'flex',
        }}
        page={page ?? 1}
        count={totalPages}
        variant="outlined"
        shape="rounded"
        onChange={(event, value) => setPage(value)}
      />
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={detailDialogOpen}
        onClose={handleClose}
      >
        <DialogContent>
          <Box textAlign="right">
            <IconButton component="span" onClick={handleClose}>
              <MdClose />
            </IconButton>
          </Box>
          <Stack px={2}>
            <Grid container spacing={3}>
              <Grid item>
                <img
                  width="72"
                  alt=""
                  src={
                    selectedItem?.links?.patch?.small ?? 'static/no-image.png'
                  }
                />
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontWeight: '500',
                    display: 'inline',
                    marginRight: '28px',
                    color: '#1F2937',
                    fontSize: '18px',
                  }}
                >
                  {selectedItem?.name}
                </Typography>
                <CustomChip
                  sx={
                    selectedItem?.success
                      ? {
                          color: '#03543F',
                          background: '#DEF7EC',
                        }
                      : selectedItem?.upcoming
                      ? {
                          color: '#92400F',
                          background: '#FEF3C7',
                        }
                      : {
                          color: '#981B1C',
                          background: '#FDE2E1',
                        }
                  }
                  label={
                    selectedItem?.success
                      ? 'Success'
                      : selectedItem?.upcoming
                      ? 'Upcoming'
                      : 'Failed'
                  }
                  size="small"
                />
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#374151',
                    fontSize: '12px',
                  }}
                >
                  {selectedItem?.rocket?.name}
                </Typography>
                <Grid container>
                  <Grid item>
                    <IconButton
                      sx={{ marginLeft: '-8px' }}
                      href={selectedItem?.links?.article}
                      target="_blank"
                      rel="noopener"
                    >
                      <img height="16" src="static/nasa.svg" alt="nasa" />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      href={selectedItem?.links?.wikipedia}
                      target="_blank"
                      rel="noopener"
                    >
                      <SiWikipedia size="16px" />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      href={selectedItem?.links?.webcast}
                      target="_blank"
                      rel="noopener"
                    >
                      <FiYoutube size="16px" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box mt={2} mb={4}>
              <Typography
                sx={{
                  fontWeight: '400',
                  color: '#1F2937',
                  fontSize: '14px',
                  lineHeight: '24px',
                }}
              >
                {selectedItem?.details ?? 'No description available.'}
                {selectedItem?.links?.wikipedia && (
                  <Typography
                    component={Link}
                    underline="none"
                    target="_blank"
                    rel="noopener"
                    href={selectedItem?.links?.wikipedia}
                    sx={{
                      fontWeight: '500',
                      color: '#5469d4',
                      fontSize: '14px',
                      lineHeight: '24px',
                      marginLeft: '8px',
                    }}
                  >
                    Wikipedia
                  </Typography>
                )}
              </Typography>
            </Box>
            <CustomListItem
              label="Flight Number"
              value={selectedItem?.flight_number}
            />
            <CustomListItem label="Mission Name" value={selectedItem?.name} />
            <CustomListItem
              label="Rocket Type"
              value={selectedItem?.rocket?.type}
            />
            <CustomListItem
              label="Rocket Name"
              value={selectedItem?.rocket?.name}
            />
            <CustomListItem
              label="Manufacturer"
              value={selectedItem?.payloads?.[0]?.manufacturers?.[0]}
            />
            <CustomListItem
              label="Nationality"
              value={selectedItem?.payloads?.[0]?.nationalities?.[0]}
            />
            <CustomListItem
              label="Launch Date"
              value={
                selectedItem?.date_utc
                  ? moment(selectedItem.date_utc)
                      .utc()
                      .format('DD MMMM YYYY HH:mm')
                  : '-'
              }
            />
            <CustomListItem
              label="Payload Type"
              value={selectedItem?.payloads?.[0]?.type}
            />
            <CustomListItem
              label="Orbit"
              value={selectedItem?.payloads?.[0]?.orbit}
            />
            <CustomListItem
              label="Launch Site"
              value={selectedItem?.launchpad?.name}
              divider={false}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

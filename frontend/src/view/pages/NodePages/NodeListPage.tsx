import React from 'react'
import { connect } from 'react-redux'
import Switch from '@material-ui/core/Switch'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import TablePagination from '@material-ui/core/TablePagination'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import { NodeTypes } from './../../../types'
import moment from 'moment'

import {
  FormControlLabelStyled,
  TableWrapper,
  TableCellStyled,
  TableHeadStyled,
  ApproveButton,
} from './styles'

function createData(domain: string, author: string, created: string, aproved: string, description: string): NodeTypes.Node {
  return { domain, author, created, aproved, description }
}

interface Props {
  list: NodeTypes.Node[],
}

interface State {
  currentPage: number,
  rowsPerPage: number,
  showList: NodeTypes.Node[],
  isFilterChecked: boolean,
}

class NodeList extends React.Component<Props, State> {

  state = {
    currentPage: 0,
    rowsPerPage: 5,
    showList: [],
    isFilterChecked: false,
  }

  onChangePage = (event, newPage) => {
    this.setState({
      currentPage: newPage
    })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      currentPage: 0
    })
  }

  sortByDate = (data: NodeTypes.Node[]) => {
    return data.sort((a, b) => {
      return moment(b.created).diff(a.created)
    })
  }

  onFilterChange = (event) => {
    const { list } = this.props
    const { checked } = event.target

    this.setState({
      isFilterChecked: event.target.checked,
      showList: (checked) ? list.filter((item: NodeTypes.Node) => item.aproved) : list
    })
  }

  onBackButtonClick = (event) => {
    const { currentPage } = this.state
    this.onChangePage(event, currentPage - 1)
  }

  onNextButtonClick = (event) => {
    const { currentPage } = this.state
    this.onChangePage(event, currentPage + 1)
  }

  componentDidMount() {
    this.setState({
      showList: this.sortByDate(this.props.list)
    })
  }

  render() {
    const { currentPage, rowsPerPage, showList } = this.state

    return (
      <>
        <FormControlLabelStyled
          label="Filter approved"
          control={
            <Switch
              onChange={this.onFilterChange}
              color="primary"
              size="small"
            />
          } />
        <TableWrapper>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHeadStyled>
                <TableRow>
                  <TableCell>IP / Domain</TableCell>
                  <TableCell align="center">Requested by</TableCell>
                  <TableCell align="center">Requested</TableCell>
                  <TableCell align="center">Approved</TableCell>
                  <TableCell align="right">Description</TableCell>
                  <TableCell />
                </TableRow>
              </TableHeadStyled>
              <TableBody>
                {(rowsPerPage > 0
                  ? showList.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  : showList
                ).map((row: NodeTypes.Node) => (
                  <TableRow key={row.domain}>
                    <TableCell component="th" scope="row">
                      {row.domain}
                    </TableCell>
                    <TableCell align="center">{row.author}</TableCell>
                    <TableCell align="center">{moment(row.created).format('DD, MMMM YYYY, h:mm a')}</TableCell>
                    <TableCell align="center">{
                      (row.aproved) ?  moment(row.aproved).format('DD, MMMM YYYY, h:mm a') :
                        <ApproveButton
                          variant="contained"
                          color="primary"
                        >Approve
                      </ApproveButton>
                    }</TableCell>
                    <TableCell align="right">{row.description}</TableCell>
                    <TableCellStyled align="right">
                      <IconButton color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCellStyled>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={showList.length}
              rowsPerPage={rowsPerPage}
              page={currentPage}
              onChangePage={this.onChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </TableContainer>
        </TableWrapper>
      </>
    )
  }
}

const mapStateToProps = () => ({
  list: [
    createData('440.com', 'info@google.com', '2020-06-10T03:24:00', '2020-06-10T04:24:00', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('441.com', 'info@google.com', '2020-06-15T03:24:00', '', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('442.com', 'info@google.com', '2020-05-17T03:24:00', '', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('443.com', 'info@google.com', '2020-04-14T03:24:00', '2020-04-15T03:24:00', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('444.com', 'info@google.com', '2020-06-11T03:24:00', '2020-06-12T03:24:00', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('445.com', 'info@google.com', '2020-06-17T03:24:00', '', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
  ]
})

export default connect(mapStateToProps)(NodeList)
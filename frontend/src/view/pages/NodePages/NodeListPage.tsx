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
  page: number,
  rowsPerPage: number,
  showList: NodeTypes.Node[],
  isFilterChecked: boolean,
}

class NodeList extends React.Component<Props, State> {

  state = {
    page: 0,
    rowsPerPage: 5,
    showList: [],
    isFilterChecked: false,
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
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

  componentDidMount() {
    this.setState({
      showList: this.props.list
    })
  }

  render() {
    const { page, rowsPerPage, showList } = this.state

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
                {showList.map((row: NodeTypes.Node) => (
                  <TableRow key={row.domain}>
                    <TableCell component="th" scope="row">
                      {row.domain}
                    </TableCell>
                    <TableCell align="center">{row.author}</TableCell>
                    <TableCell align="center">{row.created}</TableCell>
                    <TableCell align="center">{
                      (row.aproved) ? row.aproved :
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
              page={page}
              onChangePage={this.handleChangePage}
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
    createData('440.com', 'info@google.com', 'jule 5, 2020', 'jule 6, 2020', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('441.com', 'info@google.com', 'jule 5, 2020', '', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('442.com', 'info@google.com', 'jule 5, 2020', '', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('443.com', 'info@google.com', 'jule 5, 2020', 'ule 6, 2020', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('444.com', 'info@google.com', 'jule 5, 2020', 'ule 6, 2020', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
    createData('445.com', 'info@google.com', 'jule 5, 2020', '', 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt, soluta!'),
  ]
})

export default connect(mapStateToProps)(NodeList)
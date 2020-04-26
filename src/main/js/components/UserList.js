import React from "react"
import {Button, Container, Pagination,
        PaginationItem, PaginationLink, Table} from "reactstrap"
import {Link, withRouter} from 'react-router-dom'
import UserItem from './UserItem'
import Loading from "./Loading"
import Message from "./Message"
import LoadingPagination from "./LoadingPagination"


class UserList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {isLoadingPagination: props.isLoadingPagination || false}
    this.handleNavFirst = this.handleNavFirst.bind(this)
    this.handleNavPrev = this.handleNavPrev.bind(this)
    this.handleNavNext = this.handleNavNext.bind(this)
    this.handleNavLast = this.handleNavLast.bind(this)
  }

  _handleNavFirst(e, link) {
    e.preventDefault()
    this.setState({isLoadingPagination: true})
    this.props.onNavigate(this.props.links[link].href)
              .then(()=>this.setState({isLoadingPagination: false}))
  }

  handleNavFirst(e) { this._handleNavFirst(e, "first") }
  handleNavPrev(e) { this._handleNavFirst(e, "prev") }
  handleNavNext(e) { this._handleNavFirst(e, "next") }
  handleNavLast(e) { this._handleNavFirst(e, "last") }

  render() {
    const navLinks = this.getNavLinks()
    return (
      <Container fluid>
        <div className="float-right">
          <Button color="success" tag={Link} to="/users/create">Add User</Button>
        </div>
        <h3>Users</h3>
        <Table className="mt-4">
          <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Notes</th>
            <th width="8%"></th>
          </tr>
          </thead>
          <tbody>
            {this.props.isLoadingUsers &&
              <tr key="isLoadingUsers">
                <td><Loading/></td>
              </tr>
            }
            {!this.props.isLoadingUsers &&
              this.props.users.map(user =>
                <UserItem key={user._links.self.href} user={user}
                          onDelete={this.props.onDelete}
                          onUpdate={this.props.onUpdate}/>
              )
            }
          </tbody>
        </Table>
        {navLinks.length > 0 &&
          <>
            <Pagination>
              {navLinks}
              {this.state.isLoadingPagination &&
                <LoadingPagination/>
              }
            </Pagination>
          </>
        }
        {this.props.error &&
          <Message error={this.props.error}/>
        }
      </Container>
    )
  }

  getNavLinks() {
    const navLinks = []
    if ("first" in this.props.links) {
      navLinks.push(
        <PaginationItem key="first">
          <PaginationLink first onClick={this.handleNavFirst} />
        </PaginationItem>
      )
    }
    if ("prev" in this.props.links) {
      navLinks.push(
        <PaginationItem key="previous">
          <PaginationLink previous onClick={this.handleNavPrev} />
        </PaginationItem>
      )
    }
    if ("next" in this.props.links) {
      navLinks.push(
        <PaginationItem key="next">
          <PaginationLink next onClick={this.handleNavNext} />
        </PaginationItem>
      )
    }
    if ("last" in this.props.links) {
      navLinks.push(
        <PaginationItem key="last">
          <PaginationLink last onClick={this.handleNavLast} />
        </PaginationItem>
      )
    }
    return navLinks
  }
}

export default withRouter(UserList)

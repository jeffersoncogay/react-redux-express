import React, { userState, PureComponent } from 'react'
import { connect } from 'react-redux'
import { userSelector } from '../redux/selectors'
import {
  Avatar,
  FontIcon,
  List,
  ListItem,
  Button
} from 'react-md'

import UserDialog from '../components/Dialogs/UserDialog'
import ConfirmDialog from '../components/Dialogs/ConfirmDialog.js'
import validateInput from '../validations/user'

import {
  GetUserList,
  CreateUser,
  UpdateUser,
  DeleteUser,
  ShowDialog
} from '../redux/actions'

const INITIAL_STATE = {
  id: '',
  company: '',
  website: '',
  name: '',
  errors: {}
}

class Home extends PureComponent {

  state = INITIAL_STATE

  componentDidMount() {
    this.props.dispatch(GetUserList())
  }

  handleDialog = (show, data = null) => {
    const { ...rest } = this.state
    if (data) {
      rest.id = data.id,
      rest.website = data.website
      rest.name = data.name
      rest.company = data.company.name
    }

    let nextState = {
      ...rest,
      errors: {}
    }

    if (!show) {
      nextState = INITIAL_STATE
    }
    this.setState(nextState, () => {
      this.props.dispatch(ShowDialog(show))
    })
  }

  handleDelete = (user) => {
    this.selected = user
    this.props.dispatch(ShowDialog({ type: 'delete' }))
  }

  handleSave = () => {
    const formData = { ...this.state }
    delete formData.errors

    const validate = validateInput(formData)

    if (validate.isValid) {
      if (formData.id) {
        this.props.dispatch(UpdateUser(formData))
      } else {
        this.props.dispatch(CreateUser(formData))
      }
    } else {
      this.setState({
        errors: validate.errors
      })
    }
  }

  handleChange = (data, type) => {
    this.setState((prevState) => {
      const errors = { ...prevState.errors }
      delete errors[type]

      return {
        ...prevState,
        [type]: data,
        errors
      }
    })
  }

  handleConfirm = () => {
    this.props.dispatch(DeleteUser(this.selected.id))
  }

  render() {
    const {
      user: { list },
      dialog
    } = this.props
    const {
      errors,
      ...restState
    } = this.state

    return (
      <div>
        <div className='md-cell md-grid md-cell--12'>
        <div className='md-cell md-cell--12'>
          <span style={{ fontSize: '30px' }}>Welcome People!</span>
          <Button
            raised primary iconChildren='add'
            style={{ left: '10px' }}
            onClick={() => this.handleDialog({ type: 'add' })}
          >
            Add User
          </Button>
        </div>
        {
          list && list.length
          && list.map((e, i) => (
            <div key={i.toString()} className='md-cell md-cell--4'>
              <List className="md-paper md-paper--1">
                <div
                  style={{ backgroundColor: '#6b57b726' }}
                  className='md-fake-btn md-pointer--hover md-fake-btn--no-outline md-list-tile md-list-tile--two-lines md-text'
                >
                  <span>{`${e.name}`}</span>
                  <Button
                    style={{ position: 'absolute', right: '10px' }}
                    icon
                    primary
                    onClick={() => this.handleDialog({ type: 'edit' }, e)}
                  >edit</Button>
                  <Button
                    style={{ position: 'absolute', right: '50px' }}
                    icon
                    primary
                    onClick={() => this.handleDelete(e)}
                  >delete</Button>
                </div>
                <ListItem
                  leftAvatar={<Avatar icon={<FontIcon>work</FontIcon>} />}
                  primaryText="Company"
                  secondaryText={e.company.name}
                />
                <ListItem
                  leftAvatar={<Avatar icon={<FontIcon>public</FontIcon>} />}
                  primaryText="Website"
                  secondaryText={e.website}
                />
              </List>
            </div>
          ))
        }
        </div>
        {
          (dialog && (['edit', 'add'].includes(dialog.type))) &&
          <UserDialog
            data={restState}
            onCloseDialog={() => this.handleDialog(false)}
            onSave={this.handleSave}
            onChange={this.handleChange}
            errors={errors}
            title={dialog.type === 'add' ? 'Add User' : 'Edit User'}
          />
        }
        {
          (dialog && dialog.type === 'delete') &&
          <ConfirmDialog
            onCloseDialog={() => this.handleDialog(false)}
            onConfirm={this.handleConfirm}
            message={`Are you sure you want to delete ${this.selected.name}?`}
          />
        }
      </div>
    )
  }
}

export default connect(userSelector)(Home)

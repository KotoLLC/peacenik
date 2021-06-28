import React, { useState, useEffect } from 'react'
import { useUpdateUserById } from '../utils/services'

interface updateUser {
  id: number
  name: string
}

const UpdateUser = (props: updateUser) => {
  const [updateUserById] = useUpdateUserById()
  const { id, name } = props
  const [values, setValues] = useState({
    id: id,
    name: name,
  })
  useEffect(() => {
    setValues({
      ...values,
      id: id,
      name: name,
    })
  }, [id, name])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target
    const val = target.value
    setValues({
      ...values,
      name: val,
    })
  }

  const updateUser = async () => {
    try {
      const updatedUser = await updateUserById({
        variables: {
          id: values.id,
          UserPatch: {
            name: values.name,
          },
        },
      })
      if (
        updatedUser &&
        updatedUser.data &&
        updatedUser.data.updateUserById
      ) {
        alert('Data updated successfully!')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (values.name && values.id) {
      updateUser()
    } else {
      alert('Invalid user details')
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          id="name"
          value={values.name}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </>
  )
}

export default UpdateUser
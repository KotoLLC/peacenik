export const getHeaderConfig = () => {
  const authToken = JSON.parse(localStorage.getItem('peacenikAuthToken')!)
  return ({
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${authToken}`,
    }
  })
}

function update(value: string) {
  if (value) {
    localStorage.setItem('token', `Bearer ${value}`)
  } 
}

function getCurrent(): string {
  return localStorage.getItem('token') as string
}

export const token = {
  update,
  getCurrent,
}
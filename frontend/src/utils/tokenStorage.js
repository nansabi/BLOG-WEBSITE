const USER_KEY = "user"
const TOKEN_KEY = "token"

/* =========================
   USER STORAGE
========================= */

// Save user safely
export const saveUser = (user) => {
  if (!user) return

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (err) {
    console.error("❌ Error saving user:", err)
  }
}

// Get user safely
export const getUser = () => {
  try {
    const data = localStorage.getItem(USER_KEY)

    if (!data || data === "undefined" || data === "null") {
      return null
    }

    return JSON.parse(data)
  } catch (err) {
    console.error("❌ Error parsing user:", err)
    return null
  }
}

// Remove user
export const removeUser = () => {
  localStorage.removeItem(USER_KEY)
}

/* =========================
   TOKEN STORAGE
========================= */

// Save token safely
export const saveToken = (token) => {
  if (!token) return

  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (err) {
    console.error("❌ Error saving token:", err)
  }
}

// Get token safely
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (!token || token === "undefined" || token === "null") {
    return null
  }

  return token
}

// Remove token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

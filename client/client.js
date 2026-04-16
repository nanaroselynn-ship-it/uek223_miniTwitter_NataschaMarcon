if (location.host.includes('localhost')) {
  document.write(
    '<script src="http://' +
      (location.host || 'localhost').split(':')[0] +
      ':35730/livereload.js?snipver=1"></' +
      'script>'
  )
}

const API_BASE = 'http://localhost:4200/api'

let currentUser = null

const statusMessage = document.getElementById('status-message')
const currentUserText = document.getElementById('current-user')
const postsContainer = document.getElementById('posts')

function setStatus(message) {
  statusMessage.textContent = message
}

function updateCurrentUserUI() {
  if (currentUser) {
    currentUserText.textContent = `${currentUser.username} (ID: ${currentUser.id}, Rolle: ${currentUser.role})`
  } else {
    currentUserText.textContent = 'Nicht eingeloggt'
  }
}

async function loadPosts() {
  try {
    const response = await fetch(`${API_BASE}/posts`)
    const data = await response.json()

    postsContainer.innerHTML = ''

    const posts = data.posts || []

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p>Keine Beiträge vorhanden.</p>'
      return
    }

    posts.forEach((post) => {
      const postElement = document.createElement('div')
      postElement.className = 'post'

      postElement.innerHTML = `
        <div class="post-meta">
          Post-ID: ${post.id} | User-ID: ${post.authorId}
        </div>
        <div>${post.content}</div>
      `

      postsContainer.appendChild(postElement)
    })
  } catch (error) {
    setStatus('Fehler beim Laden der Beiträge')
    console.error(error)
  }
}

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  const username = document.getElementById('register-username').value
  const password = document.getElementById('register-password').value

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()
    setStatus(data.message || 'Registrierung abgeschlossen')
  } catch (error) {
    setStatus('Fehler bei der Registrierung')
    console.error(error)
  }
})

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  const username = document.getElementById('login-username').value
  const password = document.getElementById('login-password').value

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (data.user) {
      currentUser = data.user
      updateCurrentUserUI()
    }

    setStatus(data.message || 'Login abgeschlossen')
  } catch (error) {
    setStatus('Fehler beim Login')
    console.error(error)
  }
})

document.getElementById('post-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!currentUser) {
    setStatus('Bitte zuerst einloggen')
    return
  }

  const content = document.getElementById('post-content').value

  try {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        authorId: currentUser.id,
      }),
    })

    const data = await response.json()
    setStatus(data.message || 'Beitrag erstellt')

    document.getElementById('post-content').value = ''
    loadPosts()
  } catch (error) {
    setStatus('Fehler beim Erstellen des Beitrags')
    console.error(error)
  }
})

document.getElementById('load-posts-btn').addEventListener('click', loadPosts)

updateCurrentUserUI()
loadPosts()
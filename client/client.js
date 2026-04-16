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

const authView = document.getElementById('auth-view')
const appView = document.getElementById('app-view')
const statusMessage = document.getElementById('status-message')
const currentUserText = document.getElementById('current-user')
const postsContainer = document.getElementById('posts')
const logoutBtn = document.getElementById('logout-btn')

function setStatus(message) {
  statusMessage.textContent = message
}

function showAuthView() {
  authView.classList.remove('hidden-view')
  authView.classList.add('active-view')

  appView.classList.remove('active-view')
  appView.classList.add('hidden-view')
}

function showAppView() {
  appView.classList.remove('hidden-view')
  appView.classList.add('active-view')

  authView.classList.remove('active-view')
  authView.classList.add('hidden-view')
}

function updateCurrentUserUI() {
  if (currentUser) {
    currentUserText.textContent = `${currentUser.username} (ID: ${currentUser.id}, Rolle: ${currentUser.role})`
    showAppView()
  } else {
    currentUserText.textContent = 'Nicht eingeloggt'
    showAuthView()
  }
}

async function loadComments(postId) {
  const container = document.getElementById(`comments-${postId}`)

  try {
    const response = await fetch(`${API_BASE}/comments/${postId}`)
    const data = await response.json()
    const comments = data.comments || []

    if (comments.length === 0) {
      container.innerHTML = '<p class="empty-text">Keine Kommentare</p>'
      return
    }

    container.innerHTML = comments
      .map(
        (comment) => `
          <div class="comment-item">
            💬 ${comment.content} <span class="post-meta">(User ${comment.authorId})</span>
          </div>
        `
      )
      .join('')
  } catch (error) {
    container.innerHTML = '<p class="empty-text">Fehler beim Laden der Kommentare</p>'
    console.error(error)
  }
}

async function loadPosts() {
  try {
    const response = await fetch(`${API_BASE}/posts`)
    const data = await response.json()
    const posts = data.posts || []

    postsContainer.innerHTML = ''

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p class="empty-text">Keine Beiträge vorhanden.</p>'
      return
    }

    posts.forEach((post) => {
      const postElement = document.createElement('div')
      postElement.className = 'post'

      postElement.innerHTML = `
        <div class="post-meta">
          Post-ID: ${post.id} | User-ID: ${post.authorId}
        </div>

        <div class="post-content">${post.content}</div>

        <div class="reaction-row">
          <span>👍 ${post.likeCount || 0}</span>
          <span>👎 ${post.dislikeCount || 0}</span>
          <button onclick="react(${post.id}, 'LIKE')">👍 Like</button>
          <button onclick="react(${post.id}, 'DISLIKE')">👎 Dislike</button>
          <button onclick="deletePost(${post.id})">🗑 Löschen</button>
        </div>

        <div class="comment-form">
          <input id="comment-input-${post.id}" type="text" placeholder="Kommentar schreiben" />
          <button class="comment-btn">Kommentieren</button>
        </div>

        <div id="comments-${post.id}" class="comments-box">
          <p class="empty-text">Lade Kommentare...</p>
        </div>
      `

      postsContainer.appendChild(postElement)

      const commentBtn = postElement.querySelector('.comment-btn')
      if (commentBtn) {
        commentBtn.addEventListener('click', () => createComment(post.id))
      }

      loadComments(post.id)
    })
  } catch (error) {
    setStatus('Fehler beim Laden der Beiträge')
    console.error(error)
  }
}

async function createComment(postId) {
  if (!currentUser) {
    setStatus('Bitte zuerst einloggen')
    return
  }

  const input = document.getElementById(`comment-input-${postId}`)

  if (!input) {
    setStatus('Kommentarfeld nicht gefunden')
    return
  }

  const content = input.value

  if (!content.trim()) {
    setStatus('Kommentar darf nicht leer sein')
    return
  }

  try {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        authorId: currentUser.id,
        postId,
      }),
    })

    const data = await response.json()
    setStatus(data.message || 'Kommentar erstellt')
    input.value = ''
    loadComments(postId)
  } catch (error) {
    setStatus('Fehler beim Erstellen des Kommentars')
    console.error(error)
  }
}

async function react(postId, type) {
  if (!currentUser) {
    setStatus('Bitte zuerst einloggen')
    return
  }

  try {
    const response = await fetch(`${API_BASE}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        userId: currentUser.id,
        postId,
      }),
    })

    const data = await response.json()
    setStatus(data.message || `Reaction ${type} gespeichert`)
    loadPosts()
  } catch (error) {
    setStatus('Fehler bei Reaction')
    console.error(error)
  }
}

async function deletePost(postId) {
  if (!currentUser) {
    setStatus('Bitte zuerst einloggen')
    return
  }

  const confirmed = confirm('Beitrag wirklich löschen?')

  if (!confirmed) {
    return
  }

  try {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        userRole: currentUser.role,
      }),
    })

    const data = await response.json()
    setStatus(data.message || 'Beitrag gelöscht')
    loadPosts()
  } catch (error) {
    setStatus('Fehler beim Löschen')
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
      loadPosts()
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

logoutBtn.addEventListener('click', () => {
  currentUser = null
  updateCurrentUserUI()
  setStatus('Erfolgreich ausgeloggt')
})

updateCurrentUserUI()

window.react = react
window.deletePost = deletePost
const inputSearch = document.getElementById('input-search')
const btnSearch = document.getElementById('btn-search')

const profileContainer = document.getElementById('profile')
const reposContainer = document.getElementById('repos')
const statusContainer = document.getElementById('status')

const BASE_URL = 'https://api.github.com'

async function fetchUser(userName) {
  const response = await fetch(`${BASE_URL}/users/${userName}`)
  if (!response.ok) throw new Error('Usuário não encontrado')
  return response.json()
}

async function fetchRepos(userName) {
  const response = await fetch(`${BASE_URL}/users/${userName}/repos?sort=updated`)
  if (!response.ok) throw new Error('Erro ao buscar repositórios')
  return response.json()
}

function showLoading() {
  statusContainer.innerHTML = 'Carregando...'
  profileContainer.innerHTML = ''
  reposContainer.innerHTML = ''
}

function showError(message) {
  statusContainer.innerHTML = message
}

function renderProfile(user) {
  profileContainer.innerHTML = `
    <div class="profile-header">
      <img src="${user.avatar_url}">
      
      <div class="profile-info">
        <h2>${user.name || user.login}</h2>
        <p class="bio">${user.bio || 'Não possui bio cadastrada'}</p>

        <div class="profile-stats">
          <div>
            <span>SEGUIDORES</span>
            <strong>${user.followers}</strong>
          </div>
          <div>
            <span>SEGUINDO</span>
            <strong>${user.following}</strong>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderRepos(repos) {
  const lastRepos = repos.slice(0, 10)

  reposContainer.innerHTML = `
    <h2 class="repos-title">Repositórios</h2>
    <div class="repos-grid">
      ${lastRepos.map(repo => `
        <div class="repo-card">
          <h3>
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          </h3>
          <p>⭐ ${repo.stargazers_count}</p>
          <p>🍴 ${repo.forks_count}</p>
          <p>👀 ${repo.watchers_count}</p>
          <p>🧠 ${repo.language || 'N/A'}</p>
        </div>
      `).join('')}
    </div>
  `
}

async function searchUser() {
  const userName = inputSearch.value.trim()

  if (!userName) {
    showError('Digite um usuário')
    return
  }

  try {
    showLoading()

    const user = await fetchUser(userName)
    const repos = await fetchRepos(userName)

    statusContainer.innerHTML = ''
    renderProfile(user)
    renderRepos(repos)

  } catch (error) {
    showError(error.message)
  }
}

btnSearch.addEventListener('click', searchUser)

inputSearch.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchUser()
})
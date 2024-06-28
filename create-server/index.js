require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

const githubData = {
    "login": "rishabhagg7",
    "id": 99592097,
    "node_id": "U_kgDOBe-noQ",
    "avatar_url": "https://avatars.githubusercontent.com/u/99592097?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/rishabhagg7",
    "html_url": "https://github.com/rishabhagg7",
    "followers_url": "https://api.github.com/users/rishabhagg7/followers",
    "following_url": "https://api.github.com/users/rishabhagg7/following{/other_user}",
    "gists_url": "https://api.github.com/users/rishabhagg7/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/rishabhagg7/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/rishabhagg7/subscriptions",
    "organizations_url": "https://api.github.com/users/rishabhagg7/orgs",
    "repos_url": "https://api.github.com/users/rishabhagg7/repos",
    "events_url": "https://api.github.com/users/rishabhagg7/events{/privacy}",
    "received_events_url": "https://api.github.com/users/rishabhagg7/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Rishabh Aggarwal",
    "company": null,
    "blog": "",
    "location": "Delhi",
    "email": null,
    "hireable": true,
    "bio": null,
    "twitter_username": null,
    "public_repos": 31,
    "public_gists": 0,
    "followers": 3,
    "following": 2,
    "created_at": "2022-02-13T10:59:55Z",
    "updated_at": "2024-06-15T12:36:59Z"
  }

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/twitter',(req,res) => {
    res.send('Hello code_rishabh')
})

app.get('/login',(req,res) => {
    res.send('<h1> Please login </h1>')
})

app.get('/github',(req,res) => {
    res.json(githubData)
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${port}`)
})

const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/* Tentei usar um middleware para validar o ID do repositorio e evitar repetir codigo, mas isso impediu de passar nos testes */
// function validateRepoId(request, response, next) {
//   const { id } = request.params;

//   const repositoryIndex = repositories.findIndex(repository => repository.id === id);

//   if (repositoryIndex < 0) {
//     return response.status(400).send();
//   }

//   return next();
// } 

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id:uuid(), title, url, techs, likes:0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { url, title, techs } = request.body;

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  const repository = {
    id,
    url,
    title,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send();
  }
  
  repositories[repositoryIndex].likes ++;

  return response.json({
    likes: repositories[repositoryIndex].likes,
  });
});

module.exports = app;

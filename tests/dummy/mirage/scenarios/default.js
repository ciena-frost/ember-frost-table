import heroes from 'dummy/heroes'

export default function (server) {
  heroes.forEach((hero) => {
    server.create('character', hero)
  })
}

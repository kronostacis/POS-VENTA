describe('API - /api/usuarios - CRUD completo', () => {
  let testUserId = null
  const nuevoUsuario = {
    Id_usuario: Math.floor(Math.random() * 10000000),
    Nombre: 'Juan',
    Apellido_1: 'Pérez',
    Apellido_2: 'Gómez',
    Cargo: 2
  }

  const datosActualizados = {
    Nombre: 'Nombre Actualizado',
    Apellido_1: 'Apellido1 Actualizado',
    Apellido_2: 'Apellido2 Actualizado',
    Cargo: 3
  }

  it('GET /api/usuarios - debería devolver una lista de usuarios', () => {
    cy.request('/api/usuarios').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
    })
  })

  it('POST /api/usuarios - debería crear un nuevo usuario', () => {
    cy.request('POST', '/api/usuarios', nuevoUsuario).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body).to.have.property('Id_usuario', nuevoUsuario.Id_usuario)
      testUserId = response.body.Id_usuario
    })
  })

  it('PUT /api/usuarios/[id] - debería actualizar al usuario', () => {
    cy.request({
      method: 'PUT',
      url: `/api/usuarios/${testUserId}`,
      body: datosActualizados,
      failOnStatusCode: false
    }).then((response) => {  
      expect(response.status).to.eq(200)
      console.log(response)
      expect(response.body.user.Nombre).to.eq(datosActualizados.Nombre)
    })
  })

  it('DELETE /api/usuarios/[id] - debería eliminar al usuario', () => {
    cy.request({
      method: 'DELETE',
      url: `/api/usuarios/${testUserId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.success).to.be.true
    })
  })

  it('GET /api/usuarios/[id] - debería devolver 404 después de eliminarlo', () => {
    cy.request({
      method: 'GET',
      url: `/api/usuarios/${testUserId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})
describe('API - /api/medio_pago - CRUD completo', () => {
  let medioPagoId = null;

  const nuevoMedio = {
    Nombre_pago: 'Transferencia Bancaria',
    Id_estado_medio_pago: 1,
  };

  const medioActualizado = {
    Nombre_pago: 'Transferencia Editada',
  };

  it('GET /api/medio_pago - debe devolver lista', () => {
    cy.request('/api/medio_pago').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
    });
  });

  it('POST /api/medio_pago - debe crear un medio de pago', () => {
    cy.request('POST', '/api/medio_pago', nuevoMedio).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property('Id_pago');
      expect(res.body.Nombre_pago).to.eq(nuevoMedio.Nombre_pago);
      medioPagoId = res.body.Id_pago;
    });
  });

  it('PUT /api/medio_pago/:id - debe actualizar medio de pago', () => {
    cy.request({
      method: 'PUT',
      url: `/api/medio_pago/${medioPagoId}`,
      body: medioActualizado,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.Medio_pago.Nombre_pago).to.eq(medioActualizado.Nombre_pago);
    });
  });

  it('DELETE /api/medio_pago/:id - debe eliminar medio de pago', () => {
    cy.request({
      method: 'DELETE',
      url: `/api/medio_pago/${medioPagoId}`,
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.success).to.be.true;
    });
  });
});

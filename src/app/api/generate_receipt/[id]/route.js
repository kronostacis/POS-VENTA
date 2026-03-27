import { NextResponse } from "next/server";
import { getSaleById, getDetailSale } from "@/app/lib/db/lista_ventas";
import { jsPDF } from "jspdf";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const saleId = Number.parseInt(id);

    // Fetch sale data
    const sale = await getSaleById(saleId);
    if (!sale) {
      return NextResponse.json(
        { success: false, message: "Sale not found" },
        { status: 404 }
      );
    }

    // Fetch sale details
    const saleDetails = await getDetailSale(saleId);

    // Generate PDF
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Comprobante de Venta", 105, 20, null, null, "center");
    doc.setFontSize(10);
    doc.text(
      `Fecha de Emisión: ${new Date().toLocaleDateString("es-CL", { timeZone: "America/Santiago" })}`,
      105,
      28,
      null,
      null,
      "center"
    );

    // Sale Information
    doc.setFontSize(12);
    doc.text(`ID Venta: ${sale.Id_venta}`, 20, 45);
    doc.text(
      `Fecha: ${new Date(sale.Fecha_venta).toLocaleDateString("es-CL", { timeZone: "America/Santiago" })}`,
      20,
      55
    );
    doc.text(`Total: $${sale.Total_venta.toFixed(2)}`, 20, 65);
    doc.text(`Medio de Pago: ${sale.Medio_pagos.Nombre_pago}`, 20, 75);
    doc.text(`Usuario: ${sale.Usuarios.Nombre} ${sale.Usuarios.Apellido_1}`, 20, 85); // Displaying full user name (Nombre and Apellido_1)

    // Sale Details Table Header
    doc.setFontSize(14);
    doc.text("Detalle de Venta:", 20, 105);
    doc.setFontSize(12);
    doc.text("Producto", 20, 115);
    doc.text("Cantidad", 80, 115);
    doc.text("P. Unitario", 120, 115);
    doc.text("P. Total", 170, 115);
    doc.line(15, 118, 195, 118); // Horizontal line

    // Sale Details Table Rows
    let y = 125;
    saleDetails.forEach((detail) => {
      doc.setFontSize(10);
      doc.text(`${detail.Productos.Nombre}`, 20, y);
      doc.text(`${detail.Cantidad}`, 80, y);
      doc.text(
        `$${(detail.Precio_total / detail.Cantidad).toFixed(2)}`,
        120,
        y
      );
      doc.text(`$${detail.Precio_total.toFixed(2)}`, 170, y);
      y += 7;
    });
    doc.line(15, y, 195, y); // Horizontal line after details

    // Footer
    doc.setFontSize(10);
    doc.text(
      "Gracias por su compra!",
      105,
      doc.internal.pageSize.height - 15,
      null,
      null,
      "center"
    );

    const pdfBuffer = doc.output("arraybuffer");
    const headers = {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=comprobante_venta_${saleId}.pdf`,
    };

    return new NextResponse(Buffer.from(pdfBuffer), { headers });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { success: false, message: "Error generating PDF" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

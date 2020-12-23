const express = require('express');
const app = express();
const bodyParser = require('body-parser');

global.window = { document: { createElementNS: () => { return {} } } };
global.navigator = {};
global.btoa = () => {};
global.html2pdf = {};

const PDFDocument = require('pdfkit');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Imports
var uniqid = require('uniqid');
const fs = require('fs');
const path = require('path');
const utf = require('utf8');

/////////////////////////////////////////////////AUTORIZACION DE BLOQUEO///////////////////////////////////
const A4_PDF = (factura) => {
    let empresa = factura[0].empresa;
    let cabecera = factura[0].cabecera;
    let cliente = cabecera.cliente;
    let empleado = cabecera.empleado.nombre;

    let docName = `${empresa._id}_facturaA4${cabecera.numero}.pdf`;
    let pathPDF = path.resolve(__dirname, `../docs/${docName}`);

    writeStream = fs.createWriteStream(pathPDF);

    const doc = new PDFDocument();
    doc.pipe(writeStream);

    generateHeader(doc, empresa, cabecera);
    generateHr(doc, 110);
    generateClientData(doc, cliente, empleado);

    generateDetailTable(doc, factura);
    RecibiConforme(doc, 630);
    generateValueData(doc, cabecera);
    doc.end();

    writeStream.on('finish', () => {

    });

}

function generateHeader(doc, empresa, cabecera) {
    let logoEmp = path.resolve(__dirname, `../../uploads/empresa/${empresa.img}`);
    let fecha = cabecera.fecha;

    fecha = fecha.toISOString().substring(0, 10);
    año = fecha.substring(0, 4);
    mes = fecha.substring(5, 7);
    dia = fecha.substring(8, 10);

    fecha = dia + "/" + mes + "/" + año;

    doc
        .image(logoEmp, 50, 45, { width: 72, height: 56 })
        .fillColor("#444444")
        .fontSize(10)
        .text("Nombre:", 130, 45)
        .text(empresa.razonSocial, 200, 45)
        .text("Ruc:", 130, 60)
        .text(empresa.ruc, 200, 60)
        .text("Teléfono:", 130, 75)
        .text(empresa.telefono, 200, 75)
        .text("Dirección:", 130, 90)
        .text(empresa.direccion, 200, 90)
        .text("# Factura:", 397, 60)
        .fillColor('red')
        .text(cabecera.numero, 445, 60)
        .fillColor("#444444")
        .text("Fecha:", 397, 75)
        .text((fecha), 445, 75)
        .moveDown();
}

function generateClientData(doc, cliente, empleado) {
    cliente.direccion = (cliente.direccion).substring(0, 24);
    empleado = (empleado).substring(0, 24);
    cliente.nombre = (cliente.nombre).substring(0, 30);
    doc
        .fillColor("#444444")
        .fontSize(10)
        .text("Cliente:", 50, 130)
        .text(cliente.nombre, 120, 130)
        .text("CI/Ruc:", 50, 145)
        .text(cliente.ciRuc, 120, 145)
        .text("Teléfono:", 50, 160)
        .text(cliente.telefono, 120, 160)
        .text("Dirección:", 320, 130)
        .text((cliente.direccion), 390, 130)
        .text("Correo:", 320, 145)
        .text(cliente.correo, 390, 145)
        .text("Empleado:", 320, 160)
        .text((empleado), 390, 160)
        .moveDown();
}

function generateTableRow(
    doc,
    y,
    cantidad,
    descripcion,
    pvp,
    subtotal
) {
    doc
        .fontSize(10)
        .text(cantidad, 50, y)
        .text(descripcion, 130, y)
        .text(pvp, 310, y, { width: 90, align: "right" })
        .text(subtotal, 400, y, { width: 150, align: "right" })
}

function generateDetailTable(doc, detalle) {
    let i,
        invoiceTableTop = 200;

    generateHr(doc, invoiceTableTop - 10);

    generateTableRow(
        doc,
        invoiceTableTop,
        "CANT",
        "DESCRIPCIÓN",
        "P.V.P",
        "SUBTOTAL"
    );

    generateHr(doc, invoiceTableTop + 15);

    for (i = 0; i < detalle.length; i++) {
        const item = detalle[i];
        const position = invoiceTableTop + (i + 1) * 23;

        generateTableRow(
            doc,
            position,
            item.cantidad,
            item.producto.descripcion,
            item.producto.pvp,
            Number(item.cantidad * item.producto.pvp).toFixed(2)
        );
    }
}

function generateValueData(doc, cabecera) {

    doc
        .fillColor("#444444")
        .fontSize(10)
        .text("Subtotal 0%:", 430, 600)
        .text(Number(cabecera.subtotal0).toFixed(2), 500, 600, { width: 50, align: "right" })
        .text("Subtotal 12%:", 430, 615)
        .text(Number(cabecera.subtotal12).toFixed(2), 500, 615, { width: 50, align: "right" })
        .text("IVA 12%:", 430, 630)
        .text(Number(cabecera.iva).toFixed(2), 500, 630, { width: 50, align: "right" })
        .text("Total:", 430, 645)
        .text(Number(cabecera.total).toFixed(2), 500, 645, { width: 50, align: "right" })
        .moveDown();
}

function RecibiConforme(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(80, y)
        .lineTo(300, y)
        .stroke()
        .fillColor("#444444")
        .fontSize(10)
        .text("Recibí Conforme", 160, y + 5);
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

module.exports = {
    app,
    A4_PDF,
};
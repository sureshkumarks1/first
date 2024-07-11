let PDFDocument = require("pdfkit");

function buildPdf() {
  const doc = PDFDocument();
  doc.on("data", dataCallback());
  doc.on("end", endCallback());
  doc.fontSize(25).text("something");
  doc.end();
}

module.exports = { buildPdf}

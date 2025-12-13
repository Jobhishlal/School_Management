// import PDFDocument from "pdfkit";
// import streamifier from "streamifier";
// import cloudinary from '../../../infrastructure/config/cloudinary';
// import { InvoiceData } from "../../../presentation/http/interface/InvoiceData";
// import axios from "axios";

// export async function generateAndUploadInvoice(
//   data: InvoiceData
// ): Promise<{ pdfBuffer: Buffer; invoiceUrl: string }> {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 50, size: 'A4' });
//       const buffers: Buffer[] = [];

//       doc.on("data", (chunk) => buffers.push(chunk));
//       doc.on("end", async () => {
//         const pdfBuffer = Buffer.concat(buffers);

//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: "Invoices",
//             resource_type: "raw",
//             public_id: `Invoice-${data.paymentId}`,
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else {
//               resolve({
//                 pdfBuffer,
//                 invoiceUrl: result!.secure_url,
//               });
//             }
//           }
//         );

//         streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
//       });

    
//       const primaryColor = '#2C3E50';
//       const accentColor = '#3498DB';
//       const lightGray = '#ECF0F1';

     
//       let startY = 50;
      
//       if (data.instituteLogo) {
//         try {
//           const response = await axios.get(data.instituteLogo, {
//             responseType: "arraybuffer",
//           });
//           const img = Buffer.from(response.data, "binary");
//           doc.image(img, 50, startY, { width: 70, height: 70 });
//         } catch (err) {
//           console.error("Logo loading failed:", err);
//         }
//       }

//       doc
//         .fontSize(20)
//         .fillColor(primaryColor)
//         .text(data.instituteName, 140, startY, { align: 'left' });

//       doc
//         .fontSize(9)
//         .fillColor('#555555')
//         .text(data.instituteEmail, 140, startY + 25)
//         .text(data.institutePhone, 140, startY + 38)
//         .text(data.instituteAddress, 140, startY + 51, { width: 400 });

//       doc
//         .fontSize(28)
//         .fillColor(accentColor)
//         .text('INVOICE', 400, startY, { align: 'right' });

//       doc
//         .fontSize(10)
//         .fillColor('#555555')
//         .text(`#${data.paymentId}`, 400, startY + 35, { align: 'right' });

//       doc
//         .fontSize(9)
//         .text(`Date: ${data.date || new Date().toLocaleDateString()}`, 400, startY + 50, { align: 'right' });

   
//       doc
//         .moveTo(50, 150)
//         .lineTo(545, 150)
//         .strokeColor(accentColor)
//         .lineWidth(2)
//         .stroke();

    
//       let currentY = 180;
      
//       doc
//         .fontSize(12)
//         .fillColor(primaryColor)
//         .text('BILL TO:', 50, currentY);

//       currentY += 20;
//       doc
//         .fontSize(11)
//         .fillColor('#000000')
//         .text(data.studentName, 50, currentY);

//       currentY += 18;
//       doc
//         .fontSize(9)
//         .fillColor('#555555')
//         .text(`Student ID: ${data.studentId}`, 50, currentY);

  
//       currentY = 180;
//       const boxX = 320;
//       const boxWidth = 225;
//       const boxHeight = 80;

//       doc
//         .rect(boxX, currentY, boxWidth, boxHeight)
//         .fillColor(lightGray)
//         .fill();

//       doc
//         .fontSize(9)
//         .fillColor('#555555')
//         .text('Payment Method:', boxX + 15, currentY + 15)
//         .fillColor('#000000')
//         .text(data.method, boxX + 120, currentY + 15);

//       doc
//         .fillColor('#555555')
//         .text('Transaction ID:', boxX + 15, currentY + 32)
//         .fillColor('#000000')
//         .text(data.transactionId || 'N/A', boxX + 120, currentY + 32, { width: 90 });

//       doc
//         .fillColor('#555555')
//         .text('Status:', boxX + 15, currentY + 49)
//         .fillColor(data.status === 'completed' ? '#27AE60' : '#E74C3C')
//         .text(data.status.toUpperCase(), boxX + 120, currentY + 49);

     
//       currentY = 290;

//       doc
//         .rect(50, currentY, 495, 25)
//         .fillColor(primaryColor)
//         .fill();

//       doc
//         .fontSize(10)
//         .fillColor('#FFFFFF')
//         .text('DESCRIPTION', 60, currentY + 8)
//         .text('AMOUNT', 450, currentY + 8);

   
//       currentY += 25;
//       doc
//         .rect(50, currentY, 495, 35)
//         .fillColor('#FFFFFF')
//         .fill()
//         .strokeColor('#DDDDDD')
//         .lineWidth(1)
//         .stroke();

//       doc
//         .fontSize(10)
//         .fillColor('#000000')
//         .text('School Fee Payment', 60, currentY + 12)
//         .text(`₹${data.amount.toFixed(2)}`, 430, currentY + 12, { width: 100, align: 'right' });

   
//       currentY += 60;
//       const labelX = 370;
//       const valueX = 470;

//       doc
//         .fontSize(10)
//         .fillColor('#555555')
//         .text('Subtotal:', labelX, currentY)
//         .fillColor('#000000')
//         .text(`₹${data.amount.toFixed(2)}`, valueX, currentY, { align: 'right' });

//       currentY += 20;
//       doc
//         .fillColor('#555555')
//         .text('Tax (0%):', labelX, currentY)
//         .fillColor('#000000')
//         .text('₹0.00', valueX, currentY, { align: 'right' });

//       currentY += 5;
//       doc
//         .moveTo(labelX, currentY)
//         .lineTo(545, currentY)
//         .strokeColor('#DDDDDD')
//         .lineWidth(1)
//         .stroke();

//       currentY += 15;
//       doc
//         .fontSize(14)
//         .fillColor(primaryColor)
//         .text('TOTAL:', labelX, currentY)
//         .fontSize(16)
//         .fillColor(accentColor)
//         .text(`₹${data.amount.toFixed(2)}`, valueX, currentY, { align: 'right' });

//       currentY = 700;
//       doc
//         .moveTo(50, currentY)
//         .lineTo(545, currentY)
//         .strokeColor('#DDDDDD')
//         .lineWidth(1)
//         .stroke();

//       currentY += 15;
//       doc
//         .fontSize(9)
//         .fillColor('#777777')
//         .text('Thank you for your payment!', 50, currentY, { align: 'center', width: 495 });

//       currentY += 15;
//       doc
//         .fontSize(8)
//         .fillColor('#999999')
//         .text(
//           'This is a computer-generated invoice and does not require a signature.',
//           50,
//           currentY,
//           { align: 'center', width: 495 }
//         );

//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// }










import PDFDocument from "pdfkit";
import streamifier from "streamifier";
import cloudinary from '../../../infrastructure/config/cloudinary';
import { InvoiceData } from "../../../presentation/http/interface/InvoiceData";
import axios from "axios";

export async function generateAndUploadInvoice(
  data: InvoiceData
): Promise<{ pdfBuffer: Buffer; invoiceUrl: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", async () => {
        const pdfBuffer = Buffer.concat(buffers);

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "Invoices",
            resource_type: "raw",
            public_id: `Invoice-${data.paymentId}`,
          },
          (error, result) => {
            if (error) reject(error);
            else {
              resolve({
                pdfBuffer,
                invoiceUrl: result!.secure_url,
              });
            }
          }
        );

        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
      });

      const primaryColor = '#2C3E50';
      const accentColor = '#3498DB';
      const lightGray = '#ECF0F1';

      let startY = 50;

      // Institute logo
      if (data.instituteLogo) {
        try {
          const response = await axios.get(data.instituteLogo, {
            responseType: "arraybuffer",
          });
          const img = Buffer.from(response.data, "binary");
          doc.image(img, 50, startY, { width: 70, height: 70 });
        } catch (err) {
          console.error("Logo loading failed:", err);
        }
      }

      // Institute info
      doc
        .fontSize(20)
        .fillColor(primaryColor)
        .text(data.instituteName, 140, startY, { align: 'left' });

      doc
        .fontSize(9)
        .fillColor('#555555')
        .text(data.instituteEmail, 140, startY + 25)
        .text(data.institutePhone, 140, startY + 38)
        .text(data.instituteAddress, 140, startY + 51, { width: 400 });

      // Invoice title
      doc
        .fontSize(28)
        .fillColor(accentColor)
        .text('INVOICE', 400, startY, { align: 'right' });

      doc
        .fontSize(10)
        .fillColor('#555555')
        .text(`#${data.paymentId}`, 400, startY + 35, { align: 'right' })
        .text(`Date: ${data.date || new Date().toLocaleDateString()}`, 400, startY + 50, { align: 'right' });

      // Horizontal line
      doc
        .moveTo(50, 150)
        .lineTo(545, 150)
        .strokeColor(accentColor)
        .lineWidth(2)
        .stroke();

      let currentY = 180;

      // Bill To
      doc
        .fontSize(12)
        .fillColor(primaryColor)
        .text('BILL TO:', 50, currentY);

      currentY += 20;
      doc
        .fontSize(11)
        .fillColor('#000000')
        .text(data.studentName, 50, currentY);

      currentY += 18;
      doc
        .fontSize(9)
        .fillColor('#555555')
        .text(`Student ID: ${data.studentId}`, 50, currentY);

      // Payment box
      currentY = 180;
      const boxX = 320;
      const boxWidth = 225;
      const boxHeight = 80;

      doc
        .rect(boxX, currentY, boxWidth, boxHeight)
        .fillColor(lightGray)
        .fill();

      doc
        .fontSize(9)
        .fillColor('#555555')
        .text('Payment Method:', boxX + 15, currentY + 15)
        .fillColor('#000000')
        .text(data.method, boxX + 120, currentY + 15);

      doc
        .fillColor('#555555')
        .text('Transaction ID:', boxX + 15, currentY + 32)
        .fillColor('#000000')
        .text(data.transactionId || 'N/A', boxX + 120, currentY + 32, { width: 90 });

      doc
        .fillColor('#555555')
        .text('Status:', boxX + 15, currentY + 49)
        .fillColor(data.status.toLowerCase() === 'paid' ? '#27AE60' : '#E74C3C')
        .text(data.status.toUpperCase(), boxX + 120, currentY + 49);

      // Description Header
      currentY = 290;
      doc
        .rect(50, currentY, 495, 25)
        .fillColor(primaryColor)
        .fill();

      doc
        .fontSize(10)
        .fillColor('#FFFFFF')
        .text('DESCRIPTION', 60, currentY + 8)
        .text('AMOUNT', 450, currentY + 8);

      // Fee item
      currentY += 25;
      doc
        .rect(50, currentY, 495, 35)
        .fillColor('#FFFFFF')
        .fill()
        .strokeColor('#DDDDDD')
        .lineWidth(1)
        .stroke();

      const descriptionText = `${data.feeTypeName || 'Fee Payment'}\n${data.feeDescription || ''}`;
      doc
        .fontSize(10)
        .fillColor('#000000')
        .text(descriptionText, 60, currentY + 12, { width: 350 })
        .text(`₹${data.amount.toFixed(2)}`, 430, currentY + 12, { width: 100, align: 'right' });

      // Subtotal & total
      currentY += 60;
      const labelX = 370;
      const valueX = 470;

      doc
        .fontSize(10)
        .fillColor('#555555')
        .text('Subtotal:', labelX, currentY)
        .fillColor('#000000')
        .text(`₹${data.amount.toFixed(2)}`, valueX, currentY, { align: 'right' });

      currentY += 20;
      doc
        .fillColor('#555555')
        .text('Tax (0%):', labelX, currentY)
        .fillColor('#000000')
        .text('₹0.00', valueX, currentY, { align: 'right' });

      currentY += 5;
      doc
        .moveTo(labelX, currentY)
        .lineTo(545, currentY)
        .strokeColor('#DDDDDD')
        .lineWidth(1)
        .stroke();

      currentY += 15;
      doc
        .fontSize(14)
        .fillColor(primaryColor)
        .text('TOTAL:', labelX, currentY)
        .fontSize(16)
        .fillColor(accentColor)
        .text(`₹${data.amount.toFixed(2)}`, valueX, currentY, { align: 'right' });

      // Footer
      currentY = 700;
      doc
        .moveTo(50, currentY)
        .lineTo(545, currentY)
        .strokeColor('#DDDDDD')
        .lineWidth(1)
        .stroke();

      currentY += 15;
      doc
        .fontSize(9)
        .fillColor('#777777')
        .text('Thank you for your payment!', 50, currentY, { align: 'center', width: 495 });

      currentY += 15;
      doc
        .fontSize(8)
        .fillColor('#999999')
        .text(
          'This is a computer-generated invoice and does not require a signature.',
          50,
          currentY,
          { align: 'center', width: 495 }
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

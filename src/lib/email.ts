// src/lib/email.ts
import nodemailer from 'nodemailer';

type OrderData = {
  orderId: string;
  customerName: string;
  items: any[];
  shipping: any;
  total: number;
  orderDate: string;
};

type EmailOptions = {
  to: string;
  subject: string;
  orderData: OrderData;
};

export async function sendOrderConfirmationEmail({ to, subject, orderData }: EmailOptions) {
  // Create a transporter for Yahoo Mail
  const transporter = nodemailer.createTransport({
    service: 'yahoo',
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: 'kristinikolla1@yahoo.com',
      pass: process.env.EMAIL_PASSWORD, // Store this in your .env file
    },
  });

  // Format items for email
  const itemsList = orderData.items.map(item => {
    return `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} ${item.color ? `(${item.color})` : ''} ${item.size ? `- Size ${item.size}` : ''}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">€${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  // Calculate subtotal
  const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate shipping (example: free over €50)
  const shipping = subtotal >= 50 ? 0 : 5;
  
  // Calculate tax (example: 20% VAT)
  const tax = subtotal * 0.2;

  // Email content
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4f46e5; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0;">Order Confirmation</h1>
      </div>
      
      <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
        <p>Hello ${orderData.customerName},</p>
        <p>Thank you for your order! We're pleased to confirm that we've received your order and it's being processed.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
          <p style="margin: 0;"><strong>Order Number:</strong> #${orderData.orderId}</p>
          <p style="margin: 8px 0 0;"><strong>Order Date:</strong> ${orderData.orderDate}</p>
        </div>
        
        <h2 style="border-bottom: 2px solid #4f46e5; padding-bottom: 10px; color: #4f46e5;">Order Summary</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Quantity</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 10px; text-align: right;">€${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="padding: 10px; text-align: right;">€${shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax (20% VAT):</strong></td>
              <td style="padding: 10px; text-align: right;">€${tax.toFixed(2)}</td>
            </tr>
            <tr style="background-color: #f9fafb;">
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.1em;">€${orderData.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <h2 style="border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-top: 30px; color: #4f46e5;">Delivery Information</h2>
        
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div style="width: 48%; margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">Shipping Address</h3>
            <p style="margin: 0; line-height: 1.5;">
              ${orderData.shipping.firstName} ${orderData.shipping.lastName}<br>
              ${orderData.shipping.address}<br>
              ${orderData.shipping.city}${orderData.shipping.postalCode ? ', ' + orderData.shipping.postalCode : ''}<br>
              ${orderData.shipping.country}<br>
              Phone: ${orderData.shipping.phone}
            </p>
          </div>
          
          <div style="width: 48%; margin-bottom: 20px;">
            <h3 style="margin-bottom: 10px;">Payment Method</h3>
            <p style="margin: 0; line-height: 1.5;">
              Cash on Delivery<br>
              Amount to be paid: <strong>€${orderData.total.toFixed(2)}</strong><br>
              Please have the exact amount ready upon delivery.
            </p>
          </div>
        </div>
        
        <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          Your order will be delivered to your address within 2-3 business days. If you have any questions about your order, please contact us at <a href="mailto:kristinikolla1@yahoo.com" style="color: #4f46e5;">kristinikolla1@yahoo.com</a>.
        </p>
        
        <p>Thank you for shopping with i Optika!</p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 0.8em; color: #6b7280; margin-top: 20px;">
        <p style="margin: 0;">© 2025 i Optika. All rights reserved.</p>
        <p style="margin: 5px 0 0;">Tirana, Albania</p>
      </div>
    </div>
  `;

  // Send email
  try {
    const info = await transporter.sendMail({
      from: '"i Optika Store" <kristinikolla1@yahoo.com>',
      to,
      subject,
      html,
    });
    
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
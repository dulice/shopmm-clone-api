const nodemailer = require("nodemailer");

const orderEmailTemplate = (order) => {
  return `
    <>
        <img
        src="https://laz-img-cdn.alicdn.com/images/ims-web/TB1C8nrfCzqK1RjSZFpXXakSXXa.png"
        alt=""
        />
        <h5>Your Package has been shipped!</h5>
        <h3>Hi ${order.address.fullName},</h3>
        <p>
        We are pleased to share that the item(s) from your order ${order._id} have
        been shipped.
        </p>
        <br />
        <p><b>DELIVERY DETAILS</b></p>
        <table>
            <tbody>
                <tr>
                    <td>Name</td>
                    <td>: ${order.address.fullName}</td>
                </tr>
                <tr>
                    <td>Address</td>
                    <td>
                        : ${order.address.address}, ${order.address.city},
                        ${order.address.state}
                    </td>
                </tr>
                <tr>
                    <td>Phone</td>
                    <td>: ${order.address.phoneNumber}</td>
                </tr>
            </tbody>
        </table>
        <br />
        <p><b>DELIVERY DETAILS</b></p>
        <br />
        <table>
            <tbody>
                ${order.items.map(item => 
                    `
                        <tr>
                            <td width="30%"><img src=${item.images[0]} alt="" width="100%"/></td>
                            <td width="70%">
                                <p color="orange">${item.productName}</p>
                                <p color="orange">Ks <b>${item.price}</b></p>
                                <p>Quantity : ${item.quantity}</p>
                            </td>
                        </tr>  
                    `
                )}                             
            </tbody>
        </table>
        <br />
        <table>
            <tbody>
                <tr>
                    <td style="font: 20px bold;">Subtotal</td>
                    <td style="font: 20px bold;">:  Ks ${order.productsPrice}</td>
                </tr>
                <tr>
                    <td style="font: 20px bold;">Shipping fess</td>
                    <td style="font: 20px bold;">:  Ks ${order.shippingFees}</td>
                </tr>
                <tr>
                    <td style="font: 20px bold; color: orange;">Total (GST Incl) </td>
                    <td style="font: 20px bold; color: orange;">:  Ks ${order.totalPrice}</td>
                </tr>
            </tbody>
        </table>
    </>
    `;
};

async function sendMail(order) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.AUTH_EMAIL,
          pass: process.env.AUTH_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
    });

  let info = {
    from: "shopmmclone@dev.com", // sender address
    to: order.address.email, // list of receivers
    subject: "Your order products", // Subject line
    html: orderEmailTemplate(order), // html body
}

  // send mail with defined transport object
  transporter.sendMail(info, (err) => {
    if(err) {
        console.log("error: ", err);
    } else {
        console.log("mail sent successfully");
    }
  });
}

module.exports = {sendMail};

const stripeAPI = require('../stripe');

async function createCheckoutSession(req, res) {
  const domainURL = process.env.WEB_APP_URL;
  const { line_items, customer_email } = req.body;
  console.log('line_items', line_items);
  console.log('customer_email', customer_email);
  if (!line_items || !customer_email) {
    return res
      .status(400)
      .json({ error: 'missing required session parameters' });
  }
  let session;
  try {
    session = await stripeAPI.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      customer_email,
      success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/canceled`,
      shipping_address_collection: { allowed_countries: ['GB', 'US', 'CA'] },
    });
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: 'an error occurred, unable to create session' });
  }
}

module.exports = createCheckoutSession;

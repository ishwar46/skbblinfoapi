const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Donation = require("../models/Donation");
const { sendEmail } = require("../middleware/nodeMailer");

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      let paymentIntent = event.data.object;
      const { userId, remarks } = paymentIntent.metadata;
      const amountDonated = paymentIntent.amount_received / 100;

      if (!paymentIntent.latest_charge) {
        paymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id, {
          expand: ["latest_charge"],
        });
      }

      let cardBrand = "";
      let cardLast4 = "";
      if (
        paymentIntent.latest_charge &&
        paymentIntent.latest_charge.payment_method_details &&
        paymentIntent.latest_charge.payment_method_details.card
      ) {
        const card = paymentIntent.latest_charge.payment_method_details.card;
        cardBrand = card.brand;
        cardLast4 = card.last4;
        console.log("Card details:", card);
      } else {
        console.log("No card details found in latest_charge.");
      }

      try {
        await User.findByIdAndUpdate(userId, {
          $inc: { donatedAmount: amountDonated },
          $push: {
            receipts: {
              fileName: `Stripe_${paymentIntent.id}`,
              filePath: `/receipts/${paymentIntent.id}.pdf`,
              uploadedAt: new Date(),
              remarks: remarks || "",
            },
          },
        });
        console.log("User document updated with new donation");
      } catch (err) {
        console.error("Error updating user after donation:", err);
      }

      try {
        const donationRecord = await Donation.create({
          userId,
          amount: amountDonated,
          remarks,
          paymentIntentId: paymentIntent.id,
          cardBrand,
          cardLast4,
        });
        console.log("Donation record created:", donationRecord);
      } catch (err) {
        console.error("Error creating donation record:", err);
      }

      try {
        const user = await User.findById(userId);
        if (user && user.email) {
          const templatePath = path.join(
            __dirname,
            "../utils/donationReceiptEmail.html"
          );
          let emailTemplate = fs.readFileSync(templatePath, "utf-8");
          emailTemplate = emailTemplate.replace("{{fullName}}", user.fullName);
          emailTemplate = emailTemplate.replace(
            "{{donationAmount}}",
            amountDonated.toFixed(2)
          );
          emailTemplate = emailTemplate.replace(
            "{{paymentIntentId}}",
            paymentIntent.id
          );
          emailTemplate = emailTemplate.replace(
            "{{date}}",
            new Date().toLocaleDateString()
          );
          emailTemplate = emailTemplate.replace(
            "{{remarks}}",
            remarks || "None"
          );
          emailTemplate = emailTemplate.replace(
            "{{cardBrand}}",
            cardBrand ? cardBrand.toUpperCase() : "CARD"
          );
          emailTemplate = emailTemplate.replace(
            "{{cardLast4}}",
            cardLast4 || "****"
          );

          await sendEmail({
            from: "skbbl@gmail.com",
            to: user.email,
            subject:
              "Donation Receipt - Sana Kisan Bikas Laghubitta Bittiya Sanstha Ltd",
            html: emailTemplate,
          });
          console.log("Donation receipt email sent to", user.email);
        }
      } catch (err) {
        console.error("Error sending donation receipt email:", err);
      }
    }

    // Handle refund events
    else if (event.type === "charge.refunded") {
      const charge = event.data.object;
      const refundedAmountCents = charge.amount_refunded;
      const refundedAmount = refundedAmountCents / 100;

      let paymentIntent;
      try {
        paymentIntent = await stripe.paymentIntents.retrieve(
          charge.payment_intent,
          {
            expand: ["latest_charge"],
          }
        );
      } catch (error) {
        console.error("Error retrieving PaymentIntent for refund:", error);
      }

      const userId =
        paymentIntent &&
        paymentIntent.metadata &&
        paymentIntent.metadata.userId;
      if (userId) {
        try {
          // Subtract the refunded amount from the user's donatedAmount field
          await User.findByIdAndUpdate(userId, {
            $inc: { donatedAmount: -refundedAmount },
          });
          console.log(
            `User ${userId} donatedAmount reduced by $${refundedAmount}`
          );
        } catch (err) {
          console.error("Error updating user after refund:", err);
        }

        try {
          await Donation.findOneAndUpdate(
            { paymentIntentId: charge.payment_intent },
            { $set: { refunded: true, refundedAmount: refundedAmount } }
          );
          console.log("Donation record updated with refund details");
        } catch (err) {
          console.error("Error updating donation record after refund:", err);
        }
      } else {
        console.log("No userId found for refunded charge.");
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;

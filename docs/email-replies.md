# Customer reply templates

Paste-ready replies for answering customers from webmail
(https://webmail.cambodiafloral.com). Each one ends with the survey link.

**The survey link is per-order** — `https://cambodiafloral.com/survey?order=<ORDER_ID>`.
A generic link records nothing and shows the customer "we couldn't match this
link to an order". Generate the real one with:

```bash
npx tsx scripts/reply.ts <order-id-or-first-8-chars>
```

That prints every template below with the name, order number and link already
filled in.

**On the 5% offer:** it unlocks only when the customer does *both* — rates the
order and says how they found us. Don't promise it for one. Once earned it is
saved to their account and applies itself at their next checkout, so they never
need to type the code.

---

## 1. Thank you / general reply

> Hi {{FIRST_NAME}},
>
> Thank you for your order {{ORDER_SHORT}} — it's confirmed and we're taking
> care of it.
>
> If there's anything you'd like changed about the delivery, just reply to this
> email and it comes straight to us.
>
> When you have a moment, we'd love to know how you found us and how we did:
> {{SURVEY_LINK}}
> It takes one tap, and it earns you 5% off your next order.
>
> Warmly,
> Cambodia Floral
> Phnom Penh

---

## 2. After delivery

> Hi {{FIRST_NAME}},
>
> Your flowers were delivered — we hope they landed well.
>
> Would you tell us how it went? Rate the order and let us know how you found
> us, and we'll put 5% off your next order on your account:
> {{SURVEY_LINK}}
>
> Thank you for trusting a small shop in Phnom Penh with something that
> mattered.
>
> Warmly,
> Cambodia Floral

---

## 3. Answering a question (delivery time, address, changes)

> Hi {{FIRST_NAME}},
>
> {{YOUR ANSWER HERE}}
>
> Anything else, just reply — this reaches us directly.
>
> And if you have a spare moment afterwards, this helps us a lot:
> {{SURVEY_LINK}}
>
> Warmly,
> Cambodia Floral

---

## 4. Something went wrong

Do **not** attach the 5% offer to an apology — it reads as buying silence.
Fix the problem first, and only ask for feedback once they're happy.

> Hi {{FIRST_NAME}},
>
> I'm sorry — {{WHAT WENT WRONG}}. That isn't the standard we hold ourselves to.
>
> Here's what we're doing about it: {{WHAT YOU'RE DOING}}.
>
> If that doesn't put it right, tell me and we'll keep going until it is.
>
> {{YOUR NAME}}
> Cambodia Floral

---

## 5. Asking for a public review (only after a happy customer)

> Hi {{FIRST_NAME}},
>
> I'm so glad it went well — thank you for saying so.
>
> Would you be willing to say a few words publicly? It genuinely helps other
> people decide what to send to someone they love:
> {{REVIEW_LINK}}
>
> No pressure at all either way.
>
> Warmly,
> Cambodia Floral

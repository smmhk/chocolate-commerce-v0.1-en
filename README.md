# 🍫 Chocolate Commerce · Data Engineering Portfolio

What happens after you order a box of chocolates online? Follow a simulated order from checkout to a sales dashboard and see how I built the data pipeline behind it.

🛍️ [Live Portfolio](https://chocolate-commerce-v0-1-en.vercel.app/) · 📊 [Live Dashboard](https://datastudio.google.com/s/oscBmjlO6JM) · 🧑‍💻 [Pipeline & dbt Code](https://github.com/smmhk/chocolate-commerce-data-platform)

## 🍬 Follow a chocolate order

| Step | What you’ll see |
| --- | --- |
| 🛒 **Checkout** | Order `CCF-WEB-000014` starts at the demo chocolate shop. |
| 📦 **Ingestion & storage** | Kestra orchestrates the workflow as order data moves through PostgreSQL and Google Cloud Storage into BigQuery. |
| 🍫 **dbt modeling** | Order items are enriched with product details and rolled up into daily product sales. |
| 📊 **Data Studio** | Explore monthly online order trends and see which chocolates sell the most. |

## 🏪 What’s next?

The current release covers online orders and includes an in-store POS demo. Next, I’ll bring online and in-store orders together to compare what sells across channels.

const createPaymentRequestBody = (currencyCode, amountValue) => {
    const PaymentRequestBody = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "items": [
                    {
                        "name": "Transfer",
                        "description": "Transfer from SafePay",
                        "quantity": "1",
                        "unit_amount": {
                            "currency_code": currencyCode,
                            "value": amountValue
                        }
                    }
                ],
                "amount": {
                    "currency_code": currencyCode,
                    "value": amountValue,
                    "breakdown": {
                        "item_total": {
                            "currency_code": currencyCode,
                            "value": amountValue
                        }
                    }
                }
            }
        ],
        "application_context": {
            "return_url": "https://localhost:3000/payments/requests",
            "cancel_url": "https://localhost:3000"
        }
    }
  
    return PaymentRequestBody;
  };
  
  export default createPaymentRequestBody;
  
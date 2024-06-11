/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./App.css";

function App() {
  const [tokens, setTokens] = useState([]);
  const [prices, setPrices] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      const { data } = await axios.get(
        "https://interview.switcheo.com/prices.json"
      );
      setPrices(data);
      const currencies = data.map((item: any) => item.currency);
      setTokens(currencies);
    };
    fetchPrices();
  }, []);

  const validationSchema = Yup.object({
    fromToken: Yup.string().required("Required"),
    toToken: Yup.string().required("Required"),
    amount: Yup.number().required("Required").positive("Must be positive"),
  });

  const handleSubmit = (values: any) => {
    const fromPriceLabel = Object.values(values)[0];
    const toPriceLabel = Object.values(values)[1];
    const amount = Object.values(values)[2] as string;

    const fromPrice = prices.find(
      (item: any) => item.currency === fromPriceLabel
    ) as any;
    const toPrice = prices.find(
      (item: any) => item.currency === toPriceLabel
    ) as any;

    if (fromPrice && toPrice) {
      const result = (+amount * +fromPrice.price) / +toPrice.price;
      setResult(result as any);
    }
  };

  return (
    <div>
      <h1>Currency Swap</h1>
      <Formik
        initialValues={{ fromToken: "", toToken: "", amount: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="fromToken">From</label>
              <Field as="select" name="fromToken">
                <option value="">Select token</option>
                {tokens.map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="fromToken" component="div" />
            </div>

            <div>
              <label htmlFor="toToken">To</label>
              <Field as="select" name="toToken">
                <option value="">Select token</option>
                {tokens.map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="toToken" component="div" />
            </div>

            <div>
              <label htmlFor="amount">Amount</label>
              <Field type="number" name="amount" />
              <ErrorMessage name="amount" component="div" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              Swap
            </button>
          </Form>
        )}
      </Formik>

      {result && (
        <div>
          <h2>Result</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;

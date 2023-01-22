import React from "react";
import Form from "./form";
import Results from "./results";
import Layout from "./layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  const [notes, setNotes] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [hasResult, setHasResult] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  async function getEmail(notes: string) {
    try {
      const response = await fetch(`/api/getemail?notes=${notes}`);
      if (response.status === 429) {
        errorNotification(
          "Request limit per hour reached. Please wait for some time before making another request."
        );
        setIsLoading(false);
        return Promise.reject();
      }
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  const errorNotification = (text: string) => {
    toast.error(text, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const onSubmit = () => {
    console.log("Submitting: " + notes);
    setIsLoading(true);
    getEmail(notes)
      .then((res) => res!.json())
      .then(onResult);
  };

  const onResult = (data: any) => {
    setEmail(data.email);
    setHasResult(true);
    setIsLoading(false);
  };

  const onReset = () => {
    setEmail("");
    setHasResult(false);
    setIsLoading(false);
  };

  const onEnterPress = (event: any) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  let displayedElement = null;

  if (hasResult) {
    displayedElement = <Results notes={notes} email={email} onBack={onReset} />;
  } else {
    displayedElement = (
      <Form
        notes={notes}
        setNotes={setNotes}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onEnterPress={onEnterPress}
      />
    );
  }

  return (
    <Layout>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {displayedElement}
    </Layout>
  );
};

export default Main;

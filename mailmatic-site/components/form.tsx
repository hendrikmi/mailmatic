import { useRouter } from "next/router";
import { auth } from "../utils/firebaseApp";
import { useAuthState } from "react-firebase-hooks/auth";
import React from "react";
import LoadingSpinner from "./spinner";

interface FormProps {
  notes: string;
  setNotes: any;
  onSubmit: any;
  isLoading: boolean;
  onEnterPress: any;
}

const Form: React.FC<FormProps> = (props) => {
  const route = useRouter();
  const [user, isLoadingUser] = useAuthState(auth);
  let characterLimit = user ? 300 : 150;
  const isNotesTextValid = props.notes.length < characterLimit;
  const updateNotesText = (text: string) => {
    if (text.length <= characterLimit) {
      props.setNotes(text);
    }
  };

  let statusColor = "text-slate-500";
  let statusText = null;
  if (!isNotesTextValid) {
    statusColor = "text-red-400";
    statusText = `Notes must be less than ${characterLimit} characters.`;
  }

  const submitButtonContent = () => {
    if (props.isLoading) {
      return (
        <div>
          <LoadingSpinner />
          {"Loading..."}
        </div>
      );
    } else {
      return <div>{"Submit"}</div>;
    }
  };

  return (
    <>
      <div className="mb-6 text-slate-400">
        <p>
          Send perfect emails with ease! Provide a few notes and let AI do the
          writing for you.
        </p>
      </div>
      <textarea
        className="textarea"
        cols={40}
        rows={6}
        placeholder="out of office"
        value={props.notes}
        maxLength={characterLimit}
        onChange={(e) => updateNotesText(e.currentTarget.value)}
        onKeyDown={(e) => props.onEnterPress(e)}
        disabled={props.isLoading}
      ></textarea>
      <div className={statusColor + " flex justify-between my-1 mb-6 text-sm"}>
        <div>{statusText}</div>
        <div>
          {props.notes.length}/{characterLimit}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <button
          className="button-gradient"
          onClick={props.onSubmit}
          disabled={props.isLoading || !isNotesTextValid}
        >
          {submitButtonContent()}
        </button>
        <button
          className="button-slate"
          onClick={() => route.push("/auth")}
          disabled={props.isLoading || !isNotesTextValid}
        >
          Sign in
        </button>
      </div>
    </>
  );
};
export default Form;

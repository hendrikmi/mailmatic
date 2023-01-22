interface ResultsProps {
  notes: string;
  email: string;
  onBack: any;
}

const Results: React.FC<ResultsProps> = (props) => {
  const newLineText = (text: string) => {
    return text.split("\n").map((item, i) => <p key={i}>{item}</p>);
  };

  const resultsSection = (label: string, body: any) => {
    return (
      <div className="bg-slate-700 p-4 my-3 rounded-md">
        <div className="text-slate-400 text-sm font-bold mb-4">
          <b>{label}</b>
        </div>
        <div>{newLineText(body)}</div>
      </div>
    );
  };

  return (
    <>
      <div>
        {resultsSection("Your Notes", props.notes)}
        {resultsSection("Your AI-written Email", props.email)}
      </div>
      <button className="button-gradient" onClick={props.onBack}>
        Back
      </button>
    </>
  );
};
export default Results;
